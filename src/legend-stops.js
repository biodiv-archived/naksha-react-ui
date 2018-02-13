var cb = require('./colorbrewer/colorbrewer.js');

module.exports = function(color_scheme, is_legend_stops_data_driven, no_stops, counts) {
  let stops = []

  if(counts === undefined || counts.length === 0)
    return stops;

  stops.push([0, cb[color_scheme][no_stops][0]]);

  if(!is_legend_stops_data_driven) {
     let max_count = counts[counts.length-1];
     for (let i = 1; i < no_stops; i++) {
       let stop = Math.round(max_count / no_stops) * i;
       stops.push([stop, cb[color_scheme][no_stops][i]]);
     }

     return stops;
  }

  let interval = Math.round(counts.length/no_stops);

  if(interval === 0) {
    for (let i = 1; i < no_stops; i++)
      stops.push([counts[i], cb[color_scheme][no_stops][i]]);

    return stops;
  }

  for (let i = 1; i < no_stops; i++) {
    let stop = counts[interval * i];
    stops.push([stop, cb[color_scheme][no_stops][i]]);
  }

  return stops;

};
