import React, { Component } from 'react';
import Map from './Map';
import Geohash from './geohash/geohash-geojson'
import GeohashAggr from './geohash/geohash-aggregated-geojson'
import LegendStops from './legend-stops'
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import turfArea from '@turf/area';

mapboxgl.accessToken = 'undefined';

class MapData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      stops: [],
      area: undefined,
      zoom: this.props.default_zoom
    }

    this.props.map.setZoom(this.state.zoom);
    this.props.map.on('zoom', () => {
      var zoom = this.props.map.getZoom().toFixed(0);
      if (zoom !== this.state.zoom) {
        this.setState({
          zoom: zoom
        })
        this.setData(zoom);
      }
    });

  };

  getPrecisionAndLevelForZoom(zoom) {
    if(!zoom)
      zoom = this.state.zoom;
    if(zoom < 5)
      return [3, -1];
    else if(zoom < 6)
      return [4, 0]
    else if(zoom < 7)
      return [4, 1]
    else if(zoom < 8)
      return [5, 0]
    else if(zoom < 9)
      return [5, 1]
    else if(zoom < 10)
      return [5, -1]
    else if(zoom < 11)
      return [6, 0]
    else if(zoom < 12)
      return [6, 1]
    else if(zoom < 13)
      return [7, 0]
    else if(zoom < 14)
      return [7, 1]

    return [7, -1];
  }

  setData(zoom) {
    var [precision, level] = this.getPrecisionAndLevelForZoom(zoom);
    axios
      .get(this.props.url, {
        params: {
          geoAggregationField: this.props.location_field,
          geoAggegationPrecision: precision
        }
      })
      .then(({
        data
      }) => {

        data = this.props.url_response_geohash_field ? data[this.props.url_response_geohash_field] : data;
        data = JSON.parse(data);
        data = data[Object.keys(data)[0]].buckets

        var geojson = level === -1 ? Geohash(data) : GeohashAggr(data, level);
        var stops = LegendStops(this.props.color_scheme, this.props.legend_stops, geojson.max_count);
        this.updateArea(geojson.geojson)
        this.setState({
          data: geojson,
          stops: stops
        });

      })
      .catch((err) => {
        console.log('error ' + err);
      })
  }

  updateArea(geojson) {
    let areaSqm = Math.round(turfArea(geojson.features[0]));
    let area = areaSqm < 1000000 ? (areaSqm/1000000).toFixed(3) : Math.round(areaSqm/1000000);
    area += " sq km"
    this.setState({
      area : area
    });
  }

  componentDidMount() {
    this.setData(this.state.zoom);
  }

  render() {
    return (
      <div>
          <Map
            map = {this.props.map}
            data = {this.state.data}
            stops = {this.state.stops}
            area = {this.state.area}
            />
      </div>
    )
  }
}

export default MapData;
