"use strict";

const request = require('request-promise');
const colors = require('colors');

let servers = [];

function getServers() {
    request({uri: 'http://omegle.com/status', json: true}).then((status) => {
        servers = status.servers;
    })
}

setInterval(() => {
    getServers();
}, 30 * 1000);

getServers();

class Omegle {

    constructor() {
        this.listeners = [];
        this.isConnected = true;
        this.queueMessages = [];
        this.hasPartner = false;
        this.eventTries = 0;
    }

    getServer() {
        if (servers.length) {
            this.server = servers[Math.round(Math.random() * servers.length)];
        } else {
            this.server = 'front1.omegle.com';
        }
    }

    start() {
        this.queueMessages = [];
        this.eventTries = 0;
        this.getServer();

        request(`http://${this.server}/start?firstevents=1`, {
            method: 'POST',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            json: true
        }).then((response) => {
            if (response && response.clientID) {
                this.connected();
                this.parseEvents(response.events);
                this.clientID = response.clientID;
                this.isConnected = true;
                this.getEvents();
            } else {
                this.message('serverDown', this.server);
            }
        }).catch((err) => {
            console.log('Error: ' + err.message);
            //this.start();
        });
    }

    getEvents() {
        if (!this.isConnected)
            return false;

        request(`http://${this.server}/events`, {
            method: 'POST',
            body: `id=${encodeURIComponent(this.clientID)}`,
            json: true,
            headers: {
                'Connection': 'keep-alive',
                'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded'

            }
        }).then((response) => {
            if (response) {
                this.parseEvents(response);
                this.getEvents();
            } else {
                this.eventTries++;
                if (this.eventTries > 5) {
                    this.disconnected();
                } else {
                    setTimeout(() => {
                        this.getEvents();
                    }, 1000);
                }
            }
        }).catch((err) => {
            this.getServer();
            //console.log(`** Failed to fetch events`.red);
            this.getEvents();
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
                case 'error':
                    this.message('error', payload);
                    break;
                case 'waiting':
                    this.message('waiting');
                    break;
                case 'identDigests':
                    break;
                default:
                    this.message('unhandled', {type, payload});
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
        this.message('typing', true);
    }

    sendMessage(txt) {
        if (!this.hasPartner) {
            console.log('Add to queue');
            this.queueMessages.push(text);
        }

        request(`http://${this.server}/send`, {
            method: 'POST',
            body: `id=${encodeURIComponent(this.clientID)}&msg=${encodeURIComponent(txt)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {}).catch((err) => {
            this.getServer();
            //console.log(`** Failed to send message`.red);
            this.sendMessage(txt);
        });

    }

    sendTyping() {

        request(`http://${this.server}/typing`, {
            method: 'POST',
            body: `id=${encodeURIComponent(this.clientID)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {}).catch((err) => {
            //console.log(`** Failed to send message`.red);
            this.getServer();
            this.sendMessage(txt);
        });;
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

let c1 = new Omegle();
let c2 = new Omegle();

c1.on('message', (text) => {
    c2.sendMessage(text);
    console.log(`${ '[Person 1]'.red} ${text}`);
});

c2.on('message', (text) => {
    c1.sendMessage(text);
    console.log(`${ '[Person 2]'.green} ${text}`);
});

c1.on('typing', () => {
    c2.sendTyping();
});

c2.on('typing', () => {
    c1.sendTyping();
});

c2.on('message', (text) => {
    c1.sendMessage(text);
    console.log(`${ '[Person 2]'.green} ${text}`);
});

c1.on('serverMessage', (text) => {
    console.log(`${ '[SERVER]'.red} ${text}`);
});

c2.on('serverMessage', (text) => {
    console.log(`${ '[SERVER]'.green} ${text}`);
});

c1.on('connect', () => {
    console.log(`* ${ '[Person 1]'.red} connected`);
});

c2.on('connect', () => {
    console.log(`* ${ '[Person 2]'.green} connected`);
});

c1.on('serverDown', (server) => {
    console.log(`* ${ '[Server down?]'.red} ${server}`);
    setTimeout(() => {
        if (c1.clientID && c2.clientID) {
            c1.start();
            c2.start();
        }
    }, 10000);

})

c2.on('serverDown', (server) => {
    console.log(`* ${ '[Server down?]'.green} ${server}`);
    setTimeout(() => {
        if (c1.clientID && c2.clientID) {
            c1.start();
            c2.start();
        }
    }, 10000);
})

c1.on('disconnect', () => {
    setTimeout(() => {
        if (c1.clientID && c2.clientID) {
            c1.start();
            c2.start();
        }
    }, 1000);
    console.log('========== Disconnected ========='.blue.inverse)
});

c2.on('disconnect', () => {
    setTimeout(() => {
        if (c1.clientID && c2.clientID) {
            c1.start();
            c2.start();
        }
    }, 1000);
    console.log('========== Disconnected ========='.blue.inverse)

});

c1.on('unhandled', (props) => {
    let type = props.type;
    console.log(`Unhandled: ${type}`.yellow);
});

c2.on('unhandled', (props) => {
    let type = props.type;
    console.log(`Unhandled: ${type}`.yellow);
});

c1.on('error', (err) => {
    console.log(`** ERROR ${err}`)
});

c2.on('error', (err) => {
    console.log(`** ERROR ${err}`)
});

c1.start();
c2.start();
