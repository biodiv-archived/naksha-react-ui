'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('./css/index.css');

require('./css/legend.css');

require('./css/mapbox-gl.css');

require('./css/layers.css');

require('./css/pikaday.css');

require('./css/style.json');

var _MapHolder = require('./MapHolder');

var _MapHolder2 = _interopRequireDefault(_MapHolder);

var _Layers = require('./layer-maps/Layers');

var _Layers2 = _interopRequireDefault(_Layers);

var _NewLayerComponent = require('./layer-maps/NewLayerComponent');

var _NewLayerComponent2 = _interopRequireDefault(_NewLayerComponent);

var _indiaBoundaries = require('./common/india-boundaries.js');

var _indiaBoundaries2 = _interopRequireDefault(_indiaBoundaries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import React from 'react';
// import ReactDOM from 'react-dom';
//
// ReactDOM.render(<MapHolder url="http://localhost:8080/naksha/services/geohash-aggregation/observation/observations"
//                            location_field="location"
//                            map_container="map"
//                            restrict_to_bounds={[[68, 5.75], [98, 37.5]]}
//                            url_response_geohash_field="document"
//                            url_response_filtered_geohash_field="document"
//                            color_scheme="YlOrBr"
//                            no_legend_stops="7"
//                            is_legend_stops_data_driven={true}
//                            on_click={function} />,
//
//                            document.getElementById('root'));

//import './css/theme.css'
//import './css/triangle.css'
exports.default = {
  MapHolder: _MapHolder2.default,
  Layers: _Layers2.default,
  NewLayerComponent: _NewLayerComponent2.default,
  IndiaBoundaries: _indiaBoundaries2.default
};
//import './css/site.css'