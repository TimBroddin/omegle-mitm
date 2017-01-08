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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9tZWdsZS9PbWVnbGUuanMiXSwibmFtZXMiOlsiT21lZ2xlIiwibGlzdGVuZXJzIiwiaXNDb25uZWN0ZWQiLCJxdWV1ZU1lc3NhZ2VzIiwiaGFzUGFydG5lciIsImV2ZW50VHJpZXMiLCJmZXRjaCIsInJhbmRJZCIsIm1ldGhvZCIsImhlYWRlcnMiLCJ0aGVuIiwicmVzcG9uc2UiLCJ0ZXh0IiwiSlNPTiIsInBhcnNlIiwiY2xpZW50SUQiLCJjb25zb2xlIiwibG9nIiwiY29ubmVjdGVkIiwicGFyc2VFdmVudHMiLCJldmVudHMiLCJnZXRFdmVudHMiLCJtZXNzYWdlIiwic2V0VGltZW91dCIsInN0YXJ0IiwiYm9keSIsImVuY29kZVVSSUNvbXBvbmVudCIsImpzb24iLCJkaXNjb25uZWN0ZWQiLCJmb3JFYWNoIiwiZXZlbnQiLCJ0eXBlIiwicGF5bG9hZCIsInJlY2VpdmVNZXNzYWdlIiwidHlwaW5nIiwic3RhdHVzSW5mbyIsInR4dCIsInNlbmRNZXNzYWdlIiwic2VydmVyTWVzc2FnZSIsImluZm8iLCJwdXNoIiwiY2IiLCJhIiwiYiIsImMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjaGFyQXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTUEsTTtBQUVGLHNCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLGFBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxhQUFLQyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQixLQUFsQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFDSDs7OztnQ0FFTztBQUFBOztBQUNKLGlCQUFLRixhQUFMLEdBQXFCLEVBQXJCO0FBQ0EsaUJBQUtFLFVBQUwsR0FBa0IsQ0FBbEI7O0FBRUFDLHFFQUF1RCxLQUFLQyxNQUFMLEVBQXZELGVBQWdGO0FBQzVFQyx3QkFBUSxNQURvRTtBQUU1RUMseUJBQVM7QUFDTCxrQ0FBYyxZQURUO0FBRUwsa0NBQWM7QUFGVDtBQUZtRSxhQUFoRixFQU1HQyxJQU5ILENBTVEsVUFBQ0MsUUFBRCxFQUFjO0FBQ2xCLHVCQUFPQSxTQUFTQyxJQUFULEVBQVA7QUFDSCxhQVJELEVBUUdGLElBUkgsQ0FRUSxVQUFDRSxJQUFELEVBQVU7QUFDZCx1QkFBT0MsS0FBS0MsS0FBTCxDQUFXRixJQUFYLENBQVA7QUFDSCxhQVZELEVBVUdGLElBVkgsQ0FVUSxVQUFDQyxRQUFELEVBQWM7QUFDbEIsb0JBQUlBLFlBQVlBLFNBQVNJLFFBQXpCLEVBQW1DO0FBQy9CQyw0QkFBUUMsR0FBUixDQUFZLHFCQUFaO0FBQ0EsMEJBQUtDLFNBQUw7QUFDQSwwQkFBS0MsV0FBTCxDQUFpQlIsU0FBU1MsTUFBMUI7QUFDQSwwQkFBS0wsUUFBTCxHQUFnQkosU0FBU0ksUUFBekI7QUFDQUMsNEJBQVFDLEdBQVIsZ0JBQXlCLE1BQUtGLFFBQTlCO0FBQ0EsMEJBQUtiLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSwwQkFBS21CLFNBQUw7QUFDSCxpQkFSRCxNQVFPO0FBQ0hMLDRCQUFRQyxHQUFSLENBQVksY0FBWjtBQUNBLDBCQUFLSyxPQUFMLENBQWEsWUFBYjtBQUNBQywrQkFBVyxZQUFNO0FBQ2IsOEJBQUtDLEtBQUw7QUFDSCxxQkFGRCxFQUVHLEtBRkg7QUFHSDtBQUNKLGFBMUJEO0FBMkJIOzs7b0NBRVc7QUFBQTs7QUFDUixnQkFBSSxDQUFDLEtBQUt0QixXQUFWLEVBQ0ksT0FBTyxLQUFQOztBQUVKYyxvQkFBUUMsR0FBUixDQUFlLEtBQUtGLFFBQXBCO0FBQ0FULGtCQUFNLGVBQU4sRUFBdUI7QUFDbkJFLHdCQUFRLE1BRFc7QUFFbkJpQiw4QkFBWUMsbUJBQW1CLEtBQUtYLFFBQXhCLENBRk87QUFHbkJZLHNCQUFNLElBSGE7QUFJbkJsQix5QkFBUztBQUNMLGtDQUFjLFlBRFQ7QUFFTCxrQ0FBYywwSEFGVDtBQUdMLG9DQUFnQjs7QUFIWDtBQUpVLGFBQXZCLEVBVUdDLElBVkgsQ0FVUSxVQUFDQyxRQUFELEVBQWM7QUFDbEIsdUJBQU9BLFNBQVNDLElBQVQsRUFBUDtBQUNILGFBWkQsRUFZR0YsSUFaSCxDQVlRLFVBQUNFLElBQUQsRUFBVTtBQUNkLHVCQUFPQyxLQUFLQyxLQUFMLENBQVdGLElBQVgsQ0FBUDtBQUNILGFBZEQsRUFjR0YsSUFkSCxDQWNRLFVBQUNDLFFBQUQsRUFBYztBQUNsQixvQkFBSUEsUUFBSixFQUFjO0FBQ1YsMkJBQUtRLFdBQUwsQ0FBaUJSLFFBQWpCO0FBQ0EsMkJBQUtVLFNBQUw7QUFDSCxpQkFIRCxNQUdPO0FBQ0wsMkJBQUtoQixVQUFMO0FBQ0FXLDRCQUFRQyxHQUFSLGFBQXNCLE9BQUtaLFVBQTNCO0FBQ0Esd0JBQUcsT0FBS0EsVUFBTCxHQUFrQixDQUFyQixFQUF3QjtBQUN0QiwrQkFBS3VCLFlBQUw7QUFDRCxxQkFGRCxNQUVPO0FBQ0xMLG1DQUFXLFlBQU07QUFDYixtQ0FBS0YsU0FBTDtBQUNILHlCQUZELEVBRUcsSUFGSDtBQUdEO0FBQ0Y7QUFDSixhQTdCRDtBQThCSDs7O29DQUVXRCxNLEVBQVE7QUFBQTs7QUFDaEIsZ0JBQUksQ0FBQ0EsTUFBTCxFQUNJOztBQUVKQSxtQkFBT1MsT0FBUCxDQUFlLFVBQUNDLEtBQUQsRUFBVztBQUN0QixvQkFBTUMsT0FBT0QsTUFBTSxDQUFOLENBQWI7QUFDQSxvQkFBTUUsVUFBVUYsTUFBTSxDQUFOLENBQWhCOztBQUVBLHdCQUFRQyxJQUFSO0FBQ0kseUJBQUssWUFBTDtBQUNJLCtCQUFLRSxjQUFMLENBQW9CRCxPQUFwQjtBQUNBO0FBQ0oseUJBQUssUUFBTDtBQUNJLCtCQUFLRSxNQUFMO0FBQ0E7QUFDSix5QkFBSyxZQUFMO0FBQ0ksK0JBQUtDLFVBQUwsQ0FBZ0JILE9BQWhCO0FBQ0E7QUFDSix5QkFBSyxzQkFBTDtBQUNJLCtCQUFLSixZQUFMO0FBQ0E7QUFDSix5QkFBSyxXQUFMO0FBQ0ksK0JBQUt4QixVQUFMLEdBQWtCLElBQWxCO0FBQ0EsK0JBQUtELGFBQUwsQ0FBbUIwQixPQUFuQixDQUEyQixVQUFDTyxHQUFELEVBQVM7QUFDaENwQixvQ0FBUUMsR0FBUixDQUFZLHVCQUFaO0FBQ0EsbUNBQUtvQixXQUFMLENBQWlCRCxHQUFqQjtBQUNILHlCQUhEO0FBSUE7QUFDSix5QkFBSyxlQUFMO0FBQ0UsK0JBQUtFLGFBQUwsQ0FBbUJOLE9BQW5CO0FBQ0E7QUFDRjtBQXZCSjtBQXlCSCxhQTdCRDtBQThCSDs7O29DQUVXO0FBQ1IsaUJBQUtWLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQXhCO0FBQ0g7Ozt1Q0FFY1YsSSxFQUFNO0FBQ2pCLGlCQUFLVSxPQUFMLENBQWEsU0FBYixFQUF3QlYsSUFBeEI7QUFDSDs7O3NDQUVhQSxJLEVBQU07QUFDbEIsaUJBQUtVLE9BQUwsQ0FBYSxlQUFiLEVBQThCVixJQUE5QjtBQUNEOzs7bUNBRVUyQixJLEVBQU0sQ0FBRTs7O2lDQUVWO0FBQ0x2QixvQkFBUUMsR0FBUixDQUFlLEtBQUtGLFFBQXBCOztBQUVBLGlCQUFLTyxPQUFMLENBQWEsUUFBYixFQUF1QixJQUF2QjtBQUNIOzs7b0NBRVdjLEcsRUFBSztBQUNiLGdCQUFJLENBQUMsS0FBS2hDLFVBQVYsRUFBc0I7QUFDbEJZLHdCQUFRQyxHQUFSLENBQVksY0FBWjtBQUNBLHFCQUFLZCxhQUFMLENBQW1CcUMsSUFBbkIsQ0FBd0I1QixJQUF4QjtBQUNIOztBQUVESSxvQkFBUUMsR0FBUixDQUFlLEtBQUtGLFFBQXBCLHNCQUE2Q3FCLEdBQTdDOztBQUVBOUIsa0JBQU0sYUFBTixFQUFxQjtBQUNqQkUsd0JBQVEsTUFEUztBQUVqQmlCLDhCQUFZQyxtQkFBbUIsS0FBS1gsUUFBeEIsQ0FBWixhQUFxRFcsbUJBQW1CVSxHQUFuQixDQUZwQztBQUdqQjNCLHlCQUFTO0FBQ0wsb0NBQWdCO0FBRFg7QUFIUSxhQUFyQixFQU1HQyxJQU5ILENBTVEsVUFBQ0MsUUFBRCxFQUFjLENBQUUsQ0FOeEI7QUFPSDs7O3FDQUVZOztBQUVUSyxvQkFBUUMsR0FBUixDQUFlLEtBQUtGLFFBQXBCOztBQUVBVCxrQkFBTSxlQUFOLEVBQXVCO0FBQ25CRSx3QkFBUSxNQURXO0FBRW5CaUIsOEJBQVlDLG1CQUFtQixLQUFLWCxRQUF4QixDQUZPO0FBR25CTix5QkFBUztBQUNMLG9DQUFnQjtBQURYO0FBSFUsYUFBdkIsRUFNR0MsSUFOSCxDQU1RLFVBQUNDLFFBQUQsRUFBYyxDQUFFLENBTnhCO0FBT0g7Ozt1Q0FFYztBQUNYLGlCQUFLVCxXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsaUJBQUtvQixPQUFMLENBQWEsWUFBYixFQUEyQixJQUEzQjtBQUNIOzs7MkJBRUVTLEksRUFBTVUsRSxFQUFJO0FBQ1QsZ0JBQUksQ0FBQyxLQUFLeEMsU0FBTCxDQUFlOEIsSUFBZixDQUFMLEVBQTJCO0FBQ3ZCLHFCQUFLOUIsU0FBTCxDQUFlOEIsSUFBZixJQUF1QixFQUF2QjtBQUNIO0FBQ0QsaUJBQUs5QixTQUFMLENBQWU4QixJQUFmLEVBQXFCUyxJQUFyQixDQUEwQkMsRUFBMUI7QUFDSDs7O2lDQUVRO0FBQ0wsaUJBQUssSUFBSUMsSUFBSSxFQUFSLEVBQVlDLElBQUksQ0FBckIsRUFBd0IsSUFBSUEsQ0FBNUIsRUFBK0JBLEdBQS9CO0FBQ0ksb0JBQUlDLElBQUlDLEtBQUtDLEtBQUwsQ0FBVyxLQUFLRCxLQUFLRSxNQUFMLEVBQWhCLENBQVI7QUFBQSxvQkFDQUwsSUFBSUEsSUFBSSxtQ0FBbUNNLE1BQW5DLENBQTBDSixDQUExQyxDQURSO0FBREosYUFHQSxPQUFPRixDQUFQO0FBQ0g7OztnQ0FFT1gsSSxFQUFNQyxPLEVBQVM7QUFDbkIsZ0JBQUksS0FBSy9CLFNBQUwsQ0FBZThCLElBQWYsQ0FBSixFQUEwQjtBQUN0QixxQkFBSzlCLFNBQUwsQ0FBZThCLElBQWYsRUFBcUJGLE9BQXJCLENBQTZCLFVBQUNZLEVBQUQsRUFBUTtBQUNqQ0EsdUJBQUdULE9BQUg7QUFDSCxpQkFGRDtBQUdILGFBSkQsTUFJTyxDQUFFO0FBQ1o7Ozs7O2tCQUdVaEMsTSIsImZpbGUiOiJPbWVnbGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3RpbWJyb2RkaW4vU2l0ZXMvb21lZ2xlLW1pdG0iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBPbWVnbGUge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnF1ZXVlTWVzc2FnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5oYXNQYXJ0bmVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXZlbnRUcmllcyA9IDA7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMucXVldWVNZXNzYWdlcyA9IFtdO1xuICAgICAgICB0aGlzLmV2ZW50VHJpZXMgPSAwO1xuXG4gICAgICAgIGZldGNoKGAvcHJveHkvc3RhcnQ/cmNzPTEmZmlyc3RldmVudHM9MSZzcGlkPSZyYW5kaWQ9JHt0aGlzLnJhbmRJZCgpfSZsYW5nPW5sYCwge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZScsXG4gICAgICAgICAgICAgICAgJ1VzZXItYWdlbnQnOiAnTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTJfMCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzU1LjAuMjg4My45NSBTYWZhcmkvNTM3LjM2J1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgfSkudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCk7XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuY2xpZW50SUQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29ubmVjdGVkIHRvIE9tZWdsZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZUV2ZW50cyhyZXNwb25zZS5ldmVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SUQgPSByZXNwb25zZS5jbGllbnRJRDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2xpZW50SWQ6ICR7dGhpcy5jbGllbnRJRH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VydmVyIGRvd24/Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlKCdzZXJ2ZXJEb3duJyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICB9LCAzMDAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEV2ZW50cygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGAke3RoaXMuY2xpZW50SUR9IEdldHRpbmcgZXZlbnRzYCk7XG4gICAgICAgIGZldGNoKCcvcHJveHkvZXZlbnRzJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBgaWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jbGllbnRJRCl9YCxcbiAgICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb24nOiAna2VlcC1hbGl2ZScsXG4gICAgICAgICAgICAgICAgJ1VzZXItYWdlbnQnOiAnTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTJfMCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzU1LjAuMjg4My45NSBTYWZhcmkvNTM3LjM2JyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgfSkudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCk7XG4gICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRXZlbnRzKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5ldmVudFRyaWVzKys7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUcmllczogJHt0aGlzLmV2ZW50VHJpZXN9YCk7XG4gICAgICAgICAgICAgIGlmKHRoaXMuZXZlbnRUcmllcyA+IDUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZCgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBhcnNlRXZlbnRzKGV2ZW50cykge1xuICAgICAgICBpZiAoIWV2ZW50cylcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBldmVudFswXTtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSBldmVudFsxXTtcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZ290TWVzc2FnZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZU1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3R5cGluZyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHlwaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0YXR1c0luZm8nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0luZm8ocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmFuZ2VyRGlzY29ubmVjdGVkJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29ubmVjdGVkJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNQYXJ0bmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWV1ZU1lc3NhZ2VzLmZvckVhY2goKHR4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlbmRpbmcgbWVzc2FnZSBxdWV1ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSh0eHQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2VydmVyTWVzc2FnZSc6XG4gICAgICAgICAgICAgICAgICB0aGlzLnNlcnZlck1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25uZWN0ZWQoKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSgnY29ubmVjdCcsIHRydWUpO1xuICAgIH1cblxuICAgIHJlY2VpdmVNZXNzYWdlKHRleHQpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlKCdtZXNzYWdlJywgdGV4dCk7XG4gICAgfVxuXG4gICAgc2VydmVyTWVzc2FnZSh0ZXh0KSB7XG4gICAgICB0aGlzLm1lc3NhZ2UoJ3NlcnZlck1lc3NhZ2UnLCB0ZXh0KTtcbiAgICB9XG5cbiAgICBzdGF0dXNJbmZvKGluZm8pIHt9XG5cbiAgICB0eXBpbmcoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke3RoaXMuY2xpZW50SUR9IGlzIHR5cGluZ2ApO1xuXG4gICAgICAgIHRoaXMubWVzc2FnZSgndHlwaW5nJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgc2VuZE1lc3NhZ2UodHh0KSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNQYXJ0bmVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQWRkIHRvIHF1ZXVlJyk7XG4gICAgICAgICAgICB0aGlzLnF1ZXVlTWVzc2FnZXMucHVzaCh0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGAke3RoaXMuY2xpZW50SUR9IFNlbmQgbWVzc2FnZSAke3R4dH1gKTtcblxuICAgICAgICBmZXRjaCgnL3Byb3h5L3NlbmQnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IGBpZD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLmNsaWVudElEKX0mbXNnPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHR4dCl9YCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHt9KTtcbiAgICB9XG5cbiAgICBzZW5kVHlwaW5nKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGAke3RoaXMuY2xpZW50SUR9IFNlbmQgdHlwaW5nYCk7XG5cbiAgICAgICAgZmV0Y2goJy9wcm94eS90eXBpbmcnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IGBpZD0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLmNsaWVudElEKX1gLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge30pO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZCgpIHtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1lc3NhZ2UoJ2Rpc2Nvbm5lY3QnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBvbih0eXBlLCBjYikge1xuICAgICAgICBpZiAoIXRoaXMubGlzdGVuZXJzW3R5cGVdKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLnB1c2goY2IpO1xuICAgIH1cblxuICAgIHJhbmRJZCgpIHtcbiAgICAgICAgZm9yICh2YXIgYSA9IFwiXCIsIGIgPSAwOyA4ID4gYjsgYisrKVxuICAgICAgICAgICAgdmFyIGMgPSBNYXRoLmZsb29yKDMyICogTWF0aC5yYW5kb20oKSksXG4gICAgICAgICAgICBhID0gYSArIFwiMjM0NTY3ODlBQkNERUZHSEpLTE1OUFFSU1RVVldYWVpcIi5jaGFyQXQoYyk7XG4gICAgICAgIHJldHVybiBhXG4gICAgfVxuXG4gICAgbWVzc2FnZSh0eXBlLCBwYXlsb2FkKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmVyc1t0eXBlXSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0uZm9yRWFjaCgoY2IpID0+IHtcbiAgICAgICAgICAgICAgICBjYihwYXlsb2FkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge31cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9tZWdsZTtcbiJdfQ==