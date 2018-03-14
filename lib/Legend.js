'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Legend = function (_Component) {
  _inherits(Legend, _Component);

  function Legend(props) {
    _classCallCheck(this, Legend);

    var _this = _possibleConstructorReturn(this, (Legend.__proto__ || Object.getPrototypeOf(Legend)).call(this, props));

    _this.state = {
      showLegend: true
    };
    return _this;
  }

  _createClass(Legend, [{
    key: 'toggleShowLegend',
    value: function toggleShowLegend() {
      this.setState({
        showLegend: !this.state.showLegend
      });
    }
  }, {
    key: 'render',
    value: function render() {

      var renderLegendKeys = function renderLegendKeys(stops) {
        var html = [];
        for (var i = 0; i < stops.length; i++) {
          var stop = stops[i];
          var stopStr = i < stops.length - 1 ? _react2.default.createElement(
            'span',
            null,
            stop[0] + ' - ' + (stops[i + 1][0] - 1)
          ) : _react2.default.createElement(
            'span',
            null,
            stop[0] + ' - '
          );
          html.push(_react2.default.createElement(
            'div',
            { key: i, className: 'txt-s' },
            _react2.default.createElement('span', { className: 'legend-key', style: { backgroundColor: stop[1] } }),
            stopStr
          ));
        }
        return html;
      };

      return _react2.default.createElement(
        'div',
        { className: 'main-container' },
        this.state.showLegend && _react2.default.createElement(
          'div',
          { className: 'main' },
          _react2.default.createElement(
            'div',
            { className: 'mb6' },
            _react2.default.createElement(
              'h2',
              { className: 'txt-bold txt-s block' },
              'Legend',
              _react2.default.createElement('i', { className: 'fa fa-close pull-right', onClick: this.toggleShowLegend.bind(this), style: { cursor: 'pointer' } })
            ),
            _react2.default.createElement(
              'p',
              { className: 'txt-s color-gray' },
              '1 square = ',
              this.props.area
            )
          ),
          renderLegendKeys(this.props.stops)
        ),
        !this.state.showLegend && _react2.default.createElement(
          'div',
          { className: 'main', onClick: this.toggleShowLegend.bind(this), style: { cursor: 'pointer' } },
          _react2.default.createElement('i', { className: 'fa fa-align-justify' })
        )
      );
    }
  }]);

  return Legend;
}(_react.Component);

exports.default = Legend;