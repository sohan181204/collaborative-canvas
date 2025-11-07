const state = {
    paths: [],
    redoStack: []
};

function addPath(path) {
    state.paths.push(path);
    state.redoStack = [];
}

function undo() {
    if (state.paths.length === 0) return null;
    const popped = state.paths.pop();
    state.redoStack.push(popped);
    return popped;
}

function redo() {
    if (state.redoStack.length === 0) return null;
    const path = state.redoStack.pop();
    state.paths.push(path);
    return path;
}

function getPaths() {
    return [...state.paths];
}

function clear() {
    state.paths = [];
    state.redoStack = [];
}

module.exports = {
    addPath,
    undo,
    redo,
    getPaths,
    clear
};
