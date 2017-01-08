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
            fetch('/proxy/start?rcs=1&firstevents=1&spid=&randid=PBBN7SY8&lang=nl', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9tZWdsZS9PbWVnbGUuanMiXSwibmFtZXMiOlsiT21lZ2xlIiwibGlzdGVuZXJzIiwiaXNDb25uZWN0ZWQiLCJxdWV1ZU1lc3NhZ2VzIiwiaGFzUGFydG5lciIsImZldGNoIiwibWV0aG9kIiwiaGVhZGVycyIsInRoZW4iLCJyZXNwb25zZSIsInRleHQiLCJKU09OIiwicGFyc2UiLCJjbGllbnRJRCIsImNvbnNvbGUiLCJsb2ciLCJjb25uZWN0ZWQiLCJwYXJzZUV2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50cyIsInNldFRpbWVvdXQiLCJzdGFydCIsImJvZHkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJqc29uIiwiZm9yRWFjaCIsImV2ZW50IiwidHlwZSIsInBheWxvYWQiLCJyZWNlaXZlTWVzc2FnZSIsInR5cGluZyIsInN0YXR1c0luZm8iLCJkaXNjb25uZWN0ZWQiLCJ0eHQiLCJzZW5kTWVzc2FnZSIsIm1lc3NhZ2UiLCJpbmZvIiwicHVzaCIsImNiIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQ01BLE07QUFFRixzQkFBYztBQUFBOztBQUNWLGFBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsYUFBS0MsYUFBTCxHQUFxQixFQUFyQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDSDs7OztnQ0FFTztBQUFBOztBQUNKLGlCQUFLRCxhQUFMLEdBQXFCLEVBQXJCO0FBQ0FFLGtCQUFNLGdFQUFOLEVBQXdFO0FBQ3BFQyx3QkFBUSxNQUQ0RDtBQUVwRUMseUJBQVM7QUFDTCxrQ0FBYyxZQURUO0FBRUwsa0NBQWM7QUFGVDtBQUYyRCxhQUF4RSxFQU1HQyxJQU5ILENBTVEsVUFBQ0MsUUFBRCxFQUFjO0FBQ3BCLHVCQUFPQSxTQUFTQyxJQUFULEVBQVA7QUFDRCxhQVJELEVBUUdGLElBUkgsQ0FRUSxVQUFDRSxJQUFELEVBQVU7QUFDaEIsdUJBQU9DLEtBQUtDLEtBQUwsQ0FBV0Ys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O0FBQ25CLGdCQUFJLEtBQUszQixTQUFMLENBQWUwQixJQUFmLENBQUosRUFBMEI7QUFDdEIscUJBQUsxQixTQUFMLENBQWUwQixJQUFmLEVBQXFCRixPQUFyQixDQUE2QixVQUFDYSxFQUFELEVBQVE7QUFDakNBLHVCQUFHVixPQUFIO0FBQ0gsaUJBRkQ7QUFHSCxhQUpELE1BSU8sQ0FBRTtBQUNaOzs7OztrQkFHVTVCLE0iLCJmaWxlIjoiT21lZ2xlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy90aW1icm9kZGluL1NpdGVzL29tZWdsZS1taXRtIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBPbWVnbGUge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnF1ZXVlTWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5oYXNQYXJ0bmVyID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMucXVldWVNZXNzYWdlcyA9IFtdO1xuICAgICAgICBmZXRjaCgnL3Byb3h5L3N0YXJ0P3Jjcz0xJmZpcnN0ZXZlbnRzPTEmc3BpZD0mcmFuZGlkPVBCQk43U1k4Jmxhbmc9bmwnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJyxcbiAgICAgICAgICAgICAgICAnVXNlci1hZ2VudCc6ICdNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xMl8wKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNTUuMC4yODgzLjk1IFNhZmFyaS81MzcuMzYnXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIH0pLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5jbGllbnRJRCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0ZWQgdG8gT21lZ2xlJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0ZWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRXZlbnRzKHJlc3BvbnNlLmV2ZW50cyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnRJRCA9IHJlc3BvbnNlLmNsaWVudElEO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDbGllbnRJZDogJHt0aGlzLmNsaWVudElEfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RXZlbnRzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmVyIGRvd24/Jyk7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEV2ZW50cygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG5cbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5jbGllbnRJRH0gR2V0dGluZyBldmVudHNgKTtcbiAgICAgICAgZmV0Y2goJy9wcm94eS9ldmVudHMnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IGBpZD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLmNsaWVudElEKX1gLFxuICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJyxcbiAgICAgICAgICAgICAgICAnVXNlci1hZ2VudCc6ICdNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xMl8wKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNTUuMC4yODgzLjk1IFNhZmFyaS81MzcuMzYnLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgfSkudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCk7XG4gICAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFdmVudHMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RXZlbnRzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwYXJzZUV2ZW50cyhldmVudHMpIHtcbiAgICAgICAgaWYgKCFldmVudHMpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gZXZlbnRbMF07XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gZXZlbnRbMV07XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2dvdE1lc3NhZ2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0eXBpbmcnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGluZygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdGF0dXNJbmZvJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNJbmZvKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJhbmdlckRpc2Nvbm5lY3RlZCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdGVkKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Nvbm5lY3RlZCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUGFydG5lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVldWVNZXNzYWdlcy5mb3JFYWNoKCh0eHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIG1lc3NhZ2UgcXVldWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UodHh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbm5lY3RlZCgpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlKCdjb25uZWN0JywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmVjZWl2ZU1lc3NhZ2UodGV4dCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UoJ21lc3NhZ2UnLCB0ZXh0KTtcbiAgICB9XG5cbiAgICBzdGF0dXNJbmZvKGluZm8pIHt9XG5cbiAgICB0eXBpbmcoKSB7XG4gICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBpcyB0eXBpbmdgKTtcblxuICAgICAgICB0aGlzLm1lc3NhZ2UoJ3R5cGluZycsIHRydWUpO1xuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKHR4dCkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzUGFydG5lcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FkZCB0byBxdWV1ZScpO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZU1lc3NhZ2VzLnB1c2godGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBTZW5kIG1lc3NhZ2UgJHt0eHR9YCk7XG5cblxuICAgICAgICBmZXRjaCgnL3Byb3h5L3NlbmQnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IGBpZD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLmNsaWVudElEKX0mbXNnPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHR4dCl9YCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgc2VuZFR5cGluZygpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBTZW5kIHR5cGluZ2ApO1xuXG4gICAgICAgIGZldGNoKCcvcHJveHkvdHlwaW5nJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBgaWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jbGllbnRJRCl9YCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkKCkge1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWVzc2FnZSgnZGlzY29ubmVjdCcsIHRydWUpO1xuICAgIH1cblxuICAgIG9uKHR5cGUsIGNiKSB7XG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnNbdHlwZV0pIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0ucHVzaChjYik7XG4gICAgfVxuXG4gICAgbWVzc2FnZSh0eXBlLCBwYXlsb2FkKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1t0eXBlXSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0uZm9yRWFjaCgoY2IpID0+IHtcbiAgICAgICAgICAgICAgICBjYihwYXlsb2FkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge31cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9tZWdsZTtcbiJdfQ==