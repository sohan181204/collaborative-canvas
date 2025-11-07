# 🖌️ Real-Time Collaborative Drawing Canvas

A production-ready multi-user drawing application where multiple people can draw simultaneously on isolated canvases with real-time synchronization, user profiles, activity tracking, and smart user management.

## 🌐 Live Demo

**🚀 Deployed on Render**: **[https://collaborative-canvas-hdco.onrender.com](https://collaborative-canvas-hdco.onrender.com)**

**Try it now:**
1. Open the URL above
2. Draw something on the canvas
3. Open another tab/window with the same URL
4. Watch your drawings sync in real-time!

**Try different rooms (isolated canvases):**
- Main Room: [https://collaborative-canvas-hdco.onrender.com?room=main](https://collaborative-canvas-hdco.onrender.com?room=main)
- Design Team: [https://collaborative-canvas-hdco.onrender.com?room=design](https://collaborative-canvas-hdco.onrender.com?room=design)
- Dev Team: [https://collaborative-canvas-hdco.onrender.com?room=dev](https://collaborative-canvas-hdco.onrender.com?room=dev)

**⚠️ Note**: Free tier apps sleep after 15 minutes of inactivity. First load may take 30-60 seconds.

---

## 🌟 Features Overview

### ✅ Core Features (100%)
- **Drawing Tools**: Brush with color picker, adjustable stroke width (1-20px), eraser
- **Real-time Synchronization**: Instant drawing updates across all connected users
- **User Cursor Indicators**: See colored dots showing where other users are drawing
- **Global Undo/Redo**: Synchronized undo/redo operations across all users
- **User Management**: Live user list with unique colors per user
- **Conflict Resolution**: Last-write-wins strategy for overlapping drawings
- **Smart User Numbering**: Counter resets when all users leave (User 1, 2, 3...)
- **Graceful Exit**: Dedicated exit button with confirmation and goodbye screen

### ⭐ New User Profile Features (100%) 🆕
- **Your Profile Badge**: Top-right corner displays "You: [Your Name]" with color-coded border
- **Rename Functionality**: Click ✏️ button to change your display name (3-20 characters)
- **Name Change Broadcasting**: All users see "[Old Name] is now [New Name]" notification
- **Persistent Identity**: Your name syncs across all users in the room

### ⭐ Activity Tracking Features (100%) 🆕
- **Drawing Activity Indicator**: Shows "[Username] is drawing..." when others draw
- **Real-time Activity**: Appears at top center for 2 seconds after drawing action
- **Color-coded Names**: Drawing user's name appears in their assigned color
- **Non-intrusive**: Auto-hides to keep canvas clear

### ⭐ Bonus Features (100%)
- **Room System**: Multiple isolated canvases - users can join different rooms
- **Drawing Persistence**: Auto-save to localStorage, survives browser refresh
- **Performance Metrics**: Real-time FPS counter, network latency, path count
- **Mobile Touch Support**: Full touch event support for tablets and smartphones
- **Responsive Design**: Optimized for desktop, tablet, and mobile (3 breakpoints)
- **Auto-Reconnection**: Automatic reconnection with exponential backoff strategy
- **Connection Status**: Visual indicator showing connection state
- **User Notifications**: Toast notifications for user join/leave/rename events
- **Heartbeat Detection**: Prevents ghost users with connection health checks

---

## 🎯 Assignment Requirements Met

| Requirement | Status | Implementation |
|------------|--------|----------------|
| Drawing Tools | ✅ Complete | Brush, eraser, colors, width adjustment |
| Real-time Sync | ✅ Complete | WebSocket-based instant synchronization |
| User Indicators | ✅ Complete | Cursor position tracking with names |
| Undo/Redo | ✅ Complete | Global state synchronization |
| User Management | ✅ Complete | Color-coded user list with smart numbering |
| **User Profile Badge** 🆕 | ✅ Complete | Top-right "You: [Name]" display with color |
| **Rename Functionality** 🆕 | ✅ Complete | In-app name change with broadcasting |
| **Drawing Activity Tracking** 🆕 | ✅ Complete | "[User] is drawing..." indicator |
| Mobile Support | ✅ Bonus | Touch events with coordinate scaling |
| Room System | ✅ Bonus | URL-based room isolation |
| Persistence | ✅ Bonus | LocalStorage auto-save per room |
| Performance Metrics | ✅ Bonus | FPS, latency, path tracking |
| Exit Functionality | ✅ Bonus | Graceful exit with confirmation |
| User Counter Reset | ✅ Bonus | Smart reset when all users leave |

---

## 📋 Quick Start (Local Development)

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation & Run

1. Clone the repository
git clone https://github.com/sohan181204/collaborative-canvas.git
cd collaborative-canvas

2. Install dependencies
npm install

3. Start server
npm start

4. Open browser
Visit: http://localhost:3000


**That's it! Server runs on port 3000 by default.**

---

## 🧪 Testing Instructions

### Test 1: Local Multi-User (Single Device)

1. Start server
npm start

2. Open multiple browser tabs
Tab 1: http://localhost:3000
Tab 2: http://localhost:3000
Tab 3: http://localhost:3000

3. Test NEW profile features
Check Tab 1: "You: User 1" appears top-right ✅

Check Tab 2: "You: User 2" appears top-right ✅

In Tab 1: Click ✏️ → Rename to "Alice" ✅

Check Tab 2: Sees notification "User 1 is now Alice" ✅

Check Tab 2: User list shows "Alice" instead of "User 1" ✅

4. Test NEW activity tracking
Draw in Tab 1 (Alice) ✅

Check Tab 2: Shows "Alice is drawing..." at top center ✅

Indicator auto-hides after 2 seconds ✅

Draw in Tab 2 → Tab 1 shows activity ✅

5. Test synchronization
Draw in Tab 1 → Appears instantly in Tab 2 & 3 ✅

Move mouse in Tab 1 → Cursor indicator appears in Tab 2 & 3 ✅

Click Undo in Tab 2 → Removes last stroke in all tabs ✅

6. Test user counter reset
Close all 3 tabs

Open new tab → Shows "You: User 1" (counter reset!) ✅

Open another tab → Shows "You: User 2" ✅



### Test 2: Profile & Activity Features 🆕

1. Open canvas
http://localhost:3000

2. Test profile badge
Look at top-right corner ✅

See "You: User 1" with colored border ✅

Border color matches your user color ✅

3. Test rename
Click ✏️ button next to your name ✅

Enter "John Doe" (3-20 characters) ✅

Click "Save Name" ✅

Badge updates to "You: John Doe" ✅

Notification shows "Your name changed to: John Doe" ✅

4. Test multi-user rename
Open Tab 2 (another user joins)

Tab 1: Rename to "Alice" ✅

Tab 2: Sees notification "User 1 is now Alice" ✅

Tab 2: User list shows "Alice" ✅

5. Test drawing activity
Tab 1 (Alice): Start drawing ✅

Tab 2: Shows "Alice is drawing..." (top center) ✅

Alice's name appears in her color ✅

Indicator hides after 2 seconds ✅

Tab 2: Start drawing ✅

Tab 1: Shows "User 2 is drawing..." ✅



### Test 3: Mobile Responsive 📱

Test on mobile device or browser DevTools (F12 → Device Mode)
1. Profile badge on mobile
Badge smaller on mobile (10px font) ✅

Positioned at top-right (not overlapping) ✅

Rename button tappable ✅

2. Activity indicator on mobile
Appears at top center ✅

Smaller font (10px) ✅

Doesn't overlap other elements ✅

3. Touch drawing
Touch and drag to draw ✅

Tap ✏️ to rename ✅

All buttons work with touch ✅

4. Portrait vs Landscape
Portrait: Vertical toolbar ✅

Landscape: Horizontal toolbar ✅

Profile badge visible in both ✅



### Test 4: Exit Functionality

1. Open canvas
http://localhost:3000

2. Click "🚪 Exit" button (top center)
3. Confirm exit in modal
4. See goodbye screen with "Rejoin Canvas" button ✅
5. Click "Rejoin Canvas" to return ✅


---

## 🎮 User Guide

### Basic Drawing
1. **Select Color**: Click color picker, choose any color
2. **Adjust Width**: Drag width slider (1-20 pixels)
3. **Draw**: Click/touch and drag on white canvas
4. **Erase**: Click "🧽 Eraser" button (turns red), then draw to erase
5. **Undo**: Click "↶ Undo" to remove last stroke (syncs globally)
6. **Redo**: Click "↷ Redo" to restore undone stroke
7. **Clear All**: Click "🗑️ Clear" to clear entire canvas (all users affected)

### User Profile Management 🆕
1. **View Your Profile**: Check top-right corner for "You: [Your Name]"
2. **Your Color**: Border color indicates your assigned color
3. **Change Name**: Click ✏️ button next to your name
4. **Enter New Name**: Type 3-20 characters
5. **Save Changes**: Click "Save Name" button
6. **Broadcast**: All users see "[Old Name] is now [New Name]" notification
7. **Persistent**: Your new name syncs across all users instantly

### Activity Awareness 🆕
1. **See Who's Drawing**: Watch top center for "[Username] is drawing..."
2. **Color-Coded**: Drawing user's name appears in their color
3. **Auto-Hide**: Indicator disappears after 2 seconds of inactivity
4. **Non-Intrusive**: Doesn't block your view of the canvas
5. **Real-Time**: Updates instantly when anyone draws

### Room Management
1. **Current Room**: Displayed at top ("Room: main")
2. **Change Room**: Click "📍 Change Room" button
3. **Enter Room Name**: Type custom name or click quick button
4. **Quick Rooms**: Main, Design, Dev, Private (one-click join)
5. **URL Method**: Add `?room=yourname` to URL for direct access

### Exit Application
1. **Exit Button**: Click "🚪 Exit" button (next to Change Room)
2. **Confirm**: Click "Yes, Exit" in confirmation modal
3. **Goodbye Screen**: See exit message with rejoin option
4. **Rejoin**: Click "Rejoin Canvas" to return to app
5. **Auto-Save**: Drawings automatically saved before exit

### Performance Monitoring
**Top Right Corner** shows real-time stats:
- **FPS**: Rendering frames per second (60 = smooth)
- **Latency**: Network ping time in milliseconds
- **Paths**: Total number of drawing strokes on canvas

### Connection Status
**Top Left Corner** shows connection state:
- **Green "● Connected"**: All systems operational
- **Orange "⟳ Reconnecting..."**: Attempting to reconnect
- **Red "● Disconnected"**: No connection, check internet

---

## 🏗️ Technical Architecture

### Frontend (Vanilla JavaScript)
client/
├── index.html # UI structure with profile badge, activity indicator, modals
├── style.css # Responsive styling with 3 breakpoints (mobile-ready)
├── canvas.js # Canvas API + drawing logic + performance tracking
├── websocket.js # WebSocket client + auto-reconnection + latency
└── main.js # App coordination + profile + activity + room management



**New UI Components:**
- **Profile Badge** (`#your-profile`): Top-right corner with name and rename button
- **Drawing Activity** (`#drawing-activity`): Top-center indicator for active drawers
- **Rename Modal** (`#rename-modal`): 3-20 character name change interface

### Backend (Node.js + Express)
server/
├── server.js # Express + WebSocket server + rename/activity handlers
├── rooms.js # Room management with user tracking
└── drawing-state.js # State utilities (future use)



**New WebSocket Messages:**
- `rename-user`: Client → Server (name change request)
- `user-renamed`: Server → Clients (broadcast name change)
- `drawing-start`: Client → Server → Clients (drawing activity notification)

### Technology Stack
- **Frontend**: ES6 Modules, HTML5 Canvas API, WebSocket API, LocalStorage
- **Backend**: Node.js 14+, Express 4.18, ws 8.13
- **Storage**: Browser LocalStorage (client-side)
- **Protocol**: Native WebSocket (wss:// for HTTPS, ws:// for HTTP)
- **Deployment**: Render (free tier with WebSocket support)

### Key Design Decisions

**Profile Badge Implementation:**
- Fixed position top-right (z-index: 999)
- Gradient background with user's color
- Border color matches user color
- Responsive sizing for mobile (10-13px font)

**Activity Tracking Strategy:**
- Broadcast on `endDraw()` event (completed stroke)
- 2-second timeout for auto-hide
- Throttled to prevent spam
- Only shows other users (not yourself)

**Rename System:**
- Client-side validation (3-20 characters)
- Broadcast to all users in room
- Updates all UI elements instantly
- Persistent across session

---

## 🚀 Deployment Guide

### Deploy to Render (Recommended)

**Your app is already live at**: https://collaborative-canvas-hdco.onrender.com

**To deploy your own version:**

1. **Push to GitHub**
git add .
git commit -m "Complete v2.0 with profile and activity features"
git push origin main



2. **Create Render Account**
- Go to [render.com](https://render.com)
- Sign up with GitHub

3. **Create New Web Service**
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Configure:
  - **Name**: `collaborative-canvas`
  - **Environment**: Node
  - **Build Command**: `npm install`
  - **Start Command**: `node server/server.js`
  - **Instance Type**: Free

4. **Deploy**
- Click "Create Web Service"
- Wait 3-5 minutes
- Get your live URL!

**WebSocket Configuration:**
- ✅ Auto-detects `wss://` for HTTPS
- ✅ Auto-detects `ws://` for HTTP
- ✅ No manual configuration needed

---

## 📱 Mobile Optimization

### Responsive Design
**Three breakpoints implemented:**
- **Desktop (>768px)**: Full-size layout
- **Tablet (768px)**: Medium optimizations
- **Phone (<480px)**: Mobile-first design

### New Features on Mobile
**Profile Badge:**
- Smaller font (10px on phone)
- Compact padding (5px 8px)
- Touch-friendly rename button
- Positioned to avoid overlap

**Drawing Activity:**
- Reduced font size (10px)
- Adjusted top position (45px)
- Mobile-optimized animations
- Readable on small screens

**Touch Optimizations:**
- All buttons 44px+ touch targets
- `touch-action: manipulation` on inputs
- No zoom on double-tap
- Smooth finger drawing
- Responsive toolbar (vertical on phone)

---

## ⚠️ Known Limitations

### 1. **Client-Side Storage Only**
- Drawings stored in browser localStorage
- Not synced to server database
- New users joining room don't see existing drawings
- Clearing browser data loses drawings

### 2. **Free Tier Limitations (Render)**
- Spins down after 15 minutes of inactivity
- First request after sleep: 30-60 second cold start
- 512 MB RAM, shared CPU
- Sufficient for demos and small teams

### 3. **No Authentication**
- Anyone can join any room
- No password protection
- No user accounts or permissions
- No admin controls

### 4. **Name Validation Only**
- Names are 3-20 characters
- No profanity filter
- No uniqueness enforcement
- Manual moderation needed

---

## 🔧 Troubleshooting

### Issue 1: Profile Badge Not Showing

**Symptom**: "You: Loading..." never updates

**Solution**:
Check browser console (F12)

Look for "App initialized in room: [roomId]"

Verify WebSocket connected

Refresh page



### Issue 2: Drawing Activity Not Appearing

**Symptom**: Don't see "[User] is drawing..." when others draw

**Solution**:
Check if you're the only user

Activity only shows for OTHER users

Have someone else draw

Check console for "drawing-start" messages



### Issue 3: Rename Not Working

**Symptom**: Name doesn't change after clicking Save

**Solution**:
Check name length (must be 3-20 characters)

Verify WebSocket connection (green indicator)

Try refreshing page

Check browser console for errors



---

## 📊 Performance Metrics

### Expected Performance
- **FPS**: 60 (smooth rendering on modern devices)
- **Latency**: 50-150ms (on Render free tier)
- **Max Users**: ~20-30 per room (free tier limitation)
- **Max Paths**: ~500-1000 before noticeable lag
- **Cold Start**: 30-60 seconds (Render free tier spin-up)

### Load Testing Results
- ✅ 5 users: Perfect performance
- ✅ 10 users: Smooth, minimal latency
- ⚠️ 20+ users: May experience delays on free tier

---

## 🔗 Links

- **Live App**: https://collaborative-canvas-hdco.onrender.com
- **GitHub Repository**: https://github.com/sohan181204/collaborative-canvas
- **Documentation**: See ARCHITECTURE.md for technical details

---

## 👨‍💻 Author

**Sohan**  
- Email: sm0881@srmist.edu.in  
- GitHub: [@sohan181204](https://github.com/sohan181204)  
- University: SRM University (Final Year, Computer Science)

---

## 📜 License

MIT License - Feel free to use for learning and projects!

---

## 🆕 Version History

### v2.0.0 (November 7, 2025) - Current
- ✅ **User Profile Badge**: Top-right "You: [Name]" display
- ✅ **Rename Functionality**: In-app name change with broadcasting
- ✅ **Drawing Activity Tracking**: "[User] is drawing..." indicator
- ✅ **Enhanced Mobile UI**: Profile & activity optimized for mobile
- ✅ **Improved User Experience**: Better identity awareness

### v1.0.0 (November 6, 2025)
- ✅ Core drawing functionality
- ✅ Real-time synchronization
- ✅ Room system
- ✅ User counter reset
- ✅ Exit functionality
- ✅ Ghost user prevention
- ✅ Mobile responsive design

---

## 🙏 Acknowledgments

- HTML5 Canvas API Documentation
- WebSocket Protocol RFC 6455
- Node.js + Express Community
- Render Platform for free hosting
- Assignment guidelines and requirements

---

**Built with ❤️ for Real-Time Collaborative Systems Assignment**

**Last Updated**: November 7, 2025 - Version 2.0 with User Profiles & Activity Tracking