'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Legend = require('./Legend');

var _Legend2 = _interopRequireDefault(_Legend);

var _mapboxGl = require('mapbox-gl');

var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_mapboxGl2.default.accessToken = 'undefined';

var Map = function (_Component) {
  _inherits(Map, _Component);

  function Map() {
    _classCallCheck(this, Map);

    return _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).apply(this, arguments));
  }

  _createClass(Map, [{
    key: 'ApplyMapData',
    value: function ApplyMapData() {
      var _this2 = this;

      this.props.map.on('load', function () {
        _this2.props.map.addSource('observations', {
          type: 'geojson',
          data: _this2.props.data.geojson
        });

        _this2.props.map.addLayer({
          "id": "observations",
          "type": "fill",
          "source": "observations",
          "paint": {
            "fill-color": "#888888",
            "fill-opacity": 0.8
          }
        });

        _this2.props.map.on('click', 'observations', function (e) {
          new _mapboxGl2.default.Popup().setLngLat(e.lngLat).setHTML("Count " + e.features[0].properties.doc_count).addTo(this);
        });

        // Create a popup, but don't add it to the map yet.
        var popup = new _mapboxGl2.default.Popup({
          closeButton: false,
          closeOnClick: false
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        _this2.props.map.on('mouseenter', 'observations', function (e) {
          this.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(e.lngLat).setHTML("Count " + e.features[0].properties.doc_count).addTo(this);
        });

        // Change it back to a pointer when it leaves.
        _this2.props.map.on('mouseleave', 'observations', function () {
          this.getCanvas().style.cursor = '';
          popup.remove();
        });

        _this2.setFill();
      });
    }
  }, {
    key: 'setFill',
    value: function setFill() {
      var _this3 = this;

      var source = this.props.map.getSource("observations");
      if (source) source.setData(this.props.data.geojson);

      var property = "doc_count";
      var stops = this.props.stops;
      if (stops.length > 0) this.props.map.on('load', function () {
        _this3.props.map.setPaintProperty('observations', 'fill-color', {
          property: property,
          stops: stops
        });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.ApplyMapData();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setFill();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_Legend2.default, { stops: this.props.stops });
    }
  }]);

  return Map;
}(_react.Component);

exports.default = Map;