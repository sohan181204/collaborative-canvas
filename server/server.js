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
let activeConnections = 0;

function broadcast(data, roomId, excludeUserId = null) {
    let sentCount = 0;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && 
            client.roomId === roomId &&
            client.userId !== excludeUserId) {
            try {
                client.send(JSON.stringify(data));
                sentCount++;
            } catch (e) {
                console.error('Broadcast error:', e);
            }
        }
    });
    console.log(`Broadcasted ${data.type} to ${sentCount} users in room ${roomId}`);
}

function getRoomUsers(roomId) {
    const roomUsers = {};
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN &&
            client.roomId === roomId && 
            users[client.userId]) {
            roomUsers[client.userId] = users[client.userId];
        }
    });
    return roomUsers;
}

wss.on('connection', function connection(ws) {
    activeConnections++;
    
    const userNumber = Object.keys(users).length + 1;
    const userId = 'user_' + (++userCount);
    const color = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    users[userId] = { id: userId, name: `User ${userNumber}`, color };
    ws.userId = userId;
    ws.roomId = 'main';
    ws.isAlive = true;

    console.log(`✓ User ${userId} (${users[userId].name}) connected (total: ${activeConnections})`);

    ws.on('pong', () => {
        ws.isAlive = true;
    });

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
                console.log(`User ${userId} joined room: ${ws.roomId} (${Object.keys(roomUsers).length} users)`);
                break;
                
            case 'ping':
                try {
                    ws.send(JSON.stringify({ type: 'pong' }));
                } catch (e) {
                    console.error('Pong error:', e);
                }
                break;
            
            case 'rename-user':
                if (msg.newName && users[userId]) {
                    users[userId].name = msg.newName;
                    broadcast({ 
                        type: 'user-renamed', 
                        userId, 
                        newName: msg.newName 
                    }, ws.roomId);
                    console.log(`User ${userId} renamed to: ${msg.newName}`);
                }
                break;
            
            case 'drawing-start':
                broadcast({ 
                    type: 'drawing-start', 
                    userId 
                }, ws.roomId, userId);
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
        activeConnections--;
        console.log(`✗ User ${userId} (${users[userId]?.name}) disconnected from room: ${ws.roomId}`);
        
        rooms.leaveRoom(ws.roomId, userId);
        delete users[userId];
        
        broadcast({ 
            type: 'user-left', 
            userId 
        }, ws.roomId);
        
        if (activeConnections === 0) {
            userCount = 0;
            console.log('🔄 All users disconnected. User counter reset to 0.');
        }
        
        console.log(`Remaining connections: ${activeConnections}`);
    });

    ws.on('error', function(error) {
        console.error(`WebSocket error for ${userId}:`, error.message);
    });
});

const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            console.log(`Terminating dead connection: ${ws.userId}`);
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', () => {
    clearInterval(heartbeatInterval);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    clearInterval(heartbeatInterval);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║   🖌️  Collaborative Drawing Canvas Server        ║
║                                                    ║
║   🌐 Port: ${PORT}                                  ║
║   📁 Rooms: Enabled                                ║
║   📊 Status: Running                               ║
║   🔧 Environment: ${process.env.NODE_ENV || 'development'}
║                                                    ║
║   ✅ Ready for connections                         ║
╚════════════════════════════════════════════════════╝
    `);
});
