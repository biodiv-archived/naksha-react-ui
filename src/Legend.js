import React, { Component } from 'react';

class Legend extends Component {

  constructor(props) {
      super(props);
      this.state = {
        showLegend : true
      }
  }

  toggleShowLegend() {
    this.setState({
      showLegend : !this.state.showLegend
    })
  }

  render() {

    let renderLegendKeys = function (stops) {
      let html = [];
      for(let i = 0; i < stops.length; i++) {
        let stop = stops[i];
        let stopStr = i < stops.length - 1 ? <span>{`${stop[0]} - ${stops[i+1][0] -1}`}</span> : <span>{`${stop[0]} - `}</span>;
        html.push (
          <div key={i} className='txt-s'>
            <span className='legend-key' style={{ backgroundColor: stop[1] }} />
            {stopStr}
          </div>
        );
      }
      return html;
    }

    return (
      <div className="main-container">
        {this.state.showLegend && <div className="main">
          <div className='mb6'>
            <h2 className="txt-bold txt-s block">Legend<i className="fa fa-close pull-right" onClick={this.toggleShowLegend.bind(this)}></i></h2>
            <p className='txt-s color-gray'>1 square = {this.props.area}</p>
          </div>
          {renderLegendKeys(this.props.stops)}
        </div>}
        {!this.state.showLegend && <div className="main" onClick={this.toggleShowLegend.bind(this)}>
          <i className="fa fa-align-justify"></i>
        </div>}
      </div>
    )
  }
}

export default Legend;
