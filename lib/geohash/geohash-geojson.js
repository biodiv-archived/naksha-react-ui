"use strict";

var GeoHash = require("geohash");
var BoundingBox = require('boundingbox');

module.exports = function (data) {
  var geojson = {
    "type": "FeatureCollection",
    features: []
  };

  var max_count = 0;
  var min_count = 1000000000;

  for (var i = 0; i < data.length; i++) {
    var bbox = GeoHash.GeoHash.decodeGeoHash(data[i].key);
    var count = data[i].doc_count;

    var boundingbox = new BoundingBox({
      minlat: bbox.latitude[0],
      minlon: bbox.longitude[0],
      maxlat: bbox.latitude[1],
      maxlon: bbox.longitude[1]
    });

    var feature = boundingbox.toGeoJSON();

    feature["properties"] = {
      "doc_count": count
    };

    geojson.features.push(feature);

    max_count = Math.max(max_count, count);
    min_count = Math.min(min_count, count);
  }

  return {
    geojson: geojson,
    max_count: max_count,
    min_count: min_count
  };
};