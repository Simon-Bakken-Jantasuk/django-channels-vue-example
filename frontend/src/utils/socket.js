class Socket {
  constructor(url, callback = {}) {
    this.url = url;
    this.callback = callback;
    this.eventHandlers = {};
    this.messageQueue = [];
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log(`Connected to ${this.url}`);
      if (this.callback.onOpen) this.callback.onOpen();
      this.flushMessageQueue();
    };

    this.socket.onclose = () => {
      console.log(`Disconnected from ${this.url}`);
      if (this.callback.onClose) this.callback.onClose();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (this.callback.onError) this.callback.onError();
    };

    this.socket.onmessage = (event) => {
      const { eventName, data } = JSON.parse(event.data);
      if (this.eventHandlers[eventName]) {
        this.eventHandlers[eventName].forEach(handler => handler(data));
      };
    };
  }

  emit(eventName, data) {
    const message = JSON.stringify({ eventName, data });
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      this.messageQueue.push(message);
    
  }

  on(eventName, handler) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(handler);
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.socket.send(message);
    }
  }
}

export default Socket;
