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

    _this.state = {
      data: [],
      stops: [],
      zoom: _this.props.default_zoom
    };

    _this.props.map.setZoom(_this.state.zoom);
    _this.props.map.on('zoom', function () {
      var zoom = _this.props.map.getZoom().toFixed(0);
      if (zoom !== _this.state.zoom) {
        _this.setState({
          zoom: zoom
        });
        _this.setData(zoom);
      }
    });

    return _this;
  }

  _createClass(MapData, [{
    key: 'getPrecisionAndLevelForZoom',
    value: function getPrecisionAndLevelForZoom(zoom) {
      if (!zoom) zoom = this.state.zoom;
      if (zoom < 5) return [3, -1];else if (zoom < 6) return [4, 0];else if (zoom < 7) return [4, 1];else if (zoom < 8) return [5, 0];else if (zoom < 9) return [5, 1];else if (zoom < 10) return [5, -1];else if (zoom < 11) return [6, 0];else if (zoom < 12) return [6, 1];else if (zoom < 13) return [7, 0];else if (zoom < 14) return [7, 1];

      return [7, -1];
    }
  }, {
    key: 'setData',
    value: function setData(zoom) {
      var _this2 = this;

      var _getPrecisionAndLevel = this.getPrecisionAndLevelForZoom(zoom),
          _getPrecisionAndLevel2 = _slicedToArray(_getPrecisionAndLevel, 2),
          precision = _getPrecisionAndLevel2[0],
          level = _getPrecisionAndLevel2[1];

      _axios2.default.get(this.props.url, {
        params: {
          geoAggregationField: this.props.location_field,
          geoAggegationPrecision: precision
        }
      }).then(function (_ref) {
        var data = _ref.data;


        data = _this2.props.url_response_geohash_field ? data[_this2.props.url_response_geohash_field] : data;
        data = JSON.parse(data);
        data = data[Object.keys(data)[0]].buckets;

        var geojson = level === -1 ? (0, _geohashGeojson2.default)(data) : (0, _geohashAggregatedGeojson2.default)(data, level);
        var stops = (0, _legendStops2.default)(_this2.props.color_scheme, _this2.props.legend_stops, geojson.max_count);
        _this2.setState({
          data: geojson,
          stops: stops
        });
      }).catch(function (err) {
        console.log('error ' + err);
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setData(this.state.zoom);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Map2.default, {
          map: this.props.map,
          data: this.state.data,
          stops: this.state.stops
        })
      );
    }
  }]);

  return MapData;
}(_react.Component);

exports.default = MapData;