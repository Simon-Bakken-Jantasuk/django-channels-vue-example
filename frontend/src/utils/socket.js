class Socket {
  constructor(url, onOpen, onClose, onError) {
    this.socket = new WebSocket(url);
    this.eventHandlers = {};
    this.messageQueue = [];

    this.socket.onmessage = (event) => {
      const message = event.data;
      const parsedMessage = JSON.parse(message);
      const eventName = parsedMessage.eventName;
      const data = parsedMessage.data;

      if (this.eventHandlers[eventName]) {
        this.eventHandlers[eventName].forEach(handler => handler(data));
      }
    };

    this.socket.onopen = () => {
      console.log(`Connected to ${url}`);
      if (onOpen) onOpen();
      this.flushMessageQueue();
    };

    this.socket.onclose = () => {
      console.log(`Disconnected from ${url}`);
      if (onClose) onClose();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError();
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
