'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Omegle = function () {
    function Omegle() {
        (0, _classCallCheck3.default)(this, Omegle);

        this.listeners = [];
        this.isConnected = true;
        this.queueMessages = [];
        this.hasPartner = false;
        this.eventTries = 0;
    }

    (0, _createClass3.default)(Omegle, [{
        key: 'start',
        value: function start() {
            var _this = this;

            this.queueMessages = [];
            this.eventTries = 0;

            fetch('/proxy/start?firstevents=1&lang=nl', {
                method: 'POST',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            }).then(function (response) {
                return response.text();
            }).then(function (text) {
                if (text) {
                    return JSON.parse(text);
                } else {
                    throw new Error('No text');
                }
            }).then(function (response) {
                if (response && response.clientID) {
                    console.log('Connected to Omegle');
                    _this.connected();
                    _this.parseEvents(response.events);
                    _this.clientID = response.clientID;
                    console.log('ClientId: ' + _this.clientID);
                    _this.isConnected = true;
                    _this.getEvents();
                } else {
                    console.log('Server down?');
                    _this.message('serverDown');
                    setTimeout(function () {
                        _this.start();
                    }, 30000);
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
    }, {
        key: 'getEvents',
        value: function getEvents() {
            var _this2 = this;

            if (!this.isConnected) return false;

            console.log(this.clientID + ' Getting events');
            fetch('/proxy/events', {
                method: 'POST',
                body: 'id=' + encodeURIComponent(this.clientID),
                json: true,
                headers: {
                    'Connection': 'keep-alive',
                    'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded'

                }
            }).then(function (response) {
                return response.text();
            }).then(function (text) {
                return JSON.parse(text);
            }).then(function (response) {
                if (response) {
                    _this2.parseEvents(response);
                    _this2.getEvents();
                } else {
                    _this2.eventTries++;
                    console.log('Tries: ' + _this2.eventTries);
                    if (_this2.eventTries > 5) {
                        _this2.disconnected();
                    } else {
                        setTimeout(function () {
                            _this2.getEvents();
                        }, 1000);
                    }
                }
            });
        }
    }, {
        key: 'parseEvents',
        value: function parseEvents(events) {
            var _this3 = this;

            if (!events) return;

            events.forEach(function (event) {
                var type = event[0];
                var payload = event[1];

                switch (type) {
                    case 'gotMessage':
                        _this3.receiveMessage(payload);
                        break;
                    case 'typing':
                        _this3.typing();
                        break;
                    case 'statusInfo':
                        _this3.statusInfo(payload);
                        break;
                    case 'strangerDisconnected':
                        _this3.disconnected();
                        break;
                    case 'connected':
                        _this3.hasPartner = true;
                        _this3.queueMessages.forEach(function (txt) {
                            console.log('Sending message queue');
                            _this3.sendMessage(txt);
                        });
                        break;
                    case 'serverMessage':
                        _this3.serverMessage(payload);
                        break;
                    default:
                }
            });
        }
    }, {
        key: 'connected',
        value: function connected() {
            this.message('connect', true);
        }
    }, {
        key: 'receiveMessage',
        value: function receiveMessage(text) {
            this.message('message', text);
        }
    }, {
        key: 'serverMessage',
        value: function serverMessage(text) {
            this.message('serverMessage', text);
        }
    }, {
        key: 'statusInfo',
        value: function statusInfo(info) {}
    }, {
        key: 'typing',
        value: function typing() {
            console.log(this.clientID + ' is typing');

            this.message('typing', true);
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage(txt) {
            if (!this.hasPartner) {
                console.log('Add to queue');
                this.queueMessages.push(text);
            }

            console.log(this.clientID + ' Send message ' + txt);

            fetch('/proxy/send', {
                method: 'POST',
                body: 'id=' + encodeURIComponent(this.clientID) + '&msg=' + encodeURIComponent(txt),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {});
        }
    }, {
        key: 'sendTyping',
        value: function sendTyping() {

            console.log(this.clientID + ' Send typing');

            fetch('/proxy/typing', {
                method: 'POST',
                body: 'id=' + encodeURIComponent(this.clientID),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {});
        }
    }, {
        key: 'disconnected',
        value: function disconnected() {
            this.isConnected = false;
            this.message('disconnect', true);
        }
    }, {
        key: 'on',
        value: function on(type, cb) {
            if (!this.listeners[type]) {
                this.listeners[type] = [];
            }
            this.listeners[type].push(cb);
        }
    }, {
        key: 'randId',
        value: function randId() {
            for (var a = "", b = 0; 8 > b; b++) {
                var c = Math.floor(32 * Math.random()),
                    a = a + "23456789ABCDEFGHJKLMNPQRSTUVWXYZ".charAt(c);
            }return a;
        }
    }, {
        key: 'message',
        value: function message(type, payload) {
            if (this.listeners[type]) {
                this.listeners[type].forEach(function (cb) {
                    cb(payload);
                });
            } else {}
        }
    }]);
    return Omegle;
}();

exports.default = Omegle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9tZWdsZS9PbWVnbGUuanMiXSwibmFtZXMiOlsiT21lZ2xlIiwibGlzdGVuZXJzIiwiaXNDb25uZWN0ZWQiLCJxdWV1ZU1lc3NhZ2VzIiwiaGFzUGFydG5lciIsImV2ZW50VHJpZXMiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJ0aGVuIiwicmVzcG9uc2UiLCJ0ZXh0IiwiSlNPTiIsInBhcnNlIiwiRXJyb3IiLCJjbGllbnRJRCIsImNvbnNvbGUiLCJsb2ciLCJjb25uZWN0ZWQiLCJwYXJzZUV2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50cyIsIm1lc3NhZ2UiLCJzZXRUaW1lb3V0Iiwic3RhcnQiLCJjYXRjaCIsImVyciIsImJvZHkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJqc29uIiwiZGlzY29ubmVjdGVkIiwiZm9yRWFjaCIsImV2ZW50IiwidHlwZSIsInBheWxvYWQiLCJyZWNlaXZlTWVzc2FnZSIsInR5cGluZyIsInN0YXR1c0luZm8iLCJ0eHQiLCJzZW5kTWVzc2FnZSIsInNlcnZlck1lc3NhZ2UiLCJpbmZvIiwicHVzaCIsImNiIiwiYSIsImIiLCJjIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiY2hhckF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQU1BLE07QUFFRixzQkFBYztBQUFBOztBQUNWLGFBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsYUFBS0MsYUFBTCxHQUFxQixFQUFyQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxhQUFLQyxVQUFMLEdBQWtCLENBQWxCO0FBQ0g7Ozs7Z0NBRU87QUFBQTs7QUFDSixpQkFBS0YsYUFBTCxHQUFxQixFQUFyQjtBQUNBLGlCQUFLRSxVQUFMLEdBQWtCLENBQWxCOztBQUVBQyx3REFBNEM7QUFDeENDLHdCQUFRLE1BRGdDO0FBRXhDQyx5QkFBUztBQUNMLDhCQUFVO0FBREw7QUFGK0IsYUFBNUMsRUFLR0Ms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QkFBR1QsT0FBSDtBQUNILGlCQUZEO0FBR0gsYUFKRCxNQUlPLENBQUU7QUFDWjs7Ozs7a0JBR1VsQyxNIiwiZmlsZSI6Ik9tZWdsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdGltYnJvZGRpbi9TaXRlcy9vbWVnbGUtbWl0bSIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE9tZWdsZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucXVldWVNZXNzYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLmhhc1BhcnRuZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ldmVudFRyaWVzID0gMDtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5xdWV1ZU1lc3NhZ2VzID0gW107XG4gICAgICAgIHRoaXMuZXZlbnRUcmllcyA9IDA7XG5cbiAgICAgICAgZmV0Y2goYC9wcm94eS9zdGFydD9maXJzdGV2ZW50cz0xJmxhbmc9bmxgLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ3RleHQvaHRtbCxhcHBsaWNhdGlvbi94aHRtbCt4bWwsYXBwbGljYXRpb24veG1sO3E9MC45LGltYWdlL3dlYnAsKi8qO3E9MC44JyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIH0pLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgIGlmKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHRleHQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuY2xpZW50SUQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29ubmVjdGVkIHRvIE9tZWdsZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZUV2ZW50cyhyZXNwb25zZS5ldmVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SUQgPSByZXNwb25zZS5jbGllbnRJRDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2xpZW50SWQ6ICR7dGhpcy5jbGllbnRJRH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmVyIGRvd24/Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlKCdzZXJ2ZXJEb3duJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICB9LCAzMDAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRFdmVudHMoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBHZXR0aW5nIGV2ZW50c2ApO1xuICAgICAgICBmZXRjaCgnL3Byb3h5L2V2ZW50cycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogYGlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuY2xpZW50SUQpfWAsXG4gICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb25uZWN0aW9uJzogJ2tlZXAtYWxpdmUnLFxuICAgICAgICAgICAgICAgICdVc2VyLWFnZW50JzogJ01vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzEyXzApIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS81NS4wLjI4ODMuOTUgU2FmYXJpLzUzNy4zNicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIH0pLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpO1xuICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZUV2ZW50cyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRFdmVudHMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZXZlbnRUcmllcysrO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVHJpZXM6ICR7dGhpcy5ldmVudFRyaWVzfWApO1xuICAgICAgICAgICAgICBpZih0aGlzLmV2ZW50VHJpZXMgPiA1KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWQoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRFdmVudHMoKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwYXJzZUV2ZW50cyhldmVudHMpIHtcbiAgICAgICAgaWYgKCFldmVudHMpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gZXZlbnRbMF07XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gZXZlbnRbMV07XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2dvdE1lc3NhZ2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0eXBpbmcnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGluZygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdGF0dXNJbmZvJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNJbmZvKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJhbmdlckRpc2Nvbm5lY3RlZCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdGVkKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Nvbm5lY3RlZCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUGFydG5lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVldWVNZXNzYWdlcy5mb3JFYWNoKCh0eHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIG1lc3NhZ2UgcXVldWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UodHh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlcnZlck1lc3NhZ2UnOlxuICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29ubmVjdGVkKCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UoJ2Nvbm5lY3QnLCB0cnVlKTtcbiAgICB9XG5cbiAgICByZWNlaXZlTWVzc2FnZSh0ZXh0KSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSgnbWVzc2FnZScsIHRleHQpO1xuICAgIH1cblxuICAgIHNlcnZlck1lc3NhZ2UodGV4dCkge1xuICAgICAgdGhpcy5tZXNzYWdlKCdzZXJ2ZXJNZXNzYWdlJywgdGV4dCk7XG4gICAgfVxuXG4gICAgc3RhdHVzSW5mbyhpbmZvKSB7fVxuXG4gICAgdHlwaW5nKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBpcyB0eXBpbmdgKTtcblxuICAgICAgICB0aGlzLm1lc3NhZ2UoJ3R5cGluZycsIHRydWUpO1xuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKHR4dCkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzUGFydG5lcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FkZCB0byBxdWV1ZScpO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZU1lc3NhZ2VzLnB1c2godGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBTZW5kIG1lc3NhZ2UgJHt0eHR9YCk7XG5cbiAgICAgICAgZmV0Y2goJy9wcm94eS9zZW5kJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBgaWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jbGllbnRJRCl9Jm1zZz0ke2VuY29kZVVSSUNvbXBvbmVudCh0eHQpfWAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgc2VuZFR5cGluZygpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBTZW5kIHR5cGluZ2ApO1xuXG4gICAgICAgIGZldGNoKCcvcHJveHkvdHlwaW5nJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBgaWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jbGllbnRJRCl9YCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHt9KTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWQoKSB7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tZXNzYWdlKCdkaXNjb25uZWN0JywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgb24odHlwZSwgY2IpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RlbmVyc1t0eXBlXSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKGNiKTtcbiAgICB9XG5cbiAgICByYW5kSWQoKSB7XG4gICAgICAgIGZvciAodmFyIGEgPSBcIlwiLCBiID0gMDsgOCA+IGI7IGIrKylcbiAgICAgICAgICAgIHZhciBjID0gTWF0aC5mbG9vcigzMiAqIE1hdGgucmFuZG9tKCkpLFxuICAgICAgICAgICAgYSA9IGEgKyBcIjIzNDU2Nzg5QUJDREVGR0hKS0xNTlBRUlNUVVZXWFlaXCIuY2hhckF0KGMpO1xuICAgICAgICByZXR1cm4gYVxuICAgIH1cblxuICAgIG1lc3NhZ2UodHlwZSwgcGF5bG9hZCkge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbdHlwZV0pIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLmZvckVhY2goKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgY2IocGF5bG9hZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHt9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPbWVnbGU7XG4iXX0=