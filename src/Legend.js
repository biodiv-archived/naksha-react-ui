import React, { Component } from 'react';

class Legend extends Component {

  render() {
    const renderLegendKeys = (stop, i) => {
      return (
        <div key={i} className='txt-s'>
          <span className='key' style={{ backgroundColor: stop[1] }} />
          <span>{`${stop[0].toLocaleString()}`}</span>
        </div>
      );
    }

    return (
      <div className="main-container">
        <div className="main">
          <div className='mb6'>
            <h2 className="txt-bold txt-s block">Observations</h2>
            <p className='txt-s color-gray'>Filtered Observations</p>
          </div>
          {this.props.stops.map(renderLegendKeys)}
        </div>
      </div>
    )
  }
}

export default Legend;
