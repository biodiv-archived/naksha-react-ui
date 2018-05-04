import './css/index.css';
import './css/legend.css';
import './css/mapbox-gl.css';
import './css/layers.css';
import './css/pikaday.css';
//import './css/site.css'
import './css/style.json'
//import './css/theme.css'
//import './css/triangle.css'
import MapHolder from './MapHolder';
import Layers from './layer-maps/Layers';
import NewLayerComponent from './layer-maps/NewLayerComponent'

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

export default {
  MapHolder : MapHolder,
  Layers : Layers,
  NewLayerComponent: NewLayerComponent
}
