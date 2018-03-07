import React, { Component } from 'react';
import '../css/layers.css'
var styling = require('./styling');
var toggleSideBar = styling.default.toggleSideBar
var toggleFeaturesSideBar = styling.default.toggleFeaturesSideBar
var openTab = styling.default.openTab
var initMap = styling.default.initMap

class Layers extends Component {
  componentDidMount() {
    initMap();
  }
  render() {
    return (
      <div style={{height: '90vh', overflowX: 'hidden'}}>
      {/* <div className='map' id='gmap'></div> */}
      <div className='map' id='map'></div>

      <div id='nav' className='left-nav border-inside fill-height'>
        <div className='nav-content'>
          <div className='tab'>
              <button className='tablinks active' onClick={(e) => openTab(e, "nav-all-layers")}>All Layers</button>
              <button className='tablinks' onClick={(e) => openTab(e, "nav-selected-layers")}>Selected Layers</button>
          </div>
          <div id='nav-all-layers' className='tabcontent'></div>
          <div id='nav-selected-layers' className='tabcontent'></div>
        </div>
        <button className="hamburger hamburger--arrow is-active" type="button" onClick={() => toggleSideBar()}>
 	 <div className="hamburger-box">
   	   <div className="hamburger-inner"></div>
 	 </div>
        </button> 
      </div>

      <div id='features-nav' className='features-nav border-inside fill-height'>
	<button className="hamburger hamburger--arrow-r is-active" type="button" onClick={() => toggleFeaturesSideBar()}>
 	 <div className="hamburger-box">
   	   <div className="hamburger-inner"></div>
 	 </div>
        </button> 
      	  <div id='features'></div>
      </div>
      </div>
    );
  }
}

export default Layers;
