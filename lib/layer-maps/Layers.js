'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('../css/layers.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styling = require('./styling');
var toggleSideBar = styling.default.toggleSideBar;
var toggleFeaturesSideBar = styling.default.toggleFeaturesSideBar;
var openTab = styling.default.openTab;
var initMap = styling.default.initMap;

var Layers = function (_Component) {
  _inherits(Layers, _Component);

  function Layers() {
    _classCallCheck(this, Layers);

    return _possibleConstructorReturn(this, (Layers.__proto__ || Object.getPrototypeOf(Layers)).apply(this, arguments));
  }

  _createClass(Layers, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      initMap();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: { height: '90vh', overflowX: 'hidden' } },
        _react2.default.createElement('div', { className: 'map', id: 'map' }),
        _react2.default.createElement(
          'div',
          { id: 'nav', className: 'left-nav border-inside fill-height' },
          _react2.default.createElement(
            'div',
            { className: 'nav-content' },
            _react2.default.createElement(
              'div',
              { className: 'tab' },
              _react2.default.createElement(
                'button',
                { className: 'tablinks active', onClick: function onClick(e) {
                    return openTab(e, "nav-all-layers");
                  } },
                'All Layers'
              ),
              _react2.default.createElement(
                'button',
                { className: 'tablinks', onClick: function onClick(e) {
                    return openTab(e, "nav-selected-layers");
                  } },
                'Selected Layers'
              )
            ),
            _react2.default.createElement('div', { id: 'nav-all-layers', className: 'tabcontent' }),
            _react2.default.createElement('div', { id: 'nav-selected-layers', className: 'tabcontent hide' })
          ),
          _react2.default.createElement(
            'button',
            { className: 'hamburger hamburger--arrow is-active', type: 'button', onClick: function onClick() {
                return toggleSideBar();
              } },
            _react2.default.createElement(
              'div',
              { className: 'hamburger-box' },
              _react2.default.createElement('div', { className: 'hamburger-inner' })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { id: 'features-nav', className: 'features-nav features-nav--active border-inside fill-height' },
          _react2.default.createElement(
            'button',
            { className: 'hamburger hamburger--arrow-r', type: 'button', onClick: function onClick() {
                return toggleFeaturesSideBar();
              } },
            _react2.default.createElement(
              'div',
              { className: 'hamburger-box' },
              _react2.default.createElement('div', { className: 'hamburger-inner' })
            )
          ),
          _react2.default.createElement('div', { id: 'features' })
        )
      );
    }
  }]);

  return Layers;
}(_react.Component);

exports.default = Layers;