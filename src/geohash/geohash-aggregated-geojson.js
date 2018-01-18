var GeoHash = require("geohash");
var BoundingBox = require('boundingbox');
var GeohashAggrKey = require('./aggregate-geohash.js');

module.exports = function(data, level) {

  if (data.length === 0)
    return {
      geojson: [],
      min_count: 0,
      max_count: 0
    };

  var geojson = {
    "type": "FeatureCollection",
    features: []
  };

  var max_count = 0;
  var min_count = 1000000000;

  var count_map = new Map()
  var bin_map = new Map()
  for (var i = 0; i < data.length; i++) {

    var key = GeohashAggrKey(data[i].key, level);

    bin_map.set(key.start, key.end);

    if (!count_map.has(key.start))
      count_map.set(key.start, 0);

    count_map.set(key.start, count_map.get(key.start) + data[i].doc_count);
  }

  for (var [hash, value] of count_map.entries()) {

    var bbox_start = GeoHash.GeoHash.decodeGeoHash(hash);
    var bbox_end = GeoHash.GeoHash.decodeGeoHash(bin_map.get(hash));

    var boundingbox = new BoundingBox({
      minlat: bbox_start.latitude[0],
      minlon: bbox_start.longitude[0],
      maxlat: bbox_end.latitude[1],
      maxlon: bbox_end.longitude[1]
    });


    var feature = boundingbox.toGeoJSON();

    feature["properties"] = {
      "doc_count": value
    };

    geojson.features.push(feature);

    max_count = Math.max(max_count, value);
    min_count = Math.min(min_count, value);

  }

  return {
    geojson: geojson,
    max_count: max_count,
    min_count: min_count
  };
};
