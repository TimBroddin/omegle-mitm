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
                method: 'GET',
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
                    _this.message('serverDown');
                    setTimeout(function () {
                        _this.start();
                    }, 30000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9tZWdsZS9PbWVnbGUuanMiXSwibmFtZXMiOlsiT21lZ2xlIiwibGlzdGVuZXJzIiwiaXNDb25uZWN0ZWQiLCJxdWV1ZU1lc3NhZ2VzIiwiaGFzUGFydG5lciIsImV2ZW50VHJpZXMiLCJmZXRjaCIsIm1ldGhvZCIsImhlYWRlcnMiLCJ0aGVuIiwicmVzcG9uc2UiLCJ0ZXh0IiwiSlNPTiIsInBhcnNlIiwiY2xpZW50SUQiLCJjb25zb2xlIiwibG9nIiwiY29ubmVjdGVkIiwicGFyc2VFdmVudHMiLCJldmVudHMiLCJnZXRFdmVudHMiLCJtZXNzYWdlIiwic2V0VGltZW91dCIsInN0YXJ0IiwiYm9keSIsImVuY29kZVVSSUNvbXBvbmVudCIsImpzb24iLCJkaXNjb25uZWN0ZWQiLCJmb3JFYWNoIiwiZXZlbnQiLCJ0eXBlIiwicGF5bG9hZCIsInJlY2VpdmVNZXNzYWdlIiwidHlwaW5nIiwic3RhdHVzSW5mbyIsInR4dCIsInNlbmRNZXNzYWdlIiwic2VydmVyTWVzc2FnZSIsImluZm8iLCJwdXNoIiwiY2IiLCJhIiwiYiIsImMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjaGFyQXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTUEsTTtBQUVGLHNCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLGFBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxhQUFLQyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQixLQUFsQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFDSDs7OztnQ0FFTztBQUFBOztBQUNKLGlCQUFLRixhQUFMLEdBQXFCLEVBQXJCO0FBQ0EsaUJBQUtFLFVBQUwsR0FBa0IsQ0FBbEI7O0FBRUFDLHdEQUE0QztBQUN4Q0Msd0JBQVEsS0FEZ0M7QUFFeENDLHlCQUFTO0FBQ0wsa0NBQWMsWUFEVDtBQUVMLGtDQUFjO0FBRlQ7QUFGK0IsYUFBNUMsRUFNR0MsSUFOSCxD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QUF4QixDQUZPO0FBR25CTix5QkFBUztBQUNMLG9DQUFnQjtBQURYO0FBSFUsYUFBdkIsRUFNR0MsSUFOSCxDQU1RLFVBQUNDLFFBQUQsRUFBYyxDQUFFLENBTnhCO0FBT0g7Ozt1Q0FFYztBQUNYLGlCQUFLUixXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsaUJBQUttQixPQUFMLENBQWEsWUFBYixFQUEyQixJQUEzQjtBQUNIOzs7MkJBRUVTLEksRUFBTVUsRSxFQUFJO0FBQ1QsZ0JBQUksQ0FBQyxLQUFLdkMsU0FBTCxDQUFlNkIsSUFBZixDQUFMLEVBQTJCO0FBQ3ZCLHFCQUFLN0IsU0FBTCxDQUFlNkIsSUFBZixJQUF1QixFQUF2QjtBQUNIO0FBQ0QsaUJBQUs3QixTQUFMLENBQWU2QixJQUFmLEVBQXFCUyxJQUFyQixDQUEwQkMsRUFBMUI7QUFDSDs7O2lDQUVRO0FBQ0wsaUJBQUssSUFBSUMsSUFBSSxFQUFSLEVBQVlDLElBQUksQ0FBckIsRUFBd0IsSUFBSUEsQ0FBNUIsRUFBK0JBLEdBQS9CO0FBQ0ksb0JBQUlDLElBQUlDLEtBQUtDLEtBQUwsQ0FBVyxLQUFLRCxLQUFLRSxNQUFMLEVBQWhCLENBQVI7QUFBQSxvQkFDQUwsSUFBSUEsSUFBSSxtQ0FBbUNNLE1BQW5DLENBQTBDSixDQUExQyxDQURSO0FBREosYUFHQSxPQUFPRixDQUFQO0FBQ0g7OztnQ0FFT1gsSSxFQUFNQyxPLEVBQVM7QUFDbkIsZ0JBQUksS0FBSzlCLFNBQUwsQ0FBZTZCLElBQWYsQ0FBSixFQUEwQjtBQUN0QixxQkFBSzdCLFNBQUwsQ0FBZTZCLElBQWYsRUFBcUJGLE9BQXJCLENBQTZCLFVBQUNZLEVBQUQsRUFBUTtBQUNqQ0EsdUJBQUdULE9BQUg7QUFDSCxpQkFGRDtBQUdILGFBSkQsTUFJTyxDQUFFO0FBQ1o7Ozs7O2tCQUdVL0IsTSIsImZpbGUiOiJPbWVnbGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3RpbWJyb2RkaW4vU2l0ZXMvb21lZ2xlLW1pdG0iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBPbWVnbGUge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnF1ZXVlTWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5oYXNQYXJ0bmVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXZlbnRUcmllcyA9IDA7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMucXVldWVNZXNzYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLmV2ZW50VHJpZXMgPSAwO1xuXG4gICAgICAgIGZldGNoKGAvcHJveHkvc3RhcnQ/Zmlyc3RldmVudHM9MSZsYW5nPW5sYCwge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJyxcbiAgICAgICAgICAgICAgICAnVXNlci1hZ2VudCc6ICdNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xMl8wKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNTUuMC4yODgzLjk1IFNhZmFyaS81MzcuMzYnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICB9KS50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5jbGllbnRJRCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0ZWQgdG8gT21lZ2xlJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0ZWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRXZlbnRzKHJlc3BvbnNlLmV2ZW50cyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnRJRCA9IHJlc3BvbnNlLmNsaWVudElEO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDbGllbnRJZDogJHt0aGlzLmNsaWVudElEfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RXZlbnRzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZXJ2ZXIgZG93bj8nKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UoJ3NlcnZlckRvd24nKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgICAgIH0sIDMwMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5jbGllbnRJRH0gR2V0dGluZyBldmVudHNgKTtcbiAgICAgICAgZmV0Y2goJy9wcm94eS9ldmVudHMnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IGBpZD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLmNsaWVudElEKX1gLFxuICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJyxcbiAgICAgICAgICAgICAgICAnVXNlci1hZ2VudCc6ICdNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xMl8wKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNTUuMC4yODgzLjk1IFNhZmFyaS81MzcuMzYnLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICB9KS50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFdmVudHMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RXZlbnRzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmV2ZW50VHJpZXMrKztcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYFRyaWVzOiAke3RoaXMuZXZlbnRUcmllc31gKTtcbiAgICAgICAgICAgICAgaWYodGhpcy5ldmVudFRyaWVzID4gNSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdGVkKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RXZlbnRzKCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGFyc2VFdmVudHMoZXZlbnRzKSB7XG4gICAgICAgIGlmICghZXZlbnRzKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IGV2ZW50WzBdO1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IGV2ZW50WzFdO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdnb3RNZXNzYWdlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlTWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndHlwaW5nJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3RhdHVzSW5mbyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzSW5mbyhwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3RyYW5nZXJEaXNjb25uZWN0ZWQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdjb25uZWN0ZWQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1BhcnRuZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlTWVzc2FnZXMuZm9yRWFjaCgodHh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VuZGluZyBtZXNzYWdlIHF1ZXVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKHR4dCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzZXJ2ZXJNZXNzYWdlJzpcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyTWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbm5lY3RlZCgpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlKCdjb25uZWN0JywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmVjZWl2ZU1lc3NhZ2UodGV4dCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UoJ21lc3NhZ2UnLCB0ZXh0KTtcbiAgICB9XG5cbiAgICBzZXJ2ZXJNZXNzYWdlKHRleHQpIHtcbiAgICAgIHRoaXMubWVzc2FnZSgnc2VydmVyTWVzc2FnZScsIHRleHQpO1xuICAgIH1cblxuICAgIHN0YXR1c0luZm8oaW5mbykge31cblxuICAgIHR5cGluZygpIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5jbGllbnRJRH0gaXMgdHlwaW5nYCk7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlKCd0eXBpbmcnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBzZW5kTWVzc2FnZSh0eHQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc1BhcnRuZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBZGQgdG8gcXVldWUnKTtcbiAgICAgICAgICAgIHRoaXMucXVldWVNZXNzYWdlcy5wdXNoKHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5jbGllbnRJRH0gU2VuZCBtZXNzYWdlICR7dHh0fWApO1xuXG4gICAgICAgIGZldGNoKCcvcHJveHkvc2VuZCcsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogYGlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuY2xpZW50SUQpfSZtc2c9JHtlbmNvZGVVUklDb21wb25lbnQodHh0KX1gLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge30pO1xuICAgIH1cblxuICAgIHNlbmRUeXBpbmcoKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5jbGllbnRJRH0gU2VuZCB0eXBpbmdgKTtcblxuICAgICAgICBmZXRjaCgnL3Byb3h5L3R5cGluZycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogYGlkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuY2xpZW50SUQpfWAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkKCkge1xuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWVzc2FnZSgnZGlzY29ubmVjdCcsIHRydWUpO1xuICAgIH1cblxuICAgIG9uKHR5cGUsIGNiKSB7XG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnNbdHlwZV0pIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0ucHVzaChjYik7XG4gICAgfVxuXG4gICAgcmFuZElkKCkge1xuICAgICAgICBmb3IgKHZhciBhID0gXCJcIiwgYiA9IDA7IDggPiBiOyBiKyspXG4gICAgICAgICAgICB2YXIgYyA9IE1hdGguZmxvb3IoMzIgKiBNYXRoLnJhbmRvbSgpKSxcbiAgICAgICAgICAgIGEgPSBhICsgXCIyMzQ1Njc4OUFCQ0RFRkdISktMTU5QUVJTVFVWV1hZWlwiLmNoYXJBdChjKTtcbiAgICAgICAgcmV0dXJuIGFcbiAgICB9XG5cbiAgICBtZXNzYWdlKHR5cGUsIHBheWxvYWQpIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdGVuZXJzW3R5cGVdKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXS5mb3JFYWNoKChjYikgPT4ge1xuICAgICAgICAgICAgICAgIGNiKHBheWxvYWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7fVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT21lZ2xlO1xuIl19