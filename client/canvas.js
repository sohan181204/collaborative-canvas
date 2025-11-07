export class CanvasDrawer {
    constructor(canvas, toolbar) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.drawing = false;
        this.current = {
            color: '#000000',
            width: 3,
            erasing: false
        };
        this.paths = [];
        this.redoStack = [];
        this.frameCount = 0;
        this.lastFrameTime = Date.now();
        this.fps = 0;
        
        this.attachToolbar(toolbar);
        this.attachCanvasEvents();
        this.startPerformanceTracking();
    }

    attachToolbar(toolbar) {
        const eraserBtn = toolbar.querySelector('#eraser');
        const colorPicker = toolbar.querySelector('#color');
        const clearBtn = toolbar.querySelector('#clear');

        colorPicker.addEventListener('change', e => {
            this.current.color = e.target.value;
            this.current.erasing = false;
            eraserBtn.classList.remove('active');
        });

        toolbar.querySelector('#width').addEventListener('input', e => {
            this.current.width = +e.target.value;
        });

        eraserBtn.addEventListener('click', () => {
            this.current.erasing = true;
            eraserBtn.classList.add('active');
        });

        clearBtn.addEventListener('click', () => {
            if (confirm('Clear entire canvas for all users?')) {
                this.clearCanvas();
            }
        });

        toolbar.querySelector('#undo').addEventListener('click', () => this.undo());
        toolbar.querySelector('#redo').addEventListener('click', () => this.redo());
    }

    attachCanvasEvents() {
        this.canvas.addEventListener('mousedown', e => this.startDraw(e));
        this.canvas.addEventListener('mousemove', e => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.endDraw());
        this.canvas.addEventListener('mouseleave', () => this.endDraw());
        
        this.canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            this.startDraw(e, true);
        }, { passive: false });
        this.canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            this.draw(e, true);
        }, { passive: false });
        this.canvas.addEventListener('touchend', () => this.endDraw());
        this.canvas.addEventListener('touchcancel', () => this.endDraw());
    }

    getPos(e, touch) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        if (touch) {
            if (!e.touches || e.touches.length === 0) return null;
            const t = e.touches[0];
            return [
                (t.clientX - rect.left) * scaleX,
                (t.clientY - rect.top) * scaleY
            ];
        } else {
            return [
                (e.clientX - rect.left) * scaleX,
                (e.clientY - rect.top) * scaleY
            ];
        }
    }

    startDraw(e, touch=false) {
        const pos = this.getPos(e, touch);
        if (!pos) return;
        
        this.drawing = true;
        const [x, y] = pos;
        this.currentPath = {
            color: this.current.color,
            width: this.current.width,
            erasing: this.current.erasing,
            points: [[x, y]],
            timestamp: Date.now()
        };
    }

    draw(e, touch=false) {
        if (!this.drawing) return;
        const pos = this.getPos(e, touch);
        if (!pos) return;
        
        const [x, y] = pos;
        this.currentPath.points.push([x, y]);
        this.redraw();
    }

    endDraw() {
        if (!this.drawing) return;
        this.drawing = false;
        if (this.currentPath && this.currentPath.points.length > 0) {
            this.paths.push(this.currentPath);
            this.redoStack = [];
            this.updatePathsCount();
        }
        this.currentPath = null;
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const path of this.paths) {
            this.drawPath(path);
        }
        
        if (this.drawing && this.currentPath) {
            this.drawPath(this.currentPath);
        }
        
        this.updateFPS();
    }

    drawPath(path) {
        if (!path || !path.points || path.points.length === 0) return;
        
        const ctx = this.ctx;
        ctx.save();
        
        if (path.erasing) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = path.color;
        }
        
        ctx.lineWidth = path.width;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        
        const pts = path.points;
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i][0], pts[i][1]);
        }
        ctx.stroke();
        ctx.restore();
    }

    undo() {
        if (this.paths.length === 0) return;
        this.redoStack.push(this.paths.pop());
        this.redraw();
        this.updatePathsCount();
    }

    redo() {
        if (this.redoStack.length === 0) return;
        this.paths.push(this.redoStack.pop());
        this.redraw();
        this.updatePathsCount();
    }

    clearCanvas() {
        this.paths = [];
        this.redoStack = [];
        this.redraw();
        this.updatePathsCount();
    }

    addRemotePath(path) {
        if (path && path.points && path.points.length > 0) {
            this.paths.push(path);
            this.redraw();
            this.updatePathsCount();
        }
    }

    startPerformanceTracking() {
        setInterval(() => {
            const now = Date.now();
            const delta = now - this.lastFrameTime;
            if (delta > 0) {
                this.fps = Math.round(1000 / delta);
                const fpsEl = document.getElementById('fps');
                if (fpsEl) fpsEl.textContent = `FPS: ${this.fps}`;
            }
            this.lastFrameTime = now;
            this.frameCount = 0;
        }, 1000);
    }

    updateFPS() {
        this.frameCount++;
    }

    updatePathsCount() {
        const pathsEl = document.getElementById('paths-count');
        if (pathsEl) pathsEl.textContent = `Paths: ${this.paths.length}`;
    }

    saveRoomState(roomId) {
        const state = {
            paths: this.paths,
            timestamp: Date.now()
        };
        localStorage.setItem(`canvas-state-${roomId}`, JSON.stringify(state));
    }
}
