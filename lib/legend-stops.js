'use strict';

var cb = require('./colorbrewer/colorbrewer.js');

module.exports = function (color_scheme, is_legend_stops_data_driven, no_stops, counts) {
  var stops = [];

  if (counts === undefined || counts.length === 0) return stops;

  stops.push([0, cb[color_scheme][no_stops][0]]);

  if (counts.length === 1) return stops;

  if (!is_legend_stops_data_driven) {
    var max_count = counts[counts.length - 1];
    for (var i = 1; i < no_stops; i++) {
      var stop = Math.round(max_count / no_stops) * i;
      stops.push([stop, cb[color_scheme][no_stops][i]]);
    }

    return stops;
  }

  var interval = Math.round(counts.length / no_stops);

  if (interval === 0) {
    for (var _i = 1; _i < counts.length; _i++) {
      stops.push([counts[_i], cb[color_scheme][no_stops][_i]]);
    }return stops;
  }

  var pre_stop = 1;
  for (var _i2 = 1; _i2 < no_stops; _i2++) {
    var _stop = counts[interval * _i2];

    if (_stop <= pre_stop) {
      var index = interval * _i2;
      while (index < counts.length && counts[index++] <= pre_stop) {}
      if (index === counts.length) return stops;
      _stop = counts[index];
    }

    pre_stop = _stop;
    stops.push([_stop, cb[color_scheme][no_stops][_i2]]);
  }

  return stops;
};