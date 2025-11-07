# 🖌️ Real-Time Collaborative Drawing Canvas

A production-ready multi-user drawing application where multiple people can draw simultaneously on isolated canvases with real-time synchronization.

## 🌟 Features Overview

### ✅ Core Features (100%)
- **Drawing Tools**: Brush with color picker, adjustable stroke width (1-20px), eraser
- **Real-time Synchronization**: Instant drawing updates across all connected users
- **User Cursor Indicators**: See colored dots showing where other users are drawing
- **Global Undo/Redo**: Synchronized undo/redo operations across all users
- **User Management**: Live user list with unique colors per user
- **Conflict Resolution**: Last-write-wins strategy for overlapping drawings

### ⭐ Bonus Features (80%)
- **Room System**: Multiple isolated canvases - users can join different rooms
- **Drawing Persistence**: Auto-save to localStorage, survives browser refresh
- **Performance Metrics**: Real-time FPS counter, network latency, path count
- **Mobile Touch Support**: Full touch event support for tablets and smartphones
- **Auto-Reconnection**: Automatic reconnection with exponential backoff strategy
- **Connection Status**: Visual indicator showing connection state
- **User Notifications**: Toast notifications for user join/leave events

## 🎯 Assignment Requirements Met

| Requirement | Status | Implementation |
|------------|--------|----------------|
| Drawing Tools | ✅ Complete | Brush, eraser, colors, width adjustment |
| Real-time Sync | ✅ Complete | WebSocket-based instant synchronization |
| User Indicators | ✅ Complete | Cursor position tracking with names |
| Undo/Redo | ✅ Complete | Global state synchronization |
| User Management | ✅ Complete | Color-coded user list |
| Mobile Support | ✅ Bonus | Touch events with coordinate scaling |
| Room System | ✅ Bonus | URL-based room isolation |
| Persistence | ✅ Bonus | LocalStorage auto-save |
| Performance Metrics | ✅ Bonus | FPS, latency, path tracking |

## 📋 Quick Start

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation & Run
1. Navigate to project folder
cd collaborative-canvas

2. Install dependencies (only once)
npm install

3. Start server
npm start

4. Open browser
Visit: http://localhost:3000


**That's it! Server runs on port 3000 by default.**

## 🧪 Testing Instructions

### Test 1: Local Multi-User (Single Device)

1. Start server
npm start

2. Open multiple tabs
Tab 1: http://localhost:3000
Tab 2: http://localhost:3000
Tab 3: http://localhost:3000

3. Test synchronization
Draw in Tab 1 → Appears instantly in Tab 2 & 3

Move mouse in Tab 1 → Cursor indicator appears in Tab 2 & 3

Click Undo in Tab 2 → Removes last stroke in all tabs

Change colors in different tabs → Each user draws different color

### Test 2: Room Isolation

1. Open different rooms
Tab 1: http://localhost:3000?room=design
Tab 2: http://localhost:3000?room=dev
Tab 3: http://localhost:3000?room=design

2. Test isolation
Draw in Tab 1 → Appears in Tab 3 (same room) ✅

Draw in Tab 1 → Does NOT appear in Tab 2 (different room) ✅

User count shows only users in same room

### Test 3: Network Multi-Device
1. Find your local IP
Windows: ipconfig
Mac/Linux: ifconfig or ip addr

Example: 192.168.1.100
2. On other devices (same WiFi)
Device 1: http://192.168.1.100:3000
Device 2: http://192.168.1.100:3000
Device 3: http://192.168.1.100:3000?room=team

3. Test cross-device
Draw on phone → Appears on laptop instantly

Touch draw on tablet → Syncs to desktop

Test different rooms across devices

### Test 4: Mobile Touch Support

On mobile browser (Chrome/Safari)
Open: http://localhost:3000 or http://<your-ip>:3000

Touch and drag to draw

Pinch to zoom (browser default)

Two-finger scroll works

Touch eraser, undo, redo buttons

### Test 5: Persistence

1. Draw something
2. Close browser tab completely
3. Reopen: http://localhost:3000
Drawing is still there! ✅
Test per-room persistence
1. Draw in room "design": http://localhost:3000?room=design
2. Switch to room "dev": http://localhost:3000?room=dev
3. Draw different content
4. Switch back to "design"
Original "design" drawing restored! ✅

### Test 6: Auto-Reconnection

1. Draw something
2. Stop server (Ctrl+C in terminal)
3. Connection status turns red: "● Disconnected"
4. Restart server: npm start
5. Connection status turns orange: "⟳ Reconnecting..."
6. After 3 seconds: "● Connected" (green)
7. Continue drawing - everything works!

## 🎮 User Guide

### Basic Drawing
1. **Select Color**: Click color picker, choose any color
2. **Adjust Width**: Drag width slider (1-20 pixels)
3. **Draw**: Click/touch and drag on white canvas
4. **Erase**: Click "🧽 Eraser" button, then draw to erase
5. **Undo**: Click "↶ Undo" to remove last stroke (global)
6. **Redo**: Click "↷ Redo" to restore undone stroke
7. **Clear All**: Click "🗑️ Clear" to clear entire canvas (all users)

### Room Management
1. **Current Room**: Displayed at top ("Room: main")
2. **Change Room**: Click "📍 Change Room" button
3. **Enter Room Name**: Type custom name or click quick button
4. **Quick Rooms**: Main, Design, Dev, Private
5. **URL Method**: Add `?room=yourname` to URL

### Performance Monitoring
- **Top Right Corner**: Performance stats
  - **FPS**: Rendering frames per second (60 = smooth)
  - **Latency**: Network ping time in milliseconds
  - **Paths**: Total number of drawing strokes

### Connection Status
- **Top Left Corner**: Connection indicator
  - **Green "● Connected"**: All good, ready to draw
  - **Orange "⟳ Reconnecting..."**: Attempting reconnection
  - **Red "● Disconnected"**: No connection, check network

## 🏗️ Technical Architecture

### Frontend (Vanilla JavaScript)
client/
├── index.html # UI structure with room modal
├── style.css # Responsive styling
├── canvas.js # Canvas API + drawing logic
├── websocket.js # WebSocket client + reconnection
└── main.js # App coordination + room handling

### Backend (Node.js + Express)
server/
├── server.js # Express + WebSocket server
├── rooms.js # Room management logic
└── drawing-state.js # State utilities (future use)

### Technology Stack
- **Frontend**: ES6 Modules, HTML5 Canvas API, WebSocket API
- **Backend**: Node.js, Express 4.18, ws 8.13
- **Storage**: Browser LocalStorage (client-side)
- **Protocol**: WebSocket (native, not Socket.io)

### Key Design Decisions

**Why Vanilla JavaScript?**
- Assignment requirement (no frameworks)
- Full control over implementation
- Demonstrates core web skills
- Smaller bundle size

**Why Native WebSocket?**
- Lower latency than Socket.io
- No polling overhead
- Simpler for this use case
- Educational value

**Why LocalStorage?**
- No database setup needed
- Works offline
- Fast access
- Simple persistence

## ⚠️ Known Limitations

1. **Client-Side Storage Only**
   - Drawings stored in browser localStorage
   - Not synced to server
   - New users joining room don't see existing drawings
   - Clearing browser data loses drawings

2. **No Authentication**
   - Anyone can join any room
   - No password protection
   - No user accounts

3. **No Drawing History**
   - Can't replay drawing process
   - No timeline feature
   - Can't see who drew what

4. **Storage Limits**
   - LocalStorage ~5MB per domain
   - Very large drawings may hit limit
   - No warning before limit

5. **Network Dependency**
   - Requires stable internet
   - High latency affects cursor smoothness
   - Disconnection loses real-time features

6. **Browser Compatibility**
   - Requires WebSocket support (all modern browsers)
   - LocalStorage support needed
   - Touch events for mobile

## 🔧 Troubleshooting

### Server Won't Start
Error: Port 3000 already in use
Solution: Kill existing process or change port
Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

Mac/Linux
lsof -ti:3000 | xargs kill -9

Or change port in server.js:
const PORT = process.env.PORT || 3001;

### Can't Connect from Other Devices
Check firewall
Windows: Allow Node.js through firewall
Mac: System Preferences → Security → Firewall
Check network
Ensure all devices on same WiFi
Try ping: ping 192.168.1.100
text

### Drawing Not Appearing
Check browser console (F12)
Look for WebSocket errors
Verify server is running
Try refreshing page
Clear localStorage: localStorage.clear()
text

### Performance Issues
Check FPS counter (top right)
If FPS < 30:
- Close other browser tabs
- Reduce canvas size
- Limit number of paths (clear old drawings)

## 🚀 Deployment (Optional)

### Deploy to Heroku
1. Install Heroku CLI
2. Login
heroku login

3. Create app
heroku create your-app-name

4. Deploy
git push heroku main

5. Open
heroku open

### Deploy to Vercel
1. Install Vercel CLI
npm i -g vercel

2. Deploy
vercel

3. Follow prompts
text

## 📊 Performance Metrics

### Expected Performance
- **FPS**: 60 (smooth rendering)
- **Latency**: 20-100ms (local network)
- **Max Users**: ~50 per room (not stress tested)
- **Max Paths**: ~1000 before lag (depends on device)

## ⏱️ Development Time

| Phase | Time | Details |
|-------|------|---------|
| Planning | 2h | Architecture design, tech stack |
| Core Drawing | 4h | Canvas operations, touch support |
| WebSocket | 3h | Real-time sync, message protocol |
| Cursor Tracking | 2h | Position broadcasting, rendering |
| Room System | 2h | URL routing, room isolation |
| Performance | 1h | FPS/latency tracking |
| Reconnection | 1h | Auto-reconnect logic |
| UI/UX | 2h | Styling, modals, notifications |
| Testing | 2h | Multi-user, cross-device |
| Documentation | 2h | README, ARCHITECTURE |
| **Total** | **~21h** | Production-ready quality |

## 👨‍💻 Author

**Your Name**  
Email: sm0881@srmist.edu.in  
GitHub: https://github.com/sohan181204
LinkedIn: https://www.linkedin.com/in/miryala-sohan-kumar-5642a626a/

## 📜 License

MIT License - Feel free to use for learning!

## 🙏 Acknowledgments

- HTML5 Canvas API Documentation
- WebSocket Protocol RFC 6455
- Node.js + Express Community
- Assignment guidelines and requirements

---

**Built with ❤️ for Real-Time Collaborative Systems Assignment**



