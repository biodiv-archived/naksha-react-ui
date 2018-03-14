'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var GeoHash = require("geohash");
var BoundingBox = require('boundingbox');
var GeohashAggrKey = require('./aggregate-geohash.js');

module.exports = function (data, level) {

  if (data.length === 0) return {
    geojson: [],
    counts: []
  };

  var geojson = {
    "type": "FeatureCollection",
    features: []
  };
  var counts = [];

  var count_map = new Map();
  var bin_map = new Map();
  for (var i = 0; i < data.length; i++) {

    var key = GeohashAggrKey(data[i].key, level);

    bin_map.set(key.start, key.end);

    if (!count_map.has(key.start)) count_map.set(key.start, 0);

    count_map.set(key.start, count_map.get(key.start) + data[i].doc_count);
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = count_map.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = _slicedToArray(_ref, 2);

      var hash = _ref2[0];
      var value = _ref2[1];


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
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  counts.sort(function (a, b) {
    return a - b;
  });

  return {
    geojson: geojson,
    counts: counts
  };
};