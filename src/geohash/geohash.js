var GeoHash = require("geohash");

module.exports = function(data) {
    var points = [];
    var max_count = 0;
    var min_count = 10000000;

     for(var i = 0; i < data.buckets.length; i++) {
        var geohash = GeoHash.GeoHash.decodeGeoHash(data.buckets[i].key);
        geohash["doc_count"] = data.buckets[i].doc_count;

        if(data.buckets[i].doc_count > max_count)
          max_count = data.buckets[i].doc_count;
        if(data.buckets[i].doc_count < min_count)
          min_count = data.buckets[i].doc_count;

        points.push(geohash);
     }
     
     return {points:points, max_count:max_count, min_count:min_count};
};
