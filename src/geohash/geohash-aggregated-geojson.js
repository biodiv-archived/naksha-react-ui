var GeoHash = require("geohash");
var BoundingBox = require('boundingbox');
var GeohashAggrKey = require('./aggregate-geohash.js');

module.exports = function(data, level) {

  if (data.length === 0)
    return {
      geojson: [],
      counts: []
    };

  var geojson = {
    "type": "FeatureCollection",
    features: []
  };
  var counts = []

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
    counts.push(value);
  }

  counts.sort(function(a, b){return a-b});

  return {
    geojson: geojson,
    counts: counts
  };
};
