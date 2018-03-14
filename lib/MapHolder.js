'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MapData = require('./MapData');

var _MapData2 = _interopRequireDefault(_MapData);

var _mapboxGl = require('mapbox-gl');

var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

var _style = require('./css/style.json');

var _style2 = _interopRequireDefault(_style);

var _BackgroundControl = require('./common/BackgroundControl');

var _BackgroundControl2 = _interopRequireDefault(_BackgroundControl);

var _config = require('./common/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_mapboxGl2.default.accessToken = _config2.default.mapboxgl_access_token;

var MapHolder = function (_Component) {
  _inherits(MapHolder, _Component);

  function MapHolder(props) {
    _classCallCheck(this, MapHolder);

    var _this = _possibleConstructorReturn(this, (MapHolder.__proto__ || Object.getPrototypeOf(MapHolder)).call(this, props));

    _this.state = {
      map: _this.props.map
    };
    return _this;
  }

  _createClass(MapHolder, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (!this.props.map) {
        var map = new _mapboxGl2.default.Map({
          container: this.props.map_container,
          style: _style2.default,
          center: [79, 21],
          hash: true
        });

        map.fitBounds(this.props.restrict_to_bounds, { linear: true, duration: 0 });
        map.setMaxBounds(map.getBounds());

        var nav = new _mapboxGl2.default.NavigationControl();
        map.addControl(nav, 'top-right');

        var fs = new _mapboxGl2.default.FullscreenControl();
        map.addControl(fs);

        var location = new _mapboxGl2.default.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          }, trackUserLocation: true });
        map.addControl(location);

        var styleOptions = [{ name: 'Openstreetmap', style: _style2.default }, { name: 'Satellite', style: 'mapbox://styles/mapbox/satellite-v9' }];
        map.addControl(new _BackgroundControl2.default(styleOptions));

        var default_zoom = map.getZoom();
        this.setState({
          map: map,
          default_zoom: default_zoom
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_MapData2.default, {
          url: this.props.url,
          location_field: this.props.location_field,
          default_zoom: this.state.default_zoom,
          url_response_geohash_field: this.props.url_response_geohash_field,
          url_response_filtered_geohash_field: this.props.url_response_filtered_geohash_field,
          color_scheme: this.props.color_scheme,
          no_legend_stops: this.props.no_legend_stops,
          is_legend_stops_data_driven: this.props.is_legend_stops_data_driven,
          on_click: this.props.on_click,
          map: this.state.map })
      );
    }
  }]);

  return MapHolder;
}(_react.Component);

exports.default = MapHolder;