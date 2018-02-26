import React, { Component } from 'react';
import Legend from './Legend';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'undefined';

class Map extends Component {

  constructor(props) {
    super(props);
    this.props.map.on('load', () => {
      this.applyMapData();
    })
  };

  onClick(e) {
    this.props.on_click(e, e.features[0].geometry.coordinates)
    .then( (fulfilled) => {
          return new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(fulfilled)
              .addTo(this.props.map);
      })
      .catch(function (error) {
          console.log(error.message);
      });
  }

  setOnClick() {
    this.props.map.on('click', 'observations', this.onClick.bind(this));
  }

  applyMapData() {
    if(!this.props.map._loaded || !this.props.data || this.props.map.getSource("observations"))
      return;

      this.props.map.addSource('observations', {
        type: 'geojson',
        data: this.props.data
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

      if(this.props.on_click)
        this.setOnClick();

      // Create a popup, but don't add it to the map yet.
      let popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      this.props.map.on('mousemove', 'observations', function (e) {
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
  }

  setFill() {
    if(!this.props.stops || this.props.stops.length === 0)
      return;

    let source = this.props.map.getSource("observations");
    if (source)
      source.setData(this.props.data);

    let property = "doc_count";
    if(this.props.map.getLayer("observations")) {
      let stops = this.props.stops;
      this.props.map.setPaintProperty('observations', 'fill-color', {
        property,
        stops
      });
    }
  }

  componentDidUpdate() {
    this.setFill();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data)
      this.applyMapData();
  }

  render() {
    return (
      <Legend stops = {this.props.stops} area = {this.props.area} />
    )
  }
}

export default Map;
