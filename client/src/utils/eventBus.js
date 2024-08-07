export class EventBus {
  constructor() {
    this.listeners = {};
  }

  subscribe(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  publish(eventType, data) {
    const eventListeners = this.listeners[eventType];
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }
}
