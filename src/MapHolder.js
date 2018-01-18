import React, { Component } from 'react';
import MapData from './MapData';
import mapboxgl from 'mapbox-gl';
import style from './css/style.json'

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
        zoom: 4,
        hash: true
      });

      var nav = new mapboxgl.NavigationControl();
      map.addControl(nav, 'top-right');

      var fs = new mapboxgl.FullscreenControl();
      map.addControl(fs);

      this.setState({
        map : map
      });
    }
  }

  render() {
    return (
      <div>
          <MapData
            url = {this.props.url}
            location_field = {this.props.location_field}
            default_zoom = {this.props.default_zoom}
            url_response_geohash_field={this.props.url_response_geohash_field}
            color_scheme = {this.props.color_scheme}
            legend_stops = {this.props.legend_stops}
            map = {this.state.map} />
      </div>
    )
  }
}

export default MapHolder;
