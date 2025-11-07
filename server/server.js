const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const rooms = require('./rooms');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '..', 'client')));

const users = {};
let userCount = 0;

function broadcast(data, roomId, excludeUserId = null) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && 
            client.roomId === roomId &&
            client.userId !== excludeUserId) {
            try {
                client.send(JSON.stringify(data));
            } catch (e) {
                console.error('Broadcast error:', e);
            }
        }
    });
}

function getRoomUsers(roomId) {
    const roomUsers = {};
    wss.clients.forEach(client => {
        if (client.roomId === roomId && users[client.userId]) {
            roomUsers[client.userId] = users[client.userId];
        }
    });
    return roomUsers;
}

wss.on('connection', function connection(ws) {
    const userId = 'user_' + (++userCount);
    const color = '#' + Math.floor(Math.random()*16777215).toString(16);
    users[userId] = { id: userId, name: `User ${userCount}`, color };
    ws.userId = userId;
    ws.roomId = 'main';

    console.log(`✓ User ${userId} connected`);

    ws.on('message', function incoming(message) {
        let msg;
        try {
            msg = JSON.parse(message);
        } catch(e) { 
            console.error('Failed to parse message:', e);
            return; 
        }
        
        switch (msg.type) {
            case 'join':
                if (msg.roomId) {
                    rooms.leaveRoom(ws.roomId, userId);
                    ws.roomId = msg.roomId;
                    rooms.joinRoom(ws.roomId, userId);
                }
                
                const roomUsers = getRoomUsers(ws.roomId);
                try {
                    ws.send(JSON.stringify({
                        type: 'init',
                        userId,
                        users: roomUsers
                    }));
                    broadcast({ 
                        type: 'user-joined', 
                        userId, 
                        user: users[userId] 
                    }, ws.roomId);
                } catch (e) {
                    console.error('Join error:', e);
                }
                console.log(`User ${userId} joined room: ${ws.roomId}`);
                break;
                
            case 'ping':
                try {
                    ws.send(JSON.stringify({ type: 'pong' }));
                } catch (e) {
                    console.error('Pong error:', e);
                }
                break;
                
            case 'draw-path':
                broadcast({ 
                    type: 'draw-path', 
                    path: msg.path, 
                    userId 
                }, ws.roomId);
                break;
                
            case 'undo':
                broadcast({ type: 'undo', userId }, ws.roomId);
                break;
                
            case 'redo':
                broadcast({ type: 'redo', userId }, ws.roomId);
                break;
                
            case 'cursor-move':
                broadcast({ 
                    type: 'cursor-move', 
                    x: msg.x, 
                    y: msg.y, 
                    userId 
                }, ws.roomId);
                break;
                
            case 'clear-canvas':
                broadcast({ type: 'clear-canvas', userId }, ws.roomId);
                break;
                
            default:
                console.log('Unknown message type:', msg.type);
        }
    });

    ws.on('close', function() {
        console.log(`✗ User ${userId} disconnected`);
        rooms.leaveRoom(ws.roomId, userId);
        delete users[userId];
        broadcast({ type: 'user-left', userId }, ws.roomId);
    });

    ws.on('error', function(error) {
        console.error(`WebSocket error for ${userId}:`, error.message);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║   🖌️  Collaborative Drawing Canvas Server        ║
║                                                    ║
║   🌐 Server: http://localhost:${PORT}               ║
║   📁 Rooms: Enabled                                ║
║   📊 Status: Running                               ║
║                                                    ║
║   💡 Test Instructions:                           ║
║   1. Open: http://localhost:${PORT}                 ║
║   2. Open multiple tabs                            ║
║   3. Try different rooms:                          ║
║      • http://localhost:${PORT}?room=design          ║
║      • http://localhost:${PORT}?room=team1           ║
║      • http://localhost:${PORT}?room=private         ║
║                                                    ║
║   ✅ All features enabled                          ║
╚════════════════════════════════════════════════════╝
    `);
});
