# 🖌️ Real-Time Collaborative Drawing Canvas

A production-ready multi-user drawing application where multiple people can draw simultaneously on isolated canvases with real-time synchronization.

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

### ⭐ Bonus Features (80%)
- **Room System**: Multiple isolated canvases - users can join different rooms
- **Drawing Persistence**: Auto-save to localStorage, survives browser refresh
- **Performance Metrics**: Real-time FPS counter, network latency, path count
- **Mobile Touch Support**: Full touch event support for tablets and smartphones
- **Auto-Reconnection**: Automatic reconnection with exponential backoff strategy
- **Connection Status**: Visual indicator showing connection state
- **User Notifications**: Toast notifications for user join/leave events

---

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

3. Test synchronization
Draw in Tab 1 → Appears instantly in Tab 2 & 3 ✅

Move mouse in Tab 1 → Cursor indicator appears in Tab 2 & 3 ✅

Click Undo in Tab 2 → Removes last stroke in all tabs ✅

Change colors in different tabs → Each user draws different color ✅

### Test 2: Room Isolation

1. Open different rooms
Tab 1: http://localhost:3000?room=design
Tab 2: http://localhost:3000?room=dev
Tab 3: http://localhost:3000?room=design

2. Test isolation
Draw in Tab 1 → Appears in Tab 3 (same room) ✅

Draw in Tab 1 → Does NOT appear in Tab 2 (different room) ✅

User count shows only users in same room ✅

### Test 3: Live Deployment (Render)

1. Test production deployment
Open: https://collaborative-canvas-hdco.onrender.com

2. Open multiple tabs/devices
Desktop: https://collaborative-canvas-hdco.onrender.com
Mobile: https://collaborative-canvas-hdco.onrender.com
Tablet: https://collaborative-canvas-hdco.onrender.com

3. Test real-time sync across devices
Draw on desktop → Appears on mobile instantly ✅

Draw on mobile → Appears on tablet instantly ✅

### Test 4: Network Multi-Device (Local Network)

1. Find your local IP (for local testing)
Windows: ipconfig
Mac/Linux: ifconfig or ip addr

Example: 192.168.1.100
2. On other devices (same WiFi)
Device 1: http://192.168.1.100:3000
Device 2: http://192.168.1.100:3000
Device 3: http://192.168.1.100:3000?room=team

3. Test cross-device sync
Draw on phone → Appears on laptop instantly ✅

Touch draw on tablet → Syncs to desktop ✅

Test different rooms across devices ✅

### Test 5: Mobile Touch Support

On mobile browser (Chrome/Safari)
Open: https://collaborative-canvas-hdco.onrender.com

Touch and drag to draw ✅

Use toolbar buttons (color, width, eraser) ✅

Test undo/redo buttons ✅

Pinch to zoom (browser default) ✅

### Test 6: Persistence

1. Draw something on canvas
2. Close browser tab completely
3. Reopen: https://collaborative-canvas-hdco.onrender.com
4. Drawing is still there! ✅
Test per-room persistence:
1. Draw in "design" room
2. Switch to "dev" room (draw different content)
3. Switch back to "design"
4. Original "design" drawing restored! ✅


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

### Room Management
1. **Current Room**: Displayed at top ("Room: main")
2. **Change Room**: Click "📍 Change Room" button
3. **Enter Room Name**: Type custom name or click quick button
4. **Quick Rooms**: Main, Design, Dev, Private (one-click join)
5. **URL Method**: Add `?room=yourname` to URL for direct access

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
├── index.html # UI structure with room modal
├── style.css # Responsive styling with dark/light theme
├── canvas.js # Canvas API + drawing logic + performance
├── websocket.js # WebSocket client + auto-reconnection
└── main.js # App coordination + room handling + WebSocket URL detection

### Backend (Node.js + Express)
server/
├── server.js # Express + WebSocket server (production-ready)
├── rooms.js # Room management logic
└── drawing-state.js # State utilities (future use)

### Technology Stack
- **Frontend**: ES6 Modules, HTML5 Canvas API, WebSocket API, LocalStorage
- **Backend**: Node.js 14+, Express 4.18, ws 8.13
- **Storage**: Browser LocalStorage (client-side)
- **Protocol**: Native WebSocket (wss:// for HTTPS, ws:// for HTTP)
- **Deployment**: Render (free tier with WebSocket support)

### Key Design Decisions

**Why Vanilla JavaScript?**
- Assignment requirement (no frameworks)
- Full control over implementation
- Demonstrates core web development skills
- Smaller bundle size, faster load times

**Why Native WebSocket?**
- Lower latency than Socket.io
- No polling overhead
- Simpler for this use case
- Educational value for understanding protocol

**Why LocalStorage?**
- No database setup needed
- Works offline
- Fast access
- Simple persistence solution

**Why Render over Vercel?**
- ✅ Full WebSocket support (Vercel has limitations)
- ✅ Free tier with persistent connections
- ✅ No serverless cold starts
- ✅ Better for real-time applications

---

## 🚀 Deployment Guide

### Deploy to Render (Recommended)

**Your app is already live at**: https://collaborative-canvas-hdco.onrender.com

**To deploy your own version:**

1. **Push to GitHub**
git add .
git commit -m "Initial commit"
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

### 4. **No Drawing History**
- Can't replay drawing process
- No timeline feature
- Can't see who drew what stroke

### 5. **Storage Limits**
- LocalStorage ~5MB per domain
- Very large drawings may hit limit
- No warning before limit reached

### 6. **Network Dependency**
- Requires stable internet connection
- High latency affects cursor smoothness
- Disconnection loses real-time features (auto-reconnect helps)

---

## 🔧 Troubleshooting

### Issue 1: App Not Loading (Render)

**Symptom**: URL shows "Service Unavailable"

**Solution**:
App is waking up from sleep (free tier)

Wait 30-60 seconds

Refresh page

Should load normally

### Issue 2: WebSocket Not Connecting

**Symptom**: Can draw but drawings don't sync

**Check Browser Console** (F12):
// ✅ Good:
"WebSocket connected"
"App initialized in room: main"

// ❌ Bad:
"WebSocket connection failed"
"WebSocket error"

**Solution**:
Verify WebSocket URL is auto-detected
Should see in main.js:
const getWebSocketURL = () => {
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
return ${protocol}//${window.location.host};
};

### Issue 3: Drawings Not Persisting

**Symptom**: Drawings disappear on refresh

**Solution**:
Check localStorage is enabled
Open browser console (F12):
localStorage.getItem('canvas-state-main')

If null, check:
1. Browser privacy settings
2. Incognito mode (localStorage disabled)
3. Browser storage quota

### Issue 4: Performance Issues

**Symptom**: Laggy drawing, low FPS

**Check Performance Stats** (top right):
FPS < 30?
→ Close other browser tabs
→ Clear old drawings (click Clear button)
→ Reduce canvas complexity

Latency > 200ms?
→ Check internet connection
→ Server may be spinning up (wait 30s)
→ Try again



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

## 🙏 Acknowledgments

- HTML5 Canvas API Documentation
- WebSocket Protocol RFC 6455
- Node.js + Express Community
- Render Platform for free hosting
- Assignment guidelines and requirements

---

## 📝 Development Timeline

| Phase | Time | Details |
|-------|------|---------|
| Planning & Architecture | 2h | System design, tech stack selection |
| Core Drawing Implementation | 4h | Canvas operations, touch support |
| WebSocket Real-time Sync | 3h | Bidirectional communication, protocols |
| Cursor Tracking System | 2h | Position broadcasting, rendering |
| Room System Integration | 2h | URL routing, room isolation |
| Performance Optimization | 1h | FPS/latency tracking, throttling |
| Auto-reconnection Logic | 1h | Exponential backoff, message queuing |
| UI/UX Enhancement | 2h | Styling, modals, notifications |
| Deployment to Render | 1h | Configuration, WebSocket fixes |
| Testing & Debugging | 2h | Multi-user, cross-device, edge cases |
| Documentation | 2h | README, ARCHITECTURE, inline comments |
| **Total** | **~22h** | Production-ready quality |

---

**Built with ❤️ for Real-Time Collaborative Systems Assignment**