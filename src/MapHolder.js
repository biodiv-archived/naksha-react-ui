import React, { Component } from 'react';
import MapData from './MapData';
import mapboxgl from 'mapbox-gl';
import style from './css/style.json';

mapboxgl.accessToken = 'undefined';

class MapHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
        map : this.props.map
    }
  };

  componentWillMount() {
    if (!this.props.map) {
      var map = new mapboxgl.Map({
        container: this.props.map_container,
        style: style,
        center: [79, 21],
        hash: true
      });

      map.fitBounds(this.props.restrict_to_bounds, {linear: true, duration: 0});
      map.setMaxBounds(map.getBounds());

      var nav = new mapboxgl.NavigationControl();
      map.addControl(nav, 'top-right');

      var fs = new mapboxgl.FullscreenControl();
      map.addControl(fs);

      var location = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },trackUserLocation: true});
      map.addControl(location);

      let default_zoom = map.getZoom();
      this.setState({
        map : map,
        default_zoom : default_zoom
      });
    }
  }

  render() {
    return (
      <div>
          <MapData
            url = {this.props.url}
            location_field = {this.props.location_field}
            default_zoom = {this.state.default_zoom}
            url_response_geohash_field={this.props.url_response_geohash_field}
            url_response_filtered_geohash_field={this.props.url_response_filtered_geohash_field}
            color_scheme = {this.props.color_scheme}
            legend_stops = {this.props.legend_stops}
            no_legend_stops = {this.props.no_legend_stops}
            on_click = {this.props.on_click}
            map = {this.state.map} />
      </div>
    )
  }
}

export default MapHolder;
