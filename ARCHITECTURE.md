# 🏗️ Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Data Flow Diagram](#data-flow-diagram)
3. [WebSocket Protocol](#websocket-protocol)
4. [Undo/Redo Strategy](#undoredo-strategy)
5. [Performance Decisions](#performance-decisions)
6. [Conflict Resolution](#conflict-resolution)
7. [Room System Architecture](#room-system-architecture)
8. [Technology Choices](#technology-choices)
9. [Code Organization](#code-organization)

---

## System Overview

### High-Level Architecture
┌─────────────────────────────────────────────────────────────┐
│ Browser (Client) │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Canvas │ │ WebSocket │ │ LocalStorage │ │
│ │ Drawing │◄─┤ Client │◄─┤ Persistence │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│ │ │ │
└─────────┼──────────────────┼───────────────────────────────┘
│ │
│ WebSocket Protocol
│ │
┌─────────┼──────────────────┼───────────────────────────────┐
│ │ ▼ │
│ ┌──────▼──────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Canvas │ │ WebSocket │ │ Room │ │
│ │ Render │ │ Server │◄─┤ Management │ │
│ └─────────────┘ └──────────────┘ └──────────────┘ │
│ Node.js Server │
└─────────────────────────────────────────────────────────────┘

### Component Responsibilities

**Client Components:**
- **canvas.js**: Canvas drawing operations, path management, performance tracking
- **websocket.js**: WebSocket connection, auto-reconnection, message queuing
- **main.js**: Application coordination, room management, user state

**Server Components:**
- **server.js**: WebSocket server, message broadcasting, room routing
- **rooms.js**: Room creation/deletion, user tracking per room
- **drawing-state.js**: Utility functions (future server-side persistence)

---

## Data Flow Diagram

### Drawing Flow (User A → User B)

User A (Browser) Server User B (Browser)
─────────────────────────────────────────────────────────────────────

Mouse Down
│
├─► startDraw(e)
│ - Create path object
│ - Store color, width
│ - Add first point
│

Mouse Move (multiple times)
│
├─► draw(e)
│ - Add points to path
│ - redraw() canvas
│ - updateFPS()
│

Mouse Up
│
├─► endDraw()
- paths.push(path)
- saveRoomState()
│
└─► ws.send('draw-path') ─────► Receive Message
│
├─► Parse JSON
│
├─► Validate roomId
│
└─► broadcast() ─────► ws.on('draw-path')
to room │
├─► addRemotePath()
│
└─► redraw()
- Draw all paths
- Draw cursors

### Cursor Movement Flow

User A Server User B
──────────────────────────────────────────────────────────────────

Mouse Move (throttled 50ms)
│
├─► getPos(e)
│ - Calculate coords
│ - Scale for canvas
│
└─► ws.send('cursor-move') ─────► Parse message
{ x, y, userId } │
├─► broadcast()
│ to room
│
└───────────────► ws.on('cursor-move')
│
├─► Store in cursors{}
│
└─► drawCursors()
- Draw colored dot
- Draw user name

### Room Join Flow

User Server
────────────────────────────────────────────────────

Open URL: ?room=design
│
├─► Parse URLSearchParams
│ currentRoom = 'design'
│
└─► ws.on('open')
│
└─► ws.send('join', { roomId: 'design' })
│
├─► rooms.leaveRoom(old)
│
├─► rooms.joinRoom(new)
│
├─► getRoomUsers()
│
├─► ws.send('init') ───► Receive user list
│ Update UI
│
└─► broadcast('user-joined')
to room │
├─► Show notification
└─► Update user list



---
## WebSocket Protocol

### Message Format

All messages follow JSON format:
{
"type": "message-type",
"...": "additional fields"
}

### Client → Server Messages

#### 1. Join Room
{
"type": "join",
"roomId": "design"
}

#### 2. Draw Path
{
"type": "draw-path",
"userId": "user_123",
"roomId": "design",
"path": {
"color": "#ff0000",
"width": 5,
"erasing": false,
"points": [, , ],
"timestamp": 1699123456789
}
}

#### 3. Undo
{
"type": "undo",
"userId": "user_123",
"roomId": "design"
}

#### 4. Redo
{
"type": "redo",
"userId": "user_123",
"roomId": "design"
}

#### 5. Clear Canvas
{
"type": "clear-canvas",
"userId": "user_123",
"roomId": "design"
}

#### 6. Cursor Move
{
"type": "cursor-move",
"userId": "user_123",
"roomId": "design",
"x": 450,
"y": 300
}

#### 7. Ping (Latency Check)
{
"type": "ping"
}

### Server → Client Messages

#### 1. Init (After Join)
{
"type": "init",
"userId": "user_123",
"users": {
"user_123": {
"id": "user_123",
"name": "User 1",
"color": "#ff5733"
},
"user_124": {
"id": "user_124",
"name": "User 2",
"color": "#33ff57"
}
}
}

#### 2. User Joined
{
"type": "user-joined",
"userId": "user_125",
"user": {
"id": "user_125",
"name": "User 3",
"color": "#3357ff"
}
}

#### 3. User Left
{
"type": "user-left",
"userId": "user_124"
}

#### 4. Draw Path (Broadcast)
{
"type": "draw-path",
"userId": "user_123",
"path": { /* path object */ }
}

#### 5. Pong (Latency Response)
{
"type": "pong"
}

### Message Flow Patterns

**Pattern 1: Request-Broadcast**
Client A ──► Server ──► Broadcast to all in room

Used for: draw-path, undo, redo, clear-canvas, cursor-move

**Pattern 2: Request-Response**
Client ──► Server ──► Response to sender only

Used for: join (init response), ping (pong response)

**Pattern 3: Event-Broadcast**
Server Event ──► Broadcast to affected room


Used for: user-joined, user-left (on connect/disconnect)

---

## Undo/Redo Strategy

### Challenge
Multiple users drawing simultaneously need synchronized undo/redo without conflicts.

### Chosen Approach: Global History Stack

**Data Structure:**
// Each client maintains:
{
paths: [path1, path2, path3, ...], // Drawing history
redoStack: [] // Undone operations
}

**How It Works:**

1. **User A draws** → `paths.push(newPath)`
2. **User A undos** → 
redoStack.push(paths.pop())
broadcast('undo')

3. **All clients receive undo** →
redoStack.push(paths.pop())
redraw()

**Flow Diagram:**
Initial State:
User A: paths=[P1, P2, P3]
User B: paths=[P1, P2, P3]

User B clicks Undo:
User B: paths=[P1, P2], redoStack=[P3]
↓ broadcast('undo')
User A: paths=[P1, P2], redoStack=[P3]

User A clicks Redo:
User A: paths=[P1, P2, P3], redoStack=[]
↓ broadcast('redo')
User B: paths=[P1, P2, P3], redoStack=[]

### Trade-offs

**✅ Advantages:**
- Simple implementation
- Consistent state across all clients
- Works with any number of users
- No complex conflict resolution needed

**⚠️ Disadvantages:**
- User A can undo User B's drawing
- No per-user undo (global only)
- Order-dependent (last action undone first)

### Alternative Approaches Considered

**1. Per-User Undo (Rejected)**
{
paths: [
{ userId: 'user_1', path: {...} },
{ userId: 'user_2', path: {...} }
]
}
// User 1 undo only removes User 1's paths

**Why Rejected:** Complex implementation, harder to maintain consistency

**2. Operation Transformation (Rejected)**
// Transform operations based on concurrent changes
// Similar to Google Docs

**Why Rejected:** Overkill for this use case, very complex

**3. CRDT (Conflict-Free Replicated Data Type) (Rejected)**
// Eventual consistency with mathematical guarantees

**Why Rejected:** Too advanced, not required for assignment

---

**Continue in next response...**

Would you like me to continue with the rest of ARCHITECTURE.md?