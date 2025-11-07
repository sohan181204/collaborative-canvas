export class CanvasWebSocket {
    constructor(url, options = {}) {
        this.url = url;
        this.handlers = {};
        this.messageQueue = [];
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
        this.reconnectDelay = options.reconnectDelay || 3000;
        this.pingInterval = null;
        this.lastPingTime = 0;
        this.latency = 0;
        
        this.connect();
    }

    connect() {
        try {
            this.socket = new WebSocket(this.url);
            this.attachEventListeners();
        } catch (e) {
            console.error('WebSocket connection failed:', e);
            this.handleReconnect();
        }
    }

    attachEventListeners() {
        this.socket.addEventListener('open', () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            
            while (this.messageQueue.length > 0) {
                const msg = this.messageQueue.shift();
                this.socket.send(msg);
            }
            
            this.startPing();
            this.updateConnectionStatus('connected');
            
            if (this.handlers['open']) this.handlers['open']();
        });

        this.socket.addEventListener('message', event => {
            try {
                const msg = JSON.parse(event.data);
                
                if (msg.type === 'pong') {
                    this.latency = Date.now() - this.lastPingTime;
                    this.updateLatencyDisplay();
                    return;
                }
                
                if (this.handlers[msg.type]) {
                    this.handlers[msg.type](msg);
                }
            } catch (e) {
                console.error('Failed to parse message:', e);
            }
        });

        this.socket.addEventListener('close', () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
            this.stopPing();
            this.updateConnectionStatus('disconnected');
            
            if (this.handlers['close']) this.handlers['close']();
            
            this.handleReconnect();
        });

        this.socket.addEventListener('error', err => {
            console.error('WebSocket error:', err);
            this.updateConnectionStatus('disconnected');
            
            if (this.handlers['error']) this.handlers['error'](err);
        });
    }

    handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            this.updateConnectionStatus('disconnected');
            return;
        }
        
        this.reconnectAttempts++;
        this.updateConnectionStatus('reconnecting');
        
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        
        setTimeout(() => {
            this.connect();
        }, this.reconnectDelay);
    }

    on(type, callback) {
        this.handlers[type] = callback;
    }

    send(type, data = {}) {
        const message = JSON.stringify({ type, ...data });
        
        if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            this.messageQueue.push(message);
        }
    }

    isReady() {
        return this.isConnected && this.socket.readyState === WebSocket.OPEN;
    }

    close() {
        this.stopPing();
        if (this.socket) {
            this.socket.close();
        }
    }

    startPing() {
        this.pingInterval = setInterval(() => {
            if (this.isReady()) {
                this.lastPingTime = Date.now();
                this.send('ping');
            }
        }, 2000);
    }

    stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    updateConnectionStatus(status) {
        const statusEl = document.getElementById('connection-status');
        if (statusEl) {
            statusEl.className = status;
            const statusText = {
                'connected': '● Connected',
                'disconnected': '● Disconnected',
                'reconnecting': '⟳ Reconnecting...'
            };
            statusEl.textContent = statusText[status] || status;
        }
    }

    updateLatencyDisplay() {
        const latencyEl = document.getElementById('latency');
        if (latencyEl) {
            latencyEl.textContent = `Latency: ${this.latency}ms`;
        }
    }
}
