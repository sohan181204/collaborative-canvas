import { CanvasDrawer } from './canvas.js';
import { CanvasWebSocket } from './websocket.js';

let currentRoom = new URLSearchParams(window.location.search).get('room') || 
                  localStorage.getItem('canvas-room') || 'main';

localStorage.setItem('canvas-room', currentRoom);

// Auto-detect WebSocket URL for production
const getWebSocketURL = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}`;
};

const ws = new CanvasWebSocket(getWebSocketURL(), {
    maxReconnectAttempts: 10,
    reconnectDelay: 3000
});

const canvas = document.getElementById('canvas');
const toolbar = document.getElementById('toolbar');
const usersDiv = document.getElementById('users');
const roomInfoEl = document.getElementById('current-room');
const drawer = new CanvasDrawer(canvas, toolbar);

let userId = null;
let users = {};
const cursors = {};
let lastCursorSend = 0;
const CURSOR_THROTTLE = 50;

// Drawing activity tracking
let activityTimeout = null;

// Your profile elements
const yourProfileEl = document.getElementById('your-profile');
const yourNameEl = document.getElementById('your-name');
const renameBtnEl = document.getElementById('rename-btn');
const drawingActivityEl = document.getElementById('drawing-activity');
const drawingUserEl = document.getElementById('drawing-user');

// Rename modal elements
const renameModal = document.getElementById('rename-modal');
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name-btn');
const cancelNameBtn = document.getElementById('cancel-name-btn');

function updateRoomDisplay() {
    roomInfoEl.innerHTML = `Room: <strong>${currentRoom}</strong>`;
    document.title = `Collaborative Canvas - ${currentRoom}`;
}
updateRoomDisplay();

const roomModal = document.getElementById('room-modal');
const roomInput = document.getElementById('room-input');
const changeRoomBtn = document.getElementById('change-room');
const joinRoomBtn = document.getElementById('join-room-btn');
const cancelRoomBtn = document.getElementById('cancel-room-btn');

// Exit button functionality
const exitRoomBtn = document.getElementById('exit-room');
const exitModal = document.getElementById('exit-modal');
const confirmExitBtn = document.getElementById('confirm-exit-btn');
const cancelExitBtn = document.getElementById('cancel-exit-btn');

exitRoomBtn.addEventListener('click', () => {
    exitModal.classList.remove('hidden');
});

cancelExitBtn.addEventListener('click', () => {
    exitModal.classList.add('hidden');
});

confirmExitBtn.addEventListener('click', () => {
    drawer.saveRoomState(currentRoom);
    ws.close();
    
    document.body.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #222;
            color: #fff;
            font-family: 'Segoe UI', Arial, sans-serif;
            text-align: center;
            padding: 20px;
        ">
            <h1 style="font-size: 3rem; margin-bottom: 20px;">👋 Goodbye!</h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px;">You have left the room successfully.</p>
            <p style="color: #aaa; margin-bottom: 30px;">Your drawings have been saved locally.</p>
            <button onclick="window.location.href='/'" style="
                padding: 12px 30px;
                font-size: 1rem;
                background: #32c8c8;
                color: #fff;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
            " onmouseover="this.style.background='#2aa8a8'" onmouseout="this.style.background='#32c8c8'">
                Rejoin Canvas
            </button>
        </div>
    `;
});

// Rename button handler
renameBtnEl.addEventListener('click', () => {
    renameModal.classList.remove('hidden');
    nameInput.value = users[userId]?.name || '';
    nameInput.focus();
});

cancelNameBtn.addEventListener('click', () => {
    renameModal.classList.add('hidden');
});

saveNameBtn.addEventListener('click', () => {
    const newName = nameInput.value.trim();
    if (newName.length >= 3 && newName.length <= 20) {
        if (users[userId]) {
            users[userId].name = newName;
        }
        
        if (userId && ws.isReady()) {
            ws.send('rename-user', { 
                userId, 
                roomId: currentRoom, 
                newName 
            });
        }
        
        updateYourProfile();
        updateUsersUI();
        
        renameModal.classList.add('hidden');
        showNotification(`Your name changed to: ${newName}`, users[userId]?.color || '#0f0');
    } else {
        alert('Name must be 3-20 characters!');
    }
});

nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveNameBtn.click();
    }
});

// Update your profile badge
function updateYourProfile() {
    if (userId && users[userId]) {
        const user = users[userId];
        yourNameEl.innerHTML = `You: <strong>${user.name}</strong>`;
        yourProfileEl.style.borderColor = user.color;
        yourProfileEl.style.background = `linear-gradient(135deg, rgba(0,0,0,0.9), ${user.color}22)`;
    }
}

// Show drawing activity
function showDrawingActivity(drawingUserId) {
    if (!users[drawingUserId] || drawingUserId === userId) return;
    
    const user = users[drawingUserId];
    drawingUserEl.textContent = user.name;
    drawingUserEl.style.color = user.color;
    drawingActivityEl.classList.remove('hidden');
    
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(() => {
        drawingActivityEl.classList.add('hidden');
    }, 2000);
}

changeRoomBtn.addEventListener('click', () => {
    roomModal.classList.remove('hidden');
    roomInput.value = currentRoom;
    roomInput.focus();
});

cancelRoomBtn.addEventListener('click', () => {
    roomModal.classList.add('hidden');
});

joinRoomBtn.addEventListener('click', () => {
    const newRoom = roomInput.value.trim() || 'main';
    if (newRoom !== currentRoom) {
        changeRoom(newRoom);
    }
    roomModal.classList.add('hidden');
});

roomInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinRoomBtn.click();
    }
});

document.querySelectorAll('.quick-room-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const room = btn.dataset.room;
        if (room !== currentRoom) {
            changeRoom(room);
        }
        roomModal.classList.add('hidden');
    });
});

function changeRoom(newRoom) {
    currentRoom = newRoom;
    localStorage.setItem('canvas-room', currentRoom);
    updateRoomDisplay();
    drawer.clearCanvas();
    users = {};
    cursors = {};
    window.location.search = `?room=${encodeURIComponent(currentRoom)}`;
}

const savedState = localStorage.getItem(`canvas-state-${currentRoom}`);
if (savedState) {
    try {
        const state = JSON.parse(savedState);
        drawer.paths = state.paths || [];
        drawer.redraw();
        drawer.updatePathsCount();
    } catch (e) {
        console.error('Failed to load room state:', e);
    }
}

ws.on('open', () => {
    console.log('Connected to server');
    ws.send('join', { roomId: currentRoom });
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('Disconnected from server');
    drawer.saveRoomState(currentRoom);
});

ws.on('init', (msg) => {
    userId = msg.userId;
    users = msg.users || {};
    updateUsersUI();
    updateYourProfile();
});

ws.on('user-joined', (msg) => {
    users[msg.userId] = msg.user;
    updateUsersUI();
    showNotification(`${msg.user.name} joined ${currentRoom}`, msg.user.color);
});

ws.on('user-left', (msg) => {
    console.log('User left:', msg.userId);
    
    const user = users[msg.userId];
    if (user) {
        showNotification(`${user.name} left`, user.color);
        console.log(`Removing user: ${user.name} (${msg.userId})`);
    }
    
    delete users[msg.userId];
    delete cursors[msg.userId];
    updateUsersUI();
    drawer.redraw();
    
    console.log('Remaining users:', Object.keys(users).length);
});

// Handle name change from other users
ws.on('user-renamed', (msg) => {
    if (users[msg.userId]) {
        const oldName = users[msg.userId].name;
        users[msg.userId].name = msg.newName;
        updateUsersUI();
        
        if (msg.userId === userId) {
            updateYourProfile();
        }
        
        showNotification(`${oldName} is now ${msg.newName}`, users[msg.userId].color);
    }
});

// Handle drawing activity
ws.on('drawing-start', (msg) => {
    if (msg.userId !== userId) {
        showDrawingActivity(msg.userId);
    }
});

ws.on('draw-path', (msg) => {
    if (msg.userId !== userId) {
        drawer.addRemotePath(msg.path);
    }
});

ws.on('undo', (msg) => {
    if (msg.userId !== userId && drawer.paths.length > 0) {
        drawer.paths.pop();
        drawer.redoStack.push(drawer.paths[drawer.paths.length - 1]);
        drawer.redraw();
        drawer.updatePathsCount();
    }
});

ws.on('redo', (msg) => {
    if (msg.userId !== userId && drawer.redoStack.length > 0) {
        const restored = drawer.redoStack.pop();
        drawer.paths.push(restored);
        drawer.redraw();
        drawer.updatePathsCount();
    }
});

ws.on('clear-canvas', (msg) => {
    if (msg.userId !== userId) {
        drawer.clearCanvas();
        showNotification('Canvas cleared by ' + users[msg.userId]?.name, '#f00');
    }
});

ws.on('cursor-move', (msg) => {
    if (msg.userId !== userId) {
        cursors[msg.userId] = {
            x: msg.x,
            y: msg.y,
            color: users[msg.userId]?.color || '#000',
            name: users[msg.userId]?.name || msg.userId
        };
        drawCursors();
    }
});

function updateUsersUI() {
    const userCount = Object.keys(users).length;
    usersDiv.innerHTML = `Online in ${currentRoom} (${userCount}): ` + 
        Object.values(users).map(u =>
            `<span style="color:${u.color};font-weight:bold">${u.name || u.id}</span>`
        ).join(', ');
}

canvas.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastCursorSend < CURSOR_THROTTLE) return;
    lastCursorSend = now;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (userId && ws.isReady()) {
        ws.send('cursor-move', { x, y, userId, roomId: currentRoom });
    }
});

function drawCursors() {
    const ctx = drawer.ctx;
    drawer.redraw();
    
    Object.entries(cursors).forEach(([uid, cursor]) => {
        ctx.save();
        ctx.fillStyle = cursor.color;
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = cursor.color;
        ctx.font = 'bold 12px Arial';
        ctx.fillText(cursor.name, cursor.x + 10, cursor.y - 10);
        ctx.restore();
    });
}

function showNotification(message, color = '#0f0') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: ${color};
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 2000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const originalUndo = drawer.undo.bind(drawer);
const originalRedo = drawer.redo.bind(drawer);
const originalRedraw = drawer.redraw.bind(drawer);
const originalClearCanvas = drawer.clearCanvas.bind(drawer);

drawer.redraw = function() {
    originalRedraw();
    drawCursors();
};

drawer.endDraw = function() {
    if (!this.drawing) return;
    this.drawing = false;
    const completedPath = this.currentPath;
    
    if (completedPath && completedPath.points && completedPath.points.length > 0) {
        this.paths.push(completedPath);
        this.redoStack = [];
        this.updatePathsCount();
        this.saveRoomState(currentRoom);
        
        if (userId && ws.isReady()) {
            // Notify others you're drawing
            ws.send('drawing-start', { userId, roomId: currentRoom });
            ws.send('draw-path', { path: completedPath, userId, roomId: currentRoom });
        }
    }
    this.currentPath = null;
};

drawer.undo = function() {
    originalUndo();
    this.saveRoomState(currentRoom);
    if (userId && ws.isReady()) {
        ws.send('undo', { userId, roomId: currentRoom });
    }
};

drawer.redo = function() {
    originalRedo();
    this.saveRoomState(currentRoom);
    if (userId && ws.isReady()) {
        ws.send('redo', { userId, roomId: currentRoom });
    }
};

drawer.clearCanvas = function() {
    originalClearCanvas();
    this.saveRoomState(currentRoom);
    if (userId && ws.isReady()) {
        ws.send('clear-canvas', { userId, roomId: currentRoom });
    }
};

setInterval(() => {
    drawer.saveRoomState(currentRoom);
}, 30000);

console.log(`App initialized in room: ${currentRoom}`);
