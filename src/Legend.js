import React, { Component } from 'react';

class Legend extends Component {

  render() {

    let renderLegendKeys = function (stops) {
      let html = [];
      for(let i = 0; i < stops.length; i++) {
        let stop = stops[i];
        let stopStr = i < stops.length - 1 ? <span>{`${stop[0]} - ${stops[i+1][0] -1}`}</span> : <span>{`${stop[0]} - `}</span>;
        html.push (
          <div key={i} className='txt-s'>
            <span className='key' style={{ backgroundColor: stop[1] }} />
            {stopStr}
          </div>
        );
      }
      return html;
    }

    return (
      <div className="main-container">
        <div className="main">
          <div className='mb6'>
            <h2 className="txt-bold txt-s block">Legend</h2>
            <p className='txt-s color-gray'>1 sqaure = {this.props.area}</p>
          </div>
          {renderLegendKeys(this.props.stops)}
        </div>
      </div>
    )
  }
}

export default Legend;
