'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/react/react.js');

var _react2 = _interopRequireDefault(_react);

var _Omegle = require('../omegle/Omegle');

var _Omegle2 = _interopRequireDefault(_Omegle);

var _head = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/next/dist/lib/head.js');

var _head2 = _interopRequireDefault(_head);

var _Messages = require('../components/Messages');

var _Messages2 = _interopRequireDefault(_Messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OmegleView = function (_Component) {
    (0, _inherits3.default)(OmegleView, _Component);

    function OmegleView(props) {
        (0, _classCallCheck3.default)(this, OmegleView);

        var _this = (0, _possibleConstructorReturn3.default)(this, (OmegleView.__proto__ || (0, _getPrototypeOf2.default)(OmegleView)).call(this, props));

        _this.state = {
            messages: [],
            started: false
        };
        return _this;
    }

    (0, _createClass3.default)(OmegleView, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'start',
        value: function start(e) {
            var _this2 = this;

            e.preventDefault();
            this.setState({ started: true });
            var c1 = new _Omegle2.default();
            var c2 = new _Omegle2.default();

            c1.on('message', function (txt) {
                var m = _this2.state.messages;
                m.push({ type: 'Message', name: 'Person 1', id: c1.clientID, text: txt });
                _this2.setState({ messages: m });
                c2.sendMessage(txt);
            });

            c2.on('message', function (txt) {
                var m = _this2.state.messages;
                m.push({ type: 'Message', name: 'Person 2', id: c2.clientID, text: txt });
                _this2.setState({ messages: m });
                c1.sendMessage(txt);
            });

            c1.on('typing', function () {
                c2.sendTyping();
            });

            c2.on('typing', function () {
                c1.sendTyping();
            });

            c1.on('typing', function () {
                c2.sendTyping();
            });

            c1.on('disconnect', function () {
                var m = _this2.state.messages;
                c1.start();
                c2.start();
                m.push({ type: 'Disconnect' });
            });

            c2.on('disconnect', function () {
                var m = _this2.state.messages;

                c2.start();
                c2.start();
                m.push({ type: 'Disconnect' });
            });

            c1.start();
            c2.start();
        }
    }, {
        key: 'render',
        value: function render() {
            var messages = [];
            var content = void 0;

            if (!this.state.started) {
                content = _react2.default.createElement(
                    'div',
                    { className: 'start' },
                    _react2.default.createElement(
                        'a',
                        { href: '#', className: 'startBtn', onClick: this.start.bind(this) },
                        'Start'
                    )
                );
            } else {

                content = _react2.default.createElement(_Messages2.default, { messages: this.state.messages });
            }

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _head2.default,
                    null,
                    _react2.default.createElement(
                        'style',
                        null,
                        '\n                body {\n                  font-family: Verdana;\n                }\n\n                .start {\n                  width: 100vw;\n                  height: 100vh;\n                  display: flex;\n                  justify-content: space-around;\n                  align-items: center;\n                }\n\n                .startBtn {\n                  text-decoration: none;\n                  padding: 30px;\n                  color: white;\n                  background-color: #ed2d23;\n                  border-radius: 15px;\n                  font-size: 56px;\n                }\n\n                .messages {\n                  width: 100vw;\n                  height: 100vh;\n                  overflow: auto;\n                }\n\n                .message {\n                  display: flex;\n                  margin-bottom: 3px;\n                  align-items: center;\n                }\n                .nickName {\n                  color: "#EFEFEF";\n                  margin-right: 30px;\n                  font-size: 11px;\n                }\n              '
                    )
                ),
                content
            );
        }
    }]);
    return OmegleView;
}(_react.Component);

exports.default = OmegleView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzL2luZGV4LmpzP2VudHJ5Il0sIm5hbWVzIjpbIk9tZWdsZVZpZXciLCJwcm9wcyIsInN0YXRlIiwibWVzc2FnZXMiLCJzdGFydGVkIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic2V0U3RhdGUiLCJjMSIsImMyIiwib24iLCJ0eHQiLCJtIiwicHVzaCIsInR5cGUiLCJuYW1lIiwiaWQiLCJjbGllbnRJRCIsInRleHQiLCJzZW5kTWVzc2FnZSIsInNlbmRUeXBpbmciLCJzdGFydCIsImNvbnRlbnQiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFTUEsVTs7O0FBQ0Ysd0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxrSkFDVEEsS0FEUzs7QUFHZixjQUFLQyxLQUFMLEdBQWE7QUFDVEMsc0JBQVUsRUFERDtBQUVUQyxxQkFBUztBQUZBLFNBQWI7QUFIZTtBQU9sQjs7Ozs0Q0FFbUIsQ0FBRTs7OzhCQUVoQkMsQyxFQUFHO0FBQUE7O0FBQ0xBLGNBQUVDLGNBQUY7QUFDQSxpQkFBS0MsUUFBTCxDQUFjLEVBQUNILFNBQVMsSUFBVixFQUFkO0FBQ0EsZ0JBQUlJLEtBQUssc0JBQVQ7QUFDQSxnQkFBSUMsS0FBSyxzQkFBVDs7QUFFQUQsZUFBR0UsRUFBSCxDQUFNLFNBQU4sRUFBaUIsVUFBQ0MsR0FBRCxFQUFTO0FBQ3RCLG9CQUFJQyxJQUFJLE9BQUtWLEtBQUwsQ0FBV0MsUUFBbkI7QUFDQVMsa0JBQUVDLElBQUYsQ0FBTyxFQUFDQyxNQUFNLFNBQVAsRUFBa0JDLE1BQU0sVUFBeEIsRUFBb0NDLElBQUlSLEdBQUdTLFFBQTNDLEVBQXFEQyxNQUFNUCxHQUEzRCxFQUFQO0FBQ0EsdUJBQUtKLFFBQUwsQ0FBYyxFQUFDSixVQUFVUyxDQUFYLEVBQWQ7QUFDQUgsbUJBQUdVLFdBQUgsQ0FBZVIsR0FBZjtBQUNILGFBTEQ7O0FBT0FGLGVBQUdDLEVBQUgsQ0FBTSxTQUFOLEVBQWlCLFVBQUNDLEdBQUQsRUFBUztBQUN0QixvQkFBSUMsSUFBSSxPQUFLVixLQUFMLENBQVdDLFFBQW5CO0FBQ0FTLGtCQUFFQyxJQUFGLENBQU8sRUFBQ0MsTUFBTSxTQUFQLEVBQWtCQyxNQUFNLFVBQXhCLEVBQW9DQyxJQUFJUCxHQUFHUSxRQUEzQyxFQUFxREMsTUFBTVAsR0FBM0QsRUFBUDtBQUNBLHVCQUFLSixRQUFMLENBQWMsRUFBQ0osVUFBVVMsQ0FBWCxFQUFkO0FBQ0FKLG1CQUFHVyxXQUFILENBQWVSLEdBQWY7QUFDSCxhQUxEOztBQU9BSCxlQUFHRSxFQUFILENBQU0sUUFBTixFQUFnQixZQUFNO0FBQ2xCRCxtQkFBR1csVUFBSDtBQUNILGFBRkQ7O0FBSUFYLGVBQUdDLEVBQUgsQ0FBTSxRQUFOLEVBQWdCLFlBQU07QUFDbEJGLG1CQUFHWSxVQUFIO0FBQ0gsYUFGRDs7QUFJQVosZUFBR0UsRUFBSCxDQUFNLFFBQU4sRUFBZ0IsWUFBTTtBQUNsQkQsbUJBQUdXLFVBQUg7QUFDSCxhQUZEOztBQUlBWixlQUFHRSxFQUFILENBQU0sWUFBTixFQUFvQixZQUFNO0FBQ3RCLG9CQUFJRSxJQUFJLE9BQUtWLEtBQUwsQ0FBV0MsUUFBbkI7QUFDQUssbUJBQUdhLEtBQUg7QUFDQVosbUJBQUdZLEtBQUg7QUFDQVQsa0JBQUVDLElBQUYsQ0FBTyxFQUFDQyxNQUFNLFlBQVAsRUFBUDtBQUNILGFBTEQ7O0FBT0FMLGVBQUdDLEVBQUgsQ0FBTSxZQUFOLEVBQW9CLFlBQU07QUFDdEIsb0JBQUlFLElBQUksT0FBS1YsS0FBTCxDQUFXQyxRQUFuQjs7QUFFQU0sbUJBQUdZLEtBQUg7QUFDQVosbUJBQUdZLEtBQUg7QUFDQVQsa0JBQUVDLElBQUYsQ0FBTyxFQUFDQyxNQUFNLFlBQVAsRUFBUDtBQUVILGFBUEQ7O0FBU0FOLGVBQUdhLEtBQUg7QUFDQVosZUFBR1ksS0FBSDtBQUVIOzs7aUNBRVE7QUFDTCxnQkFBSWxCLFdBQVcsRUFBZjtBQUNBLGdCQUFJbUIsZ0JBQUo7O0FBRUEsZ0JBQUksQ0FBQyxLQUFLcEIsS0FBTCxDQUFXRSxPQUFoQixFQUF5QjtBQUNyQmtCLDBCQUFVO0FBQUE7QUFBQSxzQkFBSyxXQUFVLE9BQWY7QUFDTjtBQUFBO0FBQUEsMEJBQUcsTUFBSyxHQUFSLEVBQVksV0FBVSxVQUF0QixFQUFpQyxTQUFTLEtBQUtELEtBQUwsQ0FBV0UsSUFBWCxDQUFnQixJQUFoQixDQUExQztBQUFBO0FBQUE7QUFETSxpQkFBVjtBQUdILGFBSkQsTUFJTzs7QUFFSEQsMEJBQVUsb0RBQVUsVUFBVSxLQUFLcEIsS0FBTCxDQUFXQyxRQUEvQixHQUFWO0FBQ0g7O0FBRUQsbUJBQU87QUFBQTtBQUFBO0FBQ0w7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGLGlCQURLO0FBMENKbUI7QUExQ0ksYUFBUDtBQTZDSDs7Ozs7a0JBR1V0QixVIiwiZmlsZSI6ImluZGV4LmpzP2VudHJ5Iiwic291cmNlUm9vdCI6Ii9Vc2Vycy90aW1icm9kZGluL1NpdGVzL29tZWdsZS1taXRtIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCdcbmltcG9ydCBPbWVnbGUgZnJvbSAnLi4vb21lZ2xlL09tZWdsZSc7XG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IE1lc3NhZ2VzIGZyb20gJy4uL2NvbXBvbmVudHMvTWVzc2FnZXMnO1xuXG5jbGFzcyBPbWVnbGVWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBbXSxcbiAgICAgICAgICAgIHN0YXJ0ZWQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHt9XG5cbiAgICBzdGFydChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhcnRlZDogdHJ1ZX0pO1xuICAgICAgICBsZXQgYzEgPSBuZXcgT21lZ2xlKCk7XG4gICAgICAgIGxldCBjMiA9IG5ldyBPbWVnbGUoKTtcblxuICAgICAgICBjMS5vbignbWVzc2FnZScsICh0eHQpID0+IHtcbiAgICAgICAgICAgIGxldCBtID0gdGhpcy5zdGF0ZS5tZXNzYWdlcztcbiAgICAgICAgICAgIG0ucHVzaCh7dHlwZTogJ01lc3NhZ2UnLCBuYW1lOiAnUGVyc29uIDEnLCBpZDogYzEuY2xpZW50SUQsIHRleHQ6IHR4dH0pO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWVzc2FnZXM6IG19KTtcbiAgICAgICAgICAgIGMyLnNlbmRNZXNzYWdlKHR4dCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGMyLm9uKCdtZXNzYWdlJywgKHR4dCkgPT4ge1xuICAgICAgICAgICAgbGV0IG0gPSB0aGlzLnN0YXRlLm1lc3NhZ2VzO1xuICAgICAgICAgICAgbS5wdXNoKHt0eXBlOiAnTWVzc2FnZScsIG5hbWU6ICdQZXJzb24gMicsIGlkOiBjMi5jbGllbnRJRCwgdGV4dDogdHh0fSk7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHttZXNzYWdlczogbX0pO1xuICAgICAgICAgICAgYzEuc2VuZE1lc3NhZ2UodHh0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYzEub24oJ3R5cGluZycsICgpID0+IHtcbiAgICAgICAgICAgIGMyLnNlbmRUeXBpbmcoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYzIub24oJ3R5cGluZycsICgpID0+IHtcbiAgICAgICAgICAgIGMxLnNlbmRUeXBpbmcoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYzEub24oJ3R5cGluZycsICgpID0+IHtcbiAgICAgICAgICAgIGMyLnNlbmRUeXBpbmcoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYzEub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbSA9IHRoaXMuc3RhdGUubWVzc2FnZXM7XG4gICAgICAgICAgICBjMS5zdGFydCgpO1xuICAgICAgICAgICAgYzIuc3RhcnQoKTtcbiAgICAgICAgICAgIG0ucHVzaCh7dHlwZTogJ0Rpc2Nvbm5lY3QnfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYzIub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbSA9IHRoaXMuc3RhdGUubWVzc2FnZXM7XG5cbiAgICAgICAgICAgIGMyLnN0YXJ0KCk7XG4gICAgICAgICAgICBjMi5zdGFydCgpO1xuICAgICAgICAgICAgbS5wdXNoKHt0eXBlOiAnRGlzY29ubmVjdCd9KVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGMxLnN0YXJ0KCk7XG4gICAgICAgIGMyLnN0YXJ0KCk7XG5cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBsZXQgY29udGVudDtcblxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc3RhcnRlZCkge1xuICAgICAgICAgICAgY29udGVudCA9IDxkaXYgY2xhc3NOYW1lPVwic3RhcnRcIj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzTmFtZT1cInN0YXJ0QnRuXCIgb25DbGljaz17dGhpcy5zdGFydC5iaW5kKHRoaXMpfT5TdGFydDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjb250ZW50ID0gPE1lc3NhZ2VzIG1lc3NhZ2VzPXt0aGlzLnN0YXRlLm1lc3NhZ2VzfSAvPlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDxkaXY+XG4gICAgICAgICAgPEhlYWQ+XG4gICAgICAgICAgICA8c3R5bGU+e2BcbiAgICAgICAgICAgICAgICBib2R5IHtcbiAgICAgICAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBWZXJkYW5hO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5zdGFydCB7XG4gICAgICAgICAgICAgICAgICB3aWR0aDogMTAwdnc7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICAgICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAuc3RhcnRCdG4ge1xuICAgICAgICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICAgICAgICAgICAgcGFkZGluZzogMzBweDtcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlZDJkMjM7XG4gICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNXB4O1xuICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiA1NnB4O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5tZXNzYWdlcyB7XG4gICAgICAgICAgICAgICAgICB3aWR0aDogMTAwdnc7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLm1lc3NhZ2Uge1xuICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDNweDtcbiAgICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC5uaWNrTmFtZSB7XG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCIjRUZFRkVGXCI7XG4gICAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDMwcHg7XG4gICAgICAgICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBgfTwvc3R5bGU+XG4gICAgICAgICAgPC9IZWFkPlxuICAgICAgICAgIHtjb250ZW50fVxuICAgICAgICA8L2Rpdj47XG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9tZWdsZVZpZXc7XG4iXX0=