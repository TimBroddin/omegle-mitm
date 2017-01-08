class Omegle {

    constructor() {
        this.listeners = [];
        this.isConnected = true;
        this.queueMessages = [];
        this.hasPartner = false;
    }

    start() {
        this.queueMessages = [];
        fetch(`/proxy/start?rcs=1&firstevents=1&spid=&randid=${this.randId()}&lang=nl`, {
            method: 'POST',
            headers: {
                'Connection': 'keep-alive',
                'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
            }
        }).then((response) => {
            return response.text();
        }).then((text) => {
            return JSON.parse(text);
        }).then((response) => {
            if (response && response.clientID) {
                console.log('Connected to Omegle');
                this.connected();
                this.parseEvents(response.events);
                this.clientID = response.clientID;
                console.log(`ClientId: ${this.clientID}`);
                this.isConnected = true;
                this.getEvents();
            } else {
                console.log('Server down?');
                setTimeout(() => {
                    this.start();
                }, 2000);
            }
        });
    }

    getEvents() {
        if (!this.isConnected)
            return false;

        console.log(`${this.clientID} Getting events`);
        fetch('/proxy/events', {
            method: 'POST',
            body: `id=${encodeURIComponent(this.clientID)}`,
            json: true,
            headers: {
                'Connection': 'keep-alive',
                'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded'

            }
        }).then((response) => {
            return response.text();
        }).then((text) => {
            return JSON.parse(text);
        }).then((response) => {
            if (response) {
                this.parseEvents(response);
                this.getEvents();
            } else {
                setTimeout(() => {
                    this.getEvents();
                }, 1000);
            }
        });
    }

    parseEvents(events) {
        if (!events)
            return;

        events.forEach((event) => {
            const type = event[0];
            const payload = event[1];

            switch (type) {
                case 'gotMessage':
                    this.receiveMessage(payload);
                    break;
                case 'typing':
                    this.typing();
                    break;
                case 'statusInfo':
                    this.statusInfo(payload);
                    break;
                case 'strangerDisconnected':
                    this.disconnected();
                    break;
                case 'connected':
                    this.hasPartner = true;
                    this.queueMessages.forEach((txt) => {
                        console.log('Sending message queue');
                        this.sendMessage(txt);
                    });
                    break;
                case 'serverMessage':
                  this.serverMessage(payload);
                  break;
                default:
            }
        });
    }

    connected() {
        this.message('connect', true);
    }

    receiveMessage(text) {
        this.message('message', text);
    }

    serverMessage(text) {
      this.message('serverMessage', text);
    }

    statusInfo(info) {}

    typing() {
        console.log(`${this.clientID} is typing`);

        this.message('typing', true);
    }

    sendMessage(txt) {
        if (!this.hasPartner) {
            console.log('Add to queue');
            this.queueMessages.push(text);
        }

        console.log(`${this.clientID} Send message ${txt}`);

        fetch('/proxy/send', {
            method: 'POST',
            body: `id=${encodeURIComponent(this.clientID)}&msg=${encodeURIComponent(txt)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {});
    }

    sendTyping() {

        console.log(`${this.clientID} Send typing`);

        fetch('/proxy/typing', {
            method: 'POST',
            body: `id=${encodeURIComponent(this.clientID)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {});
    }

    disconnected() {
        this.isConnected = false;
        this.message('disconnect', true);
    }

    on(type, cb) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(cb);
    }

    randId() {
        for (var a = "", b = 0; 8 > b; b++)
            var c = Math.floor(32 * Math.random()),
            a = a + "23456789ABCDEFGHJKLMNPQRSTUVWXYZ".charAt(c);
        return a
    }

    message(type, payload) {
        if (this.listeners[type]) {
            this.listeners[type].forEach((cb) => {
                cb(payload);
            });
        } else {}
    }
}

export default Omegle;
