var cb = require('./colorbrewer/colorbrewer.js');

module.exports = function(color_scheme, legend_stops, max_count) {

  var stops = []
  stops.push([0, cb[color_scheme][legend_stops][0]]);

  for (var i = 1; i < legend_stops; i++) {
    var stop = Math.round(max_count / legend_stops) * i;
    stops.push([stop, cb[color_scheme][legend_stops][i]]);
  }

  return stops;

};
