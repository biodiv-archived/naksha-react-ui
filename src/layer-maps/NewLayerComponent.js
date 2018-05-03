import React, { Component } from 'react';
import '../css/layers.css'
import addLayer from './addLayer'

class NewLayerComponent extends Component {
  componentDidMount() {
	  addLayer.init(this.props);
  }
  render() {
    return (
      <div id='add-layer-component' style={{height: '100%', width: '100%'}}>
      </div>
    );
  }
}

export default NewLayerComponent;
