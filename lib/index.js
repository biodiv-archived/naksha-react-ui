'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('./css/index.css');

require('./css/legend.css');

require('./css/mapbox-gl.css');

var _MapHolder = require('./MapHolder');

var _MapHolder2 = _interopRequireDefault(_MapHolder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ReactDOM.render(<MapHolder url="http://localhost:8080/naksha/services/geohash-aggregation/biodiv/observations"
//                            location_field="location"
//                            default_zoom="3"
//                            map_container="map"
//                            url_response_geohash_field="document"
//                            color_scheme="YlOrRd"
//                            legend_stops="9" />,
//                            document.getElementById('root'));

exports.default = _MapHolder2.default;