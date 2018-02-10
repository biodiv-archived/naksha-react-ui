var cb = require('./colorbrewer/colorbrewer.js');

module.exports = function(color_scheme, legend_stops, no_stops, max_count) {
  let stops = []
  stops.push([0, cb[color_scheme][no_stops][0]]);
  if(max_count === 0)
    return stops;

  let stop = 0;
  let pre_stop = 0;
  for (var i = 1; i < no_stops; i++) {

    if(legend_stops) {
      stop = Math.round(stop + max_count*legend_stops[i]);
    }
    else {
      stop = Math.round(max_count / no_stops) * i;
    }

    if(stop === pre_stop)
      return stops;

    pre_stop = stop;
      
    stops.push([stop, cb[color_scheme][no_stops][i]]);
  }

  return stops;

};
