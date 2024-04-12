const GameEvent = {
    System: 'system',
    EndVotingEvent : 'endVoting',
    SaveActualAttdEvent: 'saveActual',
    WillAttEvent : 'willAttEvent',
    WillNotAttEvent : 'willNotAttEvent',
    WasPresentEvent : 'wasPresentEvent',
    WasNotPresentEvent : 'wasNotPresentEvent'
  };
  
  class EventMessage {
    constructor(from, email, type) {
      this.from = from;
      this.email = email;
      this.type = type;
    }
  }
  
  class GameEventNotifier {
    events = [];
    handlers = [];
  
    constructor() {
      let port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
      this.socket.onopen = (event) => {
        this.receiveEvent(new EventMessage('connected', "connected" , GameEvent.System));
      };
      this.socket.onclose = (event) => {
        this.receiveEvent(new EventMessage('disconnected', "disconnected", GameEvent.System));
      };
      this.socket.onmessage = async (msg) => {
        try {
          const event = JSON.parse(await msg.data.text());
          this.receiveEvent(event);
        } catch {}
      };
    }
  
    broadcastEvent(from,email, type) {
      const event = new EventMessage(from, email, type);
      this.socket.send(JSON.stringify(event));
    }
  
    addHandler(handler) {
      this.handlers.push(handler);
    }
  
    removeHandler(handler) {
      this.handlers.filter((h) => h !== handler);
    }
  
    receiveEvent(event) {
      this.events.push(event);
  
      this.events.forEach((e) => {
        this.handlers.forEach((handler) => {
          handler(e);
        });
      });
    }
  }
  
  const GameNotifier = new GameEventNotifier();
  export { GameEvent, GameNotifier };
  