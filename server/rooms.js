const rooms = {};

function joinRoom(roomId, userId) {
    if (!rooms[roomId]) {
        rooms[roomId] = { users: new Set(), paths: [] };
    }
    rooms[roomId].users.add(userId);
    console.log(`Room ${roomId}: ${rooms[roomId].users.size} users`);
}

function leaveRoom(roomId, userId) {
    if (!rooms[roomId]) return;
    rooms[roomId].users.delete(userId);
    if (rooms[roomId].users.size === 0) {
        delete rooms[roomId];
        console.log(`Room ${roomId} closed (empty)`);
    } else {
        console.log(`Room ${roomId}: ${rooms[roomId].users.size} users`);
    }
}

function getRoomUsers(roomId) {
    if (!rooms[roomId]) return [];
    return Array.from(rooms[roomId].users);
}

function addPathToRoom(roomId, path) {
    if (!rooms[roomId]) return;
    rooms[roomId].paths.push(path);
}

function getRoomPaths(roomId) {
    if (!rooms[roomId]) return [];
    return rooms[roomId].paths;
}

module.exports = {
    joinRoom,
    leaveRoom,
    getRoomUsers,
    addPathToRoom,
    getRoomPaths
};
