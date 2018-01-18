import React, { Component } from 'react';
import Legend from './Legend';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'undefined';

class Map extends Component {

  ApplyMapData() {

    this.props.map.on('load', () => {
      this.props.map.addSource('observations', {
        type: 'geojson',
        data: this.props.data.geojson
      });

      this.props.map.addLayer({
          "id": "observations",
          "type": "fill",
          "source" : "observations",
          "paint": {
              "fill-color": "#888888",
              "fill-opacity": 0.8
          }
      });

      this.props.map.on('click', 'observations', function (e) {
          new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML("Count "+e.features[0].properties.doc_count)
              .addTo(this);
      });

      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      this.props.map.on('mouseenter', 'observations', function (e) {
          this.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(e.lngLat)
          .setHTML("Count "+e.features[0].properties.doc_count)
          .addTo(this);
      });

      // Change it back to a pointer when it leaves.
      this.props.map.on('mouseleave', 'observations', function () {
          this.getCanvas().style.cursor = '';
          popup.remove();
      });

      this.setFill();
    });

  }

  setFill() {
    var source = this.props.map.getSource("observations");
    if (source)
      source.setData(this.props.data.geojson);

    var property = "doc_count";
    var stops = this.props.stops;
    if (stops.length > 0)
      this.props.map.on('load', () => {
        this.props.map.setPaintProperty('observations', 'fill-color', {
          property,
          stops
        });
     });
  }

  componentDidMount() {
    this.ApplyMapData();
  }

  componentDidUpdate() {
    this.setFill();
  }

  render() {
    return (
      <Legend stops = {this.props.stops} />
    )
  }
}

export default Map;
