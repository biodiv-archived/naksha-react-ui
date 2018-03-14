'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Map = require('./Map');

var _Map2 = _interopRequireDefault(_Map);

var _geohashGeojson = require('./geohash/geohash-geojson');

var _geohashGeojson2 = _interopRequireDefault(_geohashGeojson);

var _geohashAggregatedGeojson = require('./geohash/geohash-aggregated-geojson');

var _geohashAggregatedGeojson2 = _interopRequireDefault(_geohashAggregatedGeojson);

var _legendStops = require('./legend-stops');

var _legendStops2 = _interopRequireDefault(_legendStops);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _mapboxGl = require('mapbox-gl');

var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_mapboxGl2.default.accessToken = 'undefined';

var MapData = function (_Component) {
  _inherits(MapData, _Component);

  function MapData(props) {
    _classCallCheck(this, MapData);

    var _this = _possibleConstructorReturn(this, (MapData.__proto__ || Object.getPrototypeOf(MapData)).call(this, props));

    var bounds = _this.props.map.getBounds();
    _this.state = {
      data: undefined,
      stops: [],
      area: undefined,
      zoom: _this.props.default_zoom,
      top: bounds._ne.lat,
      right: bounds._ne.lng,
      left: bounds._sw.lng,
      bottom: bounds._sw.lat
    };

    _this.props.map.setZoom(_this.state.zoom);
    _this.initZoomHandler();
    _this.initDragHandler();
    return _this;
  }

  _createClass(MapData, [{
    key: 'initZoomHandler',
    value: function initZoomHandler() {
      var _this2 = this;

      this.props.map.on('zoom', function () {
        var zoom = _this2.props.map.getZoom().toFixed(0);
        if (zoom !== _this2.state.zoom) {
          _this2.setState({
            zoom: zoom
          });
          var bounds = _this2.setBounds();
          _this2.setData(zoom, bounds, false);
        }
      });
    }
  }, {
    key: 'initDragHandler',
    value: function initDragHandler() {
      var _this3 = this;

      this.props.map.on('drag', function (e) {
        var bounds = _this3.getMapBounds();
        if (bounds.bottom < _this3.state.bottom || bounds.top > _this3.state.top || bounds.left < _this3.state.left || bounds.right > _this3.state.right) {

          var _bounds = _this3.setBounds();
          _this3.setData(_this3.state.zoom, _bounds, true);
        }
      });
    }
  }, {
    key: 'getMapBounds',
    value: function getMapBounds() {
      var bounds = this.props.map.getBounds();
      var top = bounds._ne.lat;
      var right = bounds._ne.lng;
      var left = bounds._sw.lng;
      var bottom = bounds._sw.lat;

      return { top: top, left: left, bottom: bottom, right: right };
    }
  }, {
    key: 'setBounds',
    value: function setBounds() {
      var bounds = this.getMapBounds();
      var top = bounds.top;
      var right = bounds.right;
      var left = bounds.left;
      var bottom = bounds.bottom;

      var latDiff = top - bottom;
      var lngDiff = right - left;

      top = Math.min(top + latDiff, 90);
      left = Math.max(left - lngDiff, -180);
      bottom = Math.max(bottom - latDiff, -90);
      right = Math.min(right + lngDiff, 180);

      this.setState({
        top: top,
        left: left,
        bottom: bottom,
        right: right
      });

      return [top, left, bottom, right];
    }
  }, {
    key: 'getPrecisionAndLevelForZoom',
    value: function getPrecisionAndLevelForZoom(zoom) {
      if (!zoom) zoom = this.state.zoom;
      if (zoom < 6) return [4, 1, 39.2];else if (zoom < 7) return [5, 0, 19.6];else if (zoom < 8) return [5, 1, 9.8];else if (zoom < 9) return [5, -1, 4.9];else if (zoom < 10) return [6, 0, 2.45];else if (zoom < 11) return [6, 1, 1.225];else if (zoom < 12) return [7, 0, 0.612];else if (zoom < 13) return [7, 1, 0.306];else if (zoom < 14) return [7, -1, 0.153];else if (zoom < 15) return [8, 0, 0.077];

      return [8, 1, 0.039];
    }
  }, {
    key: 'setData',
    value: function setData(zoom, bounds, onlyFilteredAggregation) {
      var _this4 = this;

      var _getPrecisionAndLevel = this.getPrecisionAndLevelForZoom(zoom),
          _getPrecisionAndLevel2 = _slicedToArray(_getPrecisionAndLevel, 3),
          precision = _getPrecisionAndLevel2[0],
          level = _getPrecisionAndLevel2[1],
          squareSide = _getPrecisionAndLevel2[2];

      _axios2.default.get(this.props.url, {
        params: {
          geoAggregationField: this.props.location_field,
          geoAggegationPrecision: precision,
          top: bounds[0],
          left: bounds[1],
          bottom: bounds[2],
          right: bounds[3],
          onlyFilteredAggregation: onlyFilteredAggregation
        }
      }).then(function (_ref) {
        var data = _ref.data;

        _this4.updateData(data, level);
        if (!onlyFilteredAggregation) _this4.updateStops(data, level, squareSide);
      }).catch(function (err) {
        console.log('error ' + err);
      });
    }
  }, {
    key: 'updateData',
    value: function updateData(data, level) {
      data = this.props.url_response_filtered_geohash_field ? data[this.props.url_response_filtered_geohash_field] : data;
      data = JSON.parse(data);
      data = data[Object.keys(data)[0]].buckets;

      var geojson = level === -1 ? (0, _geohashGeojson2.default)(data) : (0, _geohashAggregatedGeojson2.default)(data, level);
      this.setState({
        data: geojson.geojson
      });
    }
  }, {
    key: 'updateStops',
    value: function updateStops(data, level, squareSide) {
      data = this.props.url_response_geohash_field ? data[this.props.url_response_geohash_field] : data;
      data = JSON.parse(data);
      data = data[Object.keys(data)[0]].buckets;

      var geojson = level === -1 ? (0, _geohashGeojson2.default)(data) : (0, _geohashAggregatedGeojson2.default)(data, level);
      var stops = (0, _legendStops2.default)(this.props.color_scheme, this.props.is_legend_stops_data_driven, this.props.no_legend_stops, geojson.counts);
      var area = squareSide + "*" + squareSide + " km";

      this.setState({
        stops: stops,
        area: area
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setData(this.state.zoom, [this.state.top, this.state.left, this.state.bottom, this.state.right], false);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Map2.default, {
          map: this.props.map,
          on_click: this.props.on_click,
          data: this.state.data,
          stops: this.state.stops,
          area: this.state.area
        })
      );
    }
  }]);

  return MapData;
}(_react.Component);

exports.default = MapData;