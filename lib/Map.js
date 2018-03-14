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

  function Map(props) {
    _classCallCheck(this, Map);

    var _this = _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, props));

    _this.props.map.on('load', function () {
      _this.applyMapData();
    });
    return _this;
  }

  _createClass(Map, [{
    key: 'onClick',
    value: function onClick(e) {
      var _this2 = this;

      this.props.on_click(e, e.features[0].geometry.coordinates).then(function (fulfilled) {
        return new _mapboxGl2.default.Popup().setLngLat(e.lngLat).setHTML(fulfilled).addTo(_this2.props.map);
      }).catch(function (error) {
        console.log(error.message);
      });
    }
  }, {
    key: 'setOnClick',
    value: function setOnClick() {
      this.props.map.on('click', 'observations', this.onClick.bind(this));
    }
  }, {
    key: 'applyMapData',
    value: function applyMapData() {
      if (!this.props.map._loaded || !this.props.data || this.props.map.getSource("observations")) return;

      this.props.map.addSource('observations', {
        type: 'geojson',
        data: this.props.data
      });

      this.props.map.addLayer({
        "id": "observations",
        "type": "fill",
        "source": "observations",
        "paint": {
          "fill-color": "#888888",
          "fill-opacity": 0.8
        }
      });

      if (this.props.on_click) this.setOnClick();

      // Create a popup, but don't add it to the map yet.
      var popup = new _mapboxGl2.default.Popup({
        closeButton: false,
        closeOnClick: false
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      this.props.map.on('mousemove', 'observations', function (e) {
        this.getCanvas().style.cursor = 'pointer';
        popup.setLngLat(e.lngLat).setHTML("Count " + e.features[0].properties.doc_count).addTo(this);
      });

      // Change it back to a pointer when it leaves.
      this.props.map.on('mouseleave', 'observations', function () {
        this.getCanvas().style.cursor = '';
        popup.remove();
      });

      this.setFill();
    }
  }, {
    key: 'setFill',
    value: function setFill() {
      if (!this.props.stops || this.props.stops.length === 0) return;

      var source = this.props.map.getSource("observations");
      if (source) source.setData(this.props.data);

      var property = "doc_count";
      if (this.props.map.getLayer("observations")) {
        var stops = this.props.stops;
        this.props.map.setPaintProperty('observations', 'fill-color', {
          property: property,
          stops: stops
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setFill();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.data) this.applyMapData();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_Legend2.default, { stops: this.props.stops, area: this.props.area });
    }
  }]);

  return Map;
}(_react.Component);

exports.default = Map;