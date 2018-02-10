import './css/index.css';
import './css/legend.css';
import './css/mapbox-gl.css';
import './css/layers.css';
import MapHolder from './MapHolder';
import Layers from './layer-maps/Layers';

// import React from 'react';
// import ReactDOM from 'react-dom';
//
// ReactDOM.render(<MapHolder url="http://localhost:8080/naksha/services/geohash-aggregation/observation/observations"
//                            location_field="location"
//                            default_zoom="3"
//                            map_container="map"
//                            restrict_to_bounds={[[42, 4], [117, 39]]}
//                            url_response_geohash_field="document"
//                            url_response_filtered_geohash_field="document"
//                            color_scheme="YlOrBr"
//                            no_legend_stops="7"
//                            legend_stops={[0.0, 0.00025, .001, .01, .1, .38875, .5]}
//                            on_click = {function} />,
//
//                            document.getElementById('root'));

export default {
  MapHolder : MapHolder,
  Layers : Layers
}
