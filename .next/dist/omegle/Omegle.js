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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9tZWdsZS9PbWVnbGUuanMiXSwibmFtZXMiOlsiT21lZ2xlIiwibGlzdGVuZXJzIiwiaXNDb25uZWN0ZWQiLCJxdWV1ZU1lc3NhZ2VzIiwiaGFzUGFydG5lciIsImZldGNoIiwicmFuZElkIiwibWV0aG9kIiwiaGVhZGVycyIsInRoZW4iLCJyZXNwb25zZSIsInRleHQiLCJKU09OIiwicGFyc2UiLCJjbGllbnRJRCIsImNvbnNvbGUiLCJsb2ciLCJjb25uZWN0ZWQiLCJwYXJzZUV2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50cyIsInNldFRpbWVvdXQiLCJzdGFydCIsImJvZHkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJqc29uIiwiZm9yRWFjaCIsImV2ZW50IiwidHlwZSIsInBheWxvYWQiLCJyZWNlaXZlTWVzc2FnZSIsInR5cGluZyIsInN0YXR1c0luZm8iLCJkaXNjb25uZWN0ZWQiLCJ0eHQiLCJzZW5kTWVzc2FnZSIsIm1lc3NhZ2UiLCJpbmZvIiwicHVzaCIsImNiIiwiYSIsImIiLCJjIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiY2hhckF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQU1BLE07QUFFRixzQkFBYztBQUFBOztBQUNWLGFBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsYUFBS0MsYUFBTCxHQUFxQixFQUFyQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDSDs7OztnQ0FFTztBQUFBOztBQUNKLGlCQUFLRCxhQUFMLEdBQXFCLEVBQXJCO0FBQ0FFLHFFQUF1RCxLQUFLQyxNQUFMLEVBQXZELGVBQWdGO0FBQzVFQyx3QkFBUSxNQURvRTtBQUU1RUMseUJBQVM7QUFDTCxrQ0FBYyxZQURUO0FBRUwsa0NBQWM7QUFGVDtBQUZtRSxhQUFoRixFQU1HQyxJQU5ILENBTVEsVUFBQ0MsUUFBRCxFQUFjO0FBQ2xCLHVCQUFPQSxTQUFTQyxJQUFULEVBQVA7QUFDSCxh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QWUyQixJQUFmLEVBQXFCVSxJQUFyQixDQUEwQkMsRUFBMUI7QUFDSDs7O2lDQUVRO0FBQ0wsaUJBQUssSUFBSUMsSUFBSSxFQUFSLEVBQVlDLElBQUksQ0FBckIsRUFBd0IsSUFBSUEsQ0FBNUIsRUFBK0JBLEdBQS9CO0FBQ0ksb0JBQUlDLElBQUlDLEtBQUtDLEtBQUwsQ0FBVyxLQUFLRCxLQUFLRSxNQUFMLEVBQWhCLENBQVI7QUFBQSxvQkFDQUwsSUFBSUEsSUFBSSxtQ0FBbUNNLE1BQW5DLENBQTBDSixDQUExQyxDQURSO0FBREosYUFHQSxPQUFPRixDQUFQO0FBQ0g7OztnQ0FFT1osSSxFQUFNQyxPLEVBQVM7QUFDbkIsZ0JBQUksS0FBSzVCLFNBQUwsQ0FBZTJCLElBQWYsQ0FBSixFQUEwQjtBQUN0QixxQkFBSzNCLFNBQUwsQ0FBZTJCLElBQWYsRUFBcUJGLE9BQXJCLENBQTZCLFVBQUNhLEVBQUQsRUFBUTtBQUNqQ0EsdUJBQUdWLE9BQUg7QUFDSCxpQkFGRDtBQUdILGFBSkQsTUFJTyxDQUFFO0FBQ1o7Ozs7O2tCQUdVN0IsTSIsImZpbGUiOiJPbWVnbGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3RpbWJyb2RkaW4vU2l0ZXMvb21lZ2xlLW1pdG0iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBPbWVnbGUge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnF1ZXVlTWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5oYXNQYXJ0bmVyID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMucXVldWVNZXNzYWdlcyA9IFtdO1xuICAgICAgICBmZXRjaChgL3Byb3h5L3N0YXJ0P3Jjcz0xJmZpcnN0ZXZlbnRzPTEmc3BpZD0mcmFuZGlkPSR7dGhpcy5yYW5kSWQoKX0mbGFuZz1ubGAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb25uZWN0aW9uJzogJ2tlZXAtYWxpdmUnLFxuICAgICAgICAgICAgICAgICdVc2VyLWFnZW50JzogJ01vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzEyXzApIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS81NS4wLjI4ODMuOTUgU2FmYXJpLzUzNy4zNidcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIH0pLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpO1xuICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLmNsaWVudElEKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Nvbm5lY3RlZCB0byBPbWVnbGUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RlZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFdmVudHMocmVzcG9uc2UuZXZlbnRzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudElEID0gcmVzcG9uc2UuY2xpZW50SUQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYENsaWVudElkOiAke3RoaXMuY2xpZW50SUR9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRFdmVudHMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlcnZlciBkb3duPycpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEV2ZW50cygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGAke3RoaXMuY2xpZW50SUR9IEdldHRpbmcgZXZlbnRzYCk7XG4gICAgICAgIGZldGNoKCcvcHJveHkvZXZlbnRzJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBgaWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jbGllbnRJRCl9YCxcbiAgICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZScsXG4gICAgICAgICAgICAgICAgJ1VzZXItYWdlbnQnOiAnTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTJfMCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzU1LjAuMjg4My45NSBTYWZhcmkvNTM3LjM2JyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgfSkudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCk7XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRXZlbnRzKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRFdmVudHMoKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGFyc2VFdmVudHMoZXZlbnRzKSB7XG4gICAgICAgIGlmICghZXZlbnRzKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IGV2ZW50WzBdO1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IGV2ZW50WzFdO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdnb3RNZXNzYWdlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlTWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndHlwaW5nJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3RhdHVzSW5mbyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzSW5mbyhwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3RyYW5nZXJEaXNjb25uZWN0ZWQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdjb25uZWN0ZWQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1BhcnRuZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlTWVzc2FnZXMuZm9yRWFjaCgodHh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VuZGluZyBtZXNzYWdlIHF1ZXVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKHR4dCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25uZWN0ZWQoKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSgnY29ubmVjdCcsIHRydWUpO1xuICAgIH1cblxuICAgIHJlY2VpdmVNZXNzYWdlKHRleHQpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlKCdtZXNzYWdlJywgdGV4dCk7XG4gICAgfVxuXG4gICAgc3RhdHVzSW5mbyhpbmZvKSB7fVxuXG4gICAgdHlwaW5nKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBpcyB0eXBpbmdgKTtcblxuICAgICAgICB0aGlzLm1lc3NhZ2UoJ3R5cGluZycsIHRydWUpO1xuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKHR4dCkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzUGFydG5lcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FkZCB0byBxdWV1ZScpO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZU1lc3NhZ2VzLnB1c2godGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBTZW5kIG1lc3NhZ2UgJHt0eHR9YCk7XG5cbiAgICAgICAgZmV0Y2goJy9wcm94eS9zZW5kJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBgaWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jbGllbnRJRCl9Jm1zZz0ke2VuY29kZVVSSUNvbXBvbmVudCh0eHQpfWAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgc2VuZFR5cGluZygpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmNsaWVudElEfSBTZW5kIHR5cGluZ2ApO1xuXG4gICAgICAgIGZldGNoKCcvcHJveHkvdHlwaW5nJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBgaWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jbGllbnRJRCl9YCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHt9KTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWQoKSB7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tZXNzYWdlKCdkaXNjb25uZWN0JywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgb24odHlwZSwgY2IpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RlbmVyc1t0eXBlXSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKGNiKTtcbiAgICB9XG5cbiAgICByYW5kSWQoKSB7XG4gICAgICAgIGZvciAodmFyIGEgPSBcIlwiLCBiID0gMDsgOCA+IGI7IGIrKylcbiAgICAgICAgICAgIHZhciBjID0gTWF0aC5mbG9vcigzMiAqIE1hdGgucmFuZG9tKCkpLFxuICAgICAgICAgICAgYSA9IGEgKyBcIjIzNDU2Nzg5QUJDREVGR0hKS0xNTlBRUlNUVVZXWFlaXCIuY2hhckF0KGMpO1xuICAgICAgICByZXR1cm4gYVxuICAgIH1cblxuICAgIG1lc3NhZ2UodHlwZSwgcGF5bG9hZCkge1xuICAgICAgICBpZiAodGhpcy5saXN0ZW5lcnNbdHlwZV0pIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLmZvckVhY2goKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgY2IocGF5bG9hZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHt9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPbWVnbGU7XG4iXX0=