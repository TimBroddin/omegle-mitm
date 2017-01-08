"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require("/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("/Users/timbroddin/Sites/omegle-mitm/node_modules/babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("/Users/timbroddin/Sites/omegle-mitm/node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Messages = function (_Component) {
    (0, _inherits3.default)(Messages, _Component);

    function Messages() {
        (0, _classCallCheck3.default)(this, Messages);
        return (0, _possibleConstructorReturn3.default)(this, (Messages.__proto__ || (0, _getPrototypeOf2.default)(Messages)).apply(this, arguments));
    }

    (0, _createClass3.default)(Messages, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
        }
    }, {
        key: "render",
        value: function render() {
            var messages = this.props.messages;


            return _react2.default.createElement(
                "div",
                { className: "messages", ref: "messages" },
                messages.map(function (message, k) {
                    if (message.type == 'Message') {
                        return _react2.default.createElement(
                            "div",
                            { className: "message", key: "message-" + k },
                            _react2.default.createElement(
                                "span",
                                { className: "nickName" },
                                message.name
                            ),
                            _react2.default.createElement(
                                "span",
                                { className: "message" },
                                message.text
                            )
                        );
                    } else {
                        return _react2.default.createElement("hr", { key: "message-" + k });
                    }
                })
            );
        }
    }]);
    return Messages;
}(_react.Component);

exports.default = Messages;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvTWVzc2FnZXMuanMiXSwibmFtZXMiOlsiTWVzc2FnZXMiLCJyZWZzIiwibWVzc2FnZXMiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJwcm9wcyIsIm1hcCIsIm1lc3NhZ2UiLCJrIiwidHlwZSIsIm5hbWUiLCJ0ZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7SUFFTUEsUTs7Ozs7Ozs7Ozs2Q0FDaUI7QUFDbkIsaUJBQUtDLElBQUwsQ0FBVUMsUUFBVixDQUFtQkMsU0FBbkIsR0FBK0IsS0FBS0YsSUFBTCxDQUFVQyxRQUFWLENBQW1CRSxZQUFsRDtBQUNEOzs7aUNBRVE7QUFBQSxnQkFDQUYsUUFEQSxHQUNZLEtBQUtHLEtBRGpCLENBQ0FILFFBREE7OztBQUdQLG1CQUFPO0FBQUE7QUFBQSxrQkFBSyxXQUFVLFVBQWYsRUFBMEIsS0FBSSxVQUE5QjtBQUNGQSx5QkFBU0ksR0FBVCxDQUFhLFVBQUNDLE9BQUQsRUFBVUMsQ0FBVixFQUFnQjtBQUMxQix3QkFBSUQsUUFBUUUsSUFBUixJQUFnQixTQUFwQixFQUErQjtBQUMzQiwrQkFBTztBQUFBO0FBQUEsOEJBQUssV0FBVSxTQUFmLEVBQXlCLGtCQUFnQkQsQ0FBekM7QUFDSDtBQUFBO0FBQUEsa0NBQU0sV0FBVSxVQUFoQjtBQUE0QkQsd0NBQVFHO0FBQXBDLDZCQURHO0FBRUg7QUFBQTtBQUFBLGtDQUFNLFdBQVUsU0FBaEI7QUFBMkJILHdDQUFRSTtBQUFuQztBQUZHLHlCQUFQO0FBSUgscUJBTEQsTUFLTztBQUNILCtCQUFPLHNDQUFJLGtCQUFnQkgsQ0FBcEIsR0FBUDtBQUNIO0FBQ0osaUJBVEE7QUFERSxhQUFQO0FBWUQ7Ozs7O2tCQUlZUixRIiwiZmlsZSI6Ik1lc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy90aW1icm9kZGluL1NpdGVzL29tZWdsZS1taXRtIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIE1lc3NhZ2VzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMucmVmcy5tZXNzYWdlcy5zY3JvbGxUb3AgPSB0aGlzLnJlZnMubWVzc2FnZXMuc2Nyb2xsSGVpZ2h0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttZXNzYWdlc30gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwibWVzc2FnZXNcIiByZWY9XCJtZXNzYWdlc1wiPlxuICAgICAgICB7bWVzc2FnZXMubWFwKChtZXNzYWdlLCBrKSA9PiB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS50eXBlID09ICdNZXNzYWdlJykge1xuICAgICAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm1lc3NhZ2VcIiBrZXk9e2BtZXNzYWdlLSR7a31gfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibmlja05hbWVcIj57bWVzc2FnZS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWVzc2FnZVwiPnttZXNzYWdlLnRleHR9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gPGhyIGtleT17YG1lc3NhZ2UtJHtrfWB9Lz5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSl9XG4gICAgPC9kaXY+XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBNZXNzYWdlcztcbiJdfQ==