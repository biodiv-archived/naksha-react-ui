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

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

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
    key: 'getHtml',
    value: function getHtml(documents) {

      var getSingleHtml = function getSingleHtml(document) {
        document = JSON.parse(document);

        var getUrl = function getUrl(document) {
          return "http://indiabiodiversity.org/observation/show/" + document.id + "?pos=";
        };

        return "<a target='_blank' href='" + getUrl(document) + "'>" + document.name + "</a>";
      };

      var html = "<div style='max-height:150px;overflow:auto;text-align:left;'>";
      for (var i = 0; i < documents.length; i++) {
        html += "<span>" + getSingleHtml(documents[i].document) + "</span><br>";
      }
      html += "</div>";

      return html;
    }
  }, {
    key: 'getPopup',
    value: function getPopup(e, coordinates) {
      var _this2 = this;

      var top = Math.max(coordinates[0][0][1], coordinates[0][1][1], coordinates[0][2][1]);
      var bottom = Math.min(coordinates[0][0][1], coordinates[0][1][1], coordinates[0][2][1]);
      var left = Math.min(coordinates[0][0][0], coordinates[0][1][0], coordinates[0][2][0]);
      var right = Math.max(coordinates[0][0][0], coordinates[0][1][0], coordinates[0][2][0]);
      _axios2.default.get(this.props.data_url, {
        params: {
          geoField: this.props.location_field,
          top: top,
          bottom: bottom,
          right: right,
          left: left
        }
      }).then(function (_ref) {
        var data = _ref.data;

        var html = _this2.getHtml(data.documents);

        return new _mapboxGl2.default.Popup().setLngLat(e.lngLat).setHTML(html).addTo(_this2.props.map);
      }).catch(function (err) {
        console.log('error ' + err);
      });
    }
  }, {
    key: 'onClick',
    value: function onClick(e) {

      this.getPopup(e, e.features[0].geometry.coordinates);
    }
  }, {
    key: 'setOnClick',
    value: function setOnClick() {

      this.props.map.on('click', 'observations', this.onClick.bind(this));
    }
  }, {
    key: 'applyMapData',
    value: function applyMapData() {
      var _this3 = this;

      this.props.map.on('load', function () {
        _this3.props.map.addSource('observations', {
          type: 'geojson',
          data: _this3.props.data.geojson
        });

        _this3.props.map.addLayer({
          "id": "observations",
          "type": "fill",
          "source": "observations",
          "paint": {
            "fill-color": "#888888",
            "fill-opacity": 0.8
          }
        });

        _this3.setOnClick();

        // Create a popup, but don't add it to the map yet.
        var popup = new _mapboxGl2.default.Popup({
          closeButton: false,
          closeOnClick: true
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        _this3.props.map.on('mousemove', 'observations', function (e) {
          this.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(e.lngLat).setHTML("Count " + e.features[0].properties.doc_count).addTo(this);
        });

        // Change it back to a pointer when it leaves.
        _this3.props.map.on('mouseleave', 'observations', function () {
          this.getCanvas().style.cursor = '';
          popup.remove();
        });

        _this3.setFill();
      });
    }
  }, {
    key: 'setFill',
    value: function setFill() {
      var _this4 = this;

      var source = this.props.map.getSource("observations");
      if (source) source.setData(this.props.data.geojson);

      var property = "doc_count";
      var stops = this.props.stops;
      if (stops.length > 0) this.props.map.on('load', function () {
        _this4.props.map.setPaintProperty('observations', 'fill-color', {
          property: property,
          stops: stops
        });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.applyMapData();
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