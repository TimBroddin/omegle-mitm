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
    }

    (0, _createClass3.default)(Omegle, [{
        key: 'start',
        value: function start() {
            var _this = this;

            this.queueMessages = [];
            fetch('/proxy/start?rcs=1&firstevents=1&spid=&randid=' + this.randId() + '&lang=nl', {
                method: 'POST',
                headers: {
                    'Connection': 'keep-alive',
                    'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
                }
            }).then(function (response) {
                return response.text();
            }).then(function (text) {
                return JSON.parse(text);
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
                    setTimeout(function () {
                        _this.start();
                    }, 2000);
                }
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
                    setTimeout(function () {
                        _this2.getEvents();
                    }, 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9tZWdsZS9PbWVnbGUuanMiXSwibmFtZXMiOlsiT21lZ2xlIiwibGlzdGVuZXJzIiwiaXNDb25uZWN0ZWQiLCJxdWV1ZU1lc3NhZ2VzIiwiaGFzUGFydG5lciIsImZldGNoIiwicmFuZElkIiwibWV0aG9kIiwiaGVhZGVycyIsInRoZW4iLCJyZXNwb25zZSIsInRleHQiLCJKU09OIiwicGFyc2UiLCJjbGllbnRJRCIsImNvbnNvbGUiLCJsb2ciLCJjb25uZWN0ZWQiLCJwYXJzZUV2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50cyIsInNldFRpbWVvdXQiLCJzdGFydCIsImJvZHkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJqc29uIiwiZm9yRWFjaCIsImV2ZW50IiwidHlwZSIsInBheWxvYWQiLCJyZWNlaXZlTWVzc2FnZSIsInR5cGluZyIsInN0YXR1c0luZm8iLCJkaXNjb25uZWN0ZWQiLCJ0eHQiLCJzZW5kTWVzc2FnZSIsInNlcnZlck1lc3NhZ2UiLCJtZXNzYWdlIiwiaW5mbyIsInB1c2giLCJjYiIsImEiLCJiIiwiYyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNoYXJBdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztJQUFNQSxNO0FBRUYsc0JBQWM7QUFBQTs7QUFDVixhQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsYUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBLGFBQUtDLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxhQUFLQyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0g7Ozs7Z0NBRU87QUFBQTs7QUFDSixpQkFBS0QsYUFBTCxHQUFxQixFQUFyQjtBQUNBRSxxRUFBdUQsS0FBS0MsTUFBTCxFQUF2RCxlQUFnRjtBQUM1RUMsd0JBQVEsTUFEb0U7QUFFNUVDLHlCQUFTO0FBQ0wsa0NBQWMsWUFEVDtBQUVMLGtDQUFjO0FBRlQ7QUFGbUUsYUFBaEYsRUFNR0MsSUFOSCxDQU1RLFVBQUNDLFFBQUQsRUFBYztBQUNsQix1QkFBT0EsU0FBU0Ms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QUFNWSxFLEVBQUk7QUFDVCxnQkFBSSxDQUFDLEtBQUt2QyxTQUFMLENBQWUyQixJQUFmLENBQUwsRUFBMkI7QUFDdkIscUJBQUszQixTQUFMLENBQWUyQixJQUFmLElBQXVCLEVBQXZCO0FBQ0g7QUFDRCxpQkFBSzNCLFNBQUwsQ0FBZTJCLElBQWYsRUFBcUJXLElBQXJCLENBQTBCQyxFQUExQjtBQUNIOzs7aUNBRVE7QUFDTCxpQkFBSyxJQUFJQyxJQUFJLEVBQVIsRUFBWUMsSUFBSSxDQUFyQixFQUF3QixJQUFJQSxDQUE1QixFQUErQkEsR0FBL0I7QUFDSSxvQkFBSUMsSUFBSUMsS0FBS0MsS0FBTCxDQUFXLEtBQUtELEtBQUtFLE1BQUwsRUFBaEIsQ0FBUjtBQUFBLG9CQUNBTCxJQUFJQSxJQUFJLG1DQUFtQ00sTUFBbkMsQ0FBMENKLENBQTFDLENBRFI7QUFESixhQUdBLE9BQU9GLENBQVA7QUFDSDs7O2dDQUVPYixJLEVBQU1DLE8sRUFBUztBQUNuQixnQkFBSSxLQUFLNUIsU0FBTCxDQUFlMkIsSUFBZixDQUFKLEVBQTBCO0FBQ3RCLHFCQUFLM0IsU0FBTCxDQUFlMkIsSUFBZixFQUFxQkYsT0FBckIsQ0FBNkIsVUFBQ2MsRUFBRCxFQUFRO0FBQ2pDQSx1QkFBR1gsT0FBSDtBQUNILGlCQUZEO0FBR0gsYUFKRCxNQUlPLENBQUU7QUFDWjs7Ozs7a0JBR1U3QixNIiwiZmlsZSI6Ik9tZWdsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdGltYnJvZGRpbi9TaXRlcy9vbWVnbGUtbWl0bSIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE9tZWdsZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucXVldWVNZXNzYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLmhhc1BhcnRuZXIgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5xdWV1ZU1lc3NhZ2VzID0gW107XG4gICAgICAgIGZldGNoKGAvcHJveHkvc3RhcnQ/cmNzPTEmZmlyc3RldmVudHM9MSZzcGlkPSZyYW5kaWQ9JHt0aGlzLnJhbmRJZCgpfSZsYW5nPW5sYCwge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZScsXG4gICAgICAgICAgICAgICAgJ1VzZXItYWdlbnQnOiAnTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTJfMCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzU1LjAuMjg4My45NSBTYWZhcmkvNTM3LjM2J1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgfSkudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCk7XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuY2xpZW50SUQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29ubmVjdGVkIHRvIE9tZWdsZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZUV2ZW50cyhyZXNwb25zZS5ldmVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SUQgPSByZXNwb25zZS5jbGllbnRJRDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2xpZW50SWQ6ICR7dGhpcy5jbGllbnRJRH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmVyIGRvd24/Jyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5jbGllbnRJRH0gR2V0dGluZyBldmVudHNgKTtcbiAgICAgICAgZmV0Y2goJy9wcm94eS9ldmVudHMnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IGBpZD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLmNsaWVudElEKX1gLFxuICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJyxcbiAgICAgICAgICAgICAgICAnVXNlci1hZ2VudCc6ICdNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xMl8wKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNTUuMC4yODgzLjk1IFNhZmFyaS81MzcuMzYnLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICB9KS50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFdmVudHMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RXZlbnRzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwYXJzZUV2ZW50cyhldmVudHMpIHtcbiAgICAgICAgaWYgKCFldmVudHMpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gZXZlbnRbMF07XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gZXZlbnRbMV07XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2dvdE1lc3NhZ2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0eXBpbmcnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGluZygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdGF0dXNJbmZvJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNJbmZvKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJhbmdlckRpc2Nvbm5lY3RlZCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdGVkKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Nvbm5lY3RlZCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUGFydG5lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVldWVNZXNzYWdlcy5mb3JFYWNoKCh0eHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIG1lc3NhZ2UgcXVldWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UodHh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlcnZlck1lc3NhZ2UnOlxuICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29ubmVjdGVkKCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UoJ2Nvbm5lY3QnLCB0cnVlKTtcbiAgICB9XG5cbiAgICByZWNlaXZlTWVzc2FnZSh0ZXh0KSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSgnbWVzc2FnZScsIHRleHQpO1xuICAgIH1cblxuICAgIHNlcnZlck1lc3NhZ2UodGV4dCkge1xuICAgICAgdGhpcy5tZXNzYWdlKCdzZXJ2ZXJNZXNzYWdlJywgdGV4dCk7XG4gICAgfVxuXG4gICAgc3RhdHVzSW5mbyhpbmZvKSB7fVxuXG4gICAgdHlwaW5nKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBpcyB0eXBpbmdgKTtcblxuICAgICAgICB0aGlzLm1lc3NhZ2UoJ3R5cGluZycsIHRydWUpO1xuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKHR4dCkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzUGFydG5lcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FkZCB0byBxdWV1ZScpO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZU1lc3NhZ2VzLnB1c2godGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBTZW5kIG1lc3NhZ2UgJHt0eHR9YCk7XG5cbiAgICAgICAgZmV0Y2goJy9wcm94eS9zZW5kJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBgaWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jbGllbnRJRCl9Jm1zZz0ke2VuY29kZVVSSUNvbXBvbmVudCh0eHQpfWAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgc2VuZFR5cGluZygpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBTZW5kIHR5cGluZ2ApO1xuXG4gICAgICAgIGZldGNoKCcvcHJveHkvdHlwaW5nJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBgaWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jbGllbnRJRCl9YCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHt9KTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWQoKSB7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tZXNzYWdlKCdkaXNjb25uZWN0JywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgb24odHlwZSwgY2IpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RlbmVyc1t0eXBlXSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKGNiKTtcbiAgICB9XG5cbiAgICByYW5kSWQoKSB7XG4gICAgICAgIGZvciAodmFyIGEgPSBcIlwiLCBiID0gMDsgOCA+IGI7IGIrKylcbiAgICAgICAgICAgIHZhciBjID0gTWF0aC5mbG9vcigzMiAqIE1hdGgucmFuZG9tKCkpLFxuICAgICAgICAgICAgYSA9IGEgKyBcIjIzNDU2Nzg5QUJDREVGR0hKS0xNTlBRUlNUVVZXWFlaXCIuY2hhckF0KGMpO1xuICAgICAgICByZXR1cm4gYVxuICAgIH1cblxuICAgIG1lc3NhZ2UodHlwZSwgcGF5bG9hZCkge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbdHlwZV0pIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLmZvckVhY2goKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgY2IocGF5bG9hZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHt9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPbWVnbGU7XG4iXX0=