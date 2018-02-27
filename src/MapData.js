import React, { Component } from 'react';
import Map from './Map';
import Geohash from './geohash/geohash-geojson'
import GeohashAggr from './geohash/geohash-aggregated-geojson'
import LegendStops from './legend-stops'
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'undefined';

class MapData extends Component {

  constructor(props) {
    super(props);
    let bounds = this.props.map.getBounds();
    this.state = {
      data: undefined,
      stops: [],
      area: undefined,
      zoom: this.props.default_zoom,
      top: bounds._ne.lat,
      right: bounds._ne.lng,
      left: bounds._sw.lng,
      bottom: bounds._sw.lat
    }

    this.props.map.setZoom(this.state.zoom);
    this.initZoomHandler();
    this.initDragHandler();
  };

  initZoomHandler() {
    this.props.map.on('zoom', () => {
      let zoom = this.props.map.getZoom().toFixed(0);
      if (zoom !== this.state.zoom) {
        this.setState({
          zoom: zoom
        })
        let bounds = this.setBounds();
        this.setData(zoom, bounds, false);
      }
    });
  }

  initDragHandler() {
    this.props.map.on('drag', (e) => {
      let bounds = this.getMapBounds();
      if (bounds.bottom < this.state.bottom || bounds.top > this.state.top
        || bounds.left < this.state.left || bounds.right > this.state.right) {

        let bounds = this.setBounds();
        this.setData(this.state.zoom, bounds, true);
      }
    });
  }

  getMapBounds() {
    let bounds = this.props.map.getBounds();
    let top = bounds._ne.lat;
    let right = bounds._ne.lng;
    let left = bounds._sw.lng;
    let bottom = bounds._sw.lat;

    return {top: top, left: left, bottom: bottom, right: right};
  }

  setBounds() {
    let bounds = this.getMapBounds();
    let top = bounds.top;
    let right = bounds.right;
    let left = bounds.left;
    let bottom = bounds.bottom;

    let latDiff = top - bottom;
    let lngDiff = right - left;

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

    return [top, left, bottom, right]
  }

  getPrecisionAndLevelForZoom(zoom) {
    if(!zoom)
      zoom = this.state.zoom;
    if(zoom < 6)
      return [4, 1, 39.2]
    else if(zoom < 7)
      return [5, 0, 19.6]
    else if(zoom < 8)
      return [5, 1, 9.8]
    else if(zoom < 9)
      return [5, -1, 4.9]
    else if(zoom < 10)
      return [6, 0, 2.45]
    else if(zoom < 11)
      return [6, 1, 1.225]
    else if(zoom < 12)
      return [7, 0, 0.612]
    else if(zoom < 13)
      return [7, 1, 0.306]
    else if(zoom < 14)
      return [7, -1, 0.153]
    else if(zoom < 15)
      return [8, 0, 0.077];

    return [8, 1, 0.039];
  }

  setData(zoom, bounds, onlyFilteredAggregation) {
    let [precision, level, squareSide] = this.getPrecisionAndLevelForZoom(zoom);
    axios
      .get(this.props.url, {
        params: {
          geoAggregationField: this.props.location_field,
          geoAggegationPrecision: precision,
          top: bounds[0],
          left: bounds[1],
          bottom: bounds[2],
          right: bounds[3],
          onlyFilteredAggregation: onlyFilteredAggregation
        }
      })
      .then(({
        data
      }) => {
        this.updateData(data, level);
        if(!onlyFilteredAggregation)
          this.updateStops(data, level, squareSide);

      })
      .catch((err) => {
        console.log('error ' + err);
      })
  }

  updateData(data, level) {
    data = this.props.url_response_filtered_geohash_field ? data[this.props.url_response_filtered_geohash_field] : data;
    data = JSON.parse(data);
    data = data[Object.keys(data)[0]].buckets;

    let geojson = level === -1 ? Geohash(data) : GeohashAggr(data, level);
    this.setState({
      data: geojson.geojson
    });
  }

  updateStops(data, level, squareSide) {
    data = this.props.url_response_geohash_field ? data[this.props.url_response_geohash_field] : data;
    data = JSON.parse(data);
    data = data[Object.keys(data)[0]].buckets;

    let geojson = level === -1 ? Geohash(data) : GeohashAggr(data, level);
    let stops = LegendStops(this.props.color_scheme, this.props.is_legend_stops_data_driven, this.props.no_legend_stops, geojson.counts);
    let area = squareSide + "*" + squareSide + " km"

    this.setState({
      stops: stops,
      area: area
    });
  }

  componentDidMount() {
    this.setData(this.state.zoom, [this.state.top, this.state.left, this.state.bottom, this.state.right], false);
  }

  render() {
    return (
      <div>
          <Map
            map = {this.props.map}
            on_click = {this.props.on_click}
            data = {this.state.data}
            stops = {this.state.stops}
            area = {this.state.area}
            />
      </div>
    )
  }
}

export default MapData;
