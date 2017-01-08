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

var _style = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/styled-jsx/style.js');

var _style2 = _interopRequireDefault(_style);

var _react = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/react/react.js');

var _react2 = _interopRequireDefault(_react);

var _head = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/next/dist/lib/head.js');

var _head2 = _interopRequireDefault(_head);

var _ansiHtml = require('/Users/timbroddin/Sites/omegle-mitm/node_modules/ansi-html/index.js');

var _ansiHtml2 = _interopRequireDefault(_ansiHtml);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var ErrorDebug = function (_React$Component) {
  (0, _inherits3.default)(ErrorDebug, _React$Component);

  function ErrorDebug() {
    (0, _classCallCheck3.default)(this, ErrorDebug);
    return (0, _possibleConstructorReturn3.default)(this, (ErrorDebug.__proto__ || (0, _getPrototypeOf2.default)(ErrorDebug)).apply(this, arguments));
  }

  (0, _createClass3.default)(ErrorDebug, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          name = _props.name,
          message = _props.message,
          stack = _props.stack,
          path = _props.path;

      return _react2.default.createElement('div', { className: 'errorDebug', 'data-jsx': 1455198374
      }, _react2.default.createElement(_head2.default, null, _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0', 'data-jsx': 1455198374
      })), path ? _react2.default.createElement('div', { className: 'heading', 'data-jsx': 1455198374
      }, 'Error in ', path) : null, name === 'ModuleBuildError' ? _react2.default.createElement('pre', { className: 'message', dangerouslySetInnerHTML: { __html: (0, _ansiHtml2.default)(encodeHtml(message)) }, 'data-jsx': 1455198374
      }) : _react2.default.createElement('pre', { className: 'message', 'data-jsx': 1455198374
      }, stack), _react2.default.createElement(_style2.default, {
        styleId: 1579730202,
        css: '\n        body {\n          background: #a6004c;\n          margin: 0;\n        }\n      '
      }), _react2.default.createElement(_style2.default, {
        styleId: 3076811513,
        css: '.errorDebug[data-jsx="1455198374"] {height: 100%;padding: 16px;box-sizing: border-box;}.message[data-jsx="1455198374"] {font-family: "SF Mono", "Roboto Mono", "Fira Mono", menlo-regular, monospace;font-size: 10px;color: #fbe7f1;margin: 0;white-space: pre-wrap;word-wrap: break-word;}.heading[data-jsx="1455198374"] {font-family: -apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif;font-size: 13px;font-weight: bold;color: #ff84bf;margin-bottom: 20pxl        }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvcGFnZXMvX2Vycm9yLWRlYnVnLmpzP2VudHJ5Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTZCa0IsQUFDRyxvQ0FDRSxhQUNDLGNBQ1MsdUJBQ3hCLENBRVMsaUNBQ3FFLDZFQUM3RCxnQkFDRCxlQUNMLFVBQ1ksc0JBQ0Esc0JBQ3ZCLENBRVMsaUNBQytILHVJQUN2SCxnQkFDRSxrQkFDSCxlQUVoQiIsImZpbGUiOiJub2RlX21vZHVsZXMvbmV4dC9kaXN0L3BhZ2VzL19lcnJvci1kZWJ1Zy5qcz9lbnRyeSIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdGltYnJvZGRpbi9TaXRlcy9vbWVnbGUtbWl0bSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBIZWFkIGZyb20gJ25leHQvaGVhZCdcbmltcG9ydCBhbnNpSFRNTCBmcm9tICdhbnNpLWh0bWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVycm9yRGVidWcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgZ2V0SW5pdGlhbFByb3BzICh7IGVyciB9KSB7XG4gICAgY29uc3QgeyBuYW1lLCBtZXNzYWdlLCBzdGFjaywgbW9kdWxlIH0gPSBlcnJcbiAgICByZXR1cm4geyBuYW1lLCBtZXNzYWdlLCBzdGFjaywgcGF0aDogbW9kdWxlID8gbW9kdWxlLnJhd1JlcXVlc3QgOiBudWxsIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBuYW1lLCBtZXNzYWdlLCBzdGFjaywgcGF0aCB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdlcnJvckRlYnVnJz5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8bWV0YSBuYW1lPSd2aWV3cG9ydCcgY29udGVudD0nd2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCcgLz5cbiAgICAgIDwvSGVhZD5cbiAgICAgIHtwYXRoID8gPGRpdiBjbGFzc05hbWU9J2hlYWRpbmcnPkVycm9yIGluIHtwYXRofTwvZGl2PiA6IG51bGx9XG4gICAgICB7XG4gICAgICAgIG5hbWUgPT09ICdNb2R1bGVCdWlsZEVycm9yJ1xuICAgICAgICA/IDxwcmUgY2xhc3NOYW1lPSdtZXNzYWdlJyBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IGFuc2lIVE1MKGVuY29kZUh0bWwobWVzc2FnZSkpIH19IC8+XG4gICAgICAgIDogPHByZSBjbGFzc05hbWU9J21lc3NhZ2UnPntzdGFja308L3ByZT5cbiAgICAgIH1cbiAgICAgIDxzdHlsZSBqc3ggZ2xvYmFsPntgXG4gICAgICAgIGJvZHkge1xuICAgICAgICAgIGJhY2tncm91bmQ6ICNhNjAwNGM7XG4gICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICB9XG4gICAgICBgfTwvc3R5bGU+XG4gICAgICA8c3R5bGUganN4PntgXG4gICAgICAgIC5lcnJvckRlYnVnIHtcbiAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgcGFkZGluZzogMTZweDtcbiAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICB9XG5cbiAgICAgICAgLm1lc3NhZ2Uge1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlNGIE1vbm9cIiwgXCJSb2JvdG8gTW9ub1wiLCBcIkZpcmEgTW9ub1wiLCBtZW5sby1yZWd1bGFyLCBtb25vc3BhY2U7XG4gICAgICAgICAgZm9udC1zaXplOiAxMHB4O1xuICAgICAgICAgIGNvbG9yOiAjZmJlN2YxO1xuICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG4gICAgICAgICAgd29yZC13cmFwOiBicmVhay13b3JkO1xuICAgICAgICB9XG5cbiAgICAgICAgLmhlYWRpbmcge1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFJvYm90bywgXCJTZWdvZSBVSVwiLCBcIkZpcmEgU2Fuc1wiLCBBdmVuaXIsIFwiSGVsdmV0aWNhIE5ldWVcIiwgXCJMdWNpZGEgR3JhbmRlXCIsIHNhbnMtc2VyaWY7XG4gICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICAgIGNvbG9yOiAjZmY4NGJmO1xuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHhsXG4gICAgICAgIH1cbiAgICAgIGB9PC9zdHlsZT5cbiAgICA8L2Rpdj5cbiAgfVxufVxuXG5jb25zdCBlbmNvZGVIdG1sID0gc3RyID0+IHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpXG59XG5cbi8vIHNlZSBjb2xvciBkZWZpbml0aW9ucyBvZiBiYWJlbC1jb2RlLWZyYW1lOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL2JhYmVsLWNvZGUtZnJhbWUvc3JjL2luZGV4LmpzXG5cbmFuc2lIVE1MLnNldENvbG9ycyh7XG4gIHJlc2V0OiBbJ2ZmZicsICdhNjAwNGMnXSxcbiAgZGFya2dyZXk6ICdlNTQ1OTAnLFxuICB5ZWxsb3c6ICdlZThjYmInLFxuICBncmVlbjogJ2YyYTJjNycsXG4gIG1hZ2VudGE6ICdmYmU3ZjEnLFxuICBibHVlOiAnZmZmJyxcbiAgY3lhbjogJ2VmOGJiOScsXG4gIHJlZDogJ2ZmZidcbn0pXG4iXX0= */\n/*@ sourceURL=node_modules/next/dist/pages/_error-debug.js?entry */'
      }));
    }
  }], [{
    key: 'getInitialProps',
    value: function getInitialProps(_ref) {
      var err = _ref.err;
      var name = err.name,
          message = err.message,
          stack = err.stack,
          module = err.module;

      return { name: name, message: message, stack: stack, path: module ? module.rawRequest : null };
    }
  }]);
  return ErrorDebug;
}(_react2.default.Component);

exports.default = ErrorDebug;

var encodeHtml = function encodeHtml(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// see color definitions of babel-code-frame:
// https://github.com/babel/babel/blob/master/packages/babel-code-frame/src/index.js

_ansiHtml2.default.setColors({
  reset: ['fff', 'a6004c'],
  darkgrey: 'e54590',
  yellow: 'ee8cbb',
  green: 'f2a2c7',
  magenta: 'fbe7f1',
  blue: 'fff',
  cyan: 'ef8bb9',
  red: 'fff'
});