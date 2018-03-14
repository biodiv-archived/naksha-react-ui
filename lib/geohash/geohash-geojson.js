"use strict";

var GeoHash = require("geohash");
var BoundingBox = require('boundingbox');

module.exports = function (data) {
  var geojson = {
    "type": "FeatureCollection",
    features: []
  };
  var counts = [];

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
    counts.push(count);
  }

  counts.sort(function (a, b) {
    return a - b;
  });

  return {
    geojson: geojson,
    counts: counts
  };
};