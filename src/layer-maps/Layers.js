import React, { Component } from 'react';

import './layers.css'
var styling = require('./styling');
var toggleSideBar = styling.default.toggleSideBar
var openTab = styling.default.openTab
var initMap = styling.default.initMap

class Layers extends Component {
  componentDidMount() {
    initMap();
  }
  render() {
    return (
      <div>
      <div className='header'>
        <button style={{margin:'0.5% 0 0 45%'}} onClick={() => toggleSideBar()}>Layers Panel</button>
      </div>

      <div className='map' id='gmap'></div>
      <div className='map' id='map'></div>

      <div id='nav' className='left-nav border-inside fill-height'>
          <div className='tab'>
              <button className='tablinks active' onClick={(e) => openTab(e, "all_layers")}>All Layers</button>
              <button className='tablinks' onClick={(e) => openTab(e, "selected_layers")}>Selected Layers</button>
          </div>
          <div id='nav-all-layers'></div>
          <div id='nav-selected-layers' className='hide'></div>
      </div>

      <div id='features'></div>
      </div>
    );
  }
}

export default Layers;
