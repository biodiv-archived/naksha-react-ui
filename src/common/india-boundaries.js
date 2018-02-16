// Tweaked the code from https://github.com/mapbox/mapbox-gl-boundaries
export default function addClaimedBoundaries(map) {

    // Add the claimed boundaries vector source
    map.addSource('claimedboundaries', {
        type: 'vector',
        url: 'mapbox://planemad.claimedboundaries'
    });

    if(map.getLayer("admin-2-boundaries")) {
      // Style the claimed boundaries background line
      map.addLayer({
          "id": "admin-2-claimed-bg",
          "type": "line",
          "source": "claimedboundaries",
          "source-layer": "claimedboundaries",
          "minzoom": 1
      }, "admin-2-boundaries");

      ["admin-2-boundaries-bg"].forEach(function(layer) {
          pickPaintProperties("admin-2-claimed-bg", layer, ["line-color", "line-opacity", "line-width"]);
      });

      // Style the claimed boundaries line
      map.addLayer({
          "id": "admin-2-claimed",
          "type": "line",
          "source": "claimedboundaries",
          "source-layer": "claimedboundaries",
          "minzoom": 1
      }, "admin-2-boundaries");

      ["admin-2-boundaries"].forEach(function(layer) {
          pickPaintProperties("admin-2-claimed", layer, ["line-color", "line-opacity", "line-width"]);
      });

      // Filter out the disputed boundaries from the background line
      ["admin-2-boundaries-bg"].forEach(function(layer) {
          var filter = map.getFilter(layer);
          filter.push([
              "==",
              "disputed",
              0
          ]);
          map.setFilter(layer, filter);
      });
    }

    if(map.getLayer("admin_country")) {
      // Style the claimed boundaries line
      map.addLayer({
          "id": "admin-2-claimed",
          "type": "line",
          "source": "claimedboundaries",
          "source-layer": "claimedboundaries",
          "minzoom": 1
      }, "admin_country");

      ["admin_country"].forEach(function(layer) {
          pickPaintProperties("admin-2-claimed", layer, ["line-color", "line-opacity", "line-width"]);
      });

      // Filter out the disputed boundaries from the background line
      ["admin_country"].forEach(function(layer) {
          var filter = map.getFilter(layer);
          filter.push([
              "==",
              "disputed",
              0
          ]);
          map.setFilter(layer, filter);
      });
    }

    // Pick style properties from a target layer
    function pickPaintProperties(source, target, properties) {
        properties.forEach(function(prop) {
            map.setPaintProperty(source, prop, map.getPaintProperty(target, prop));
        });
    };

}
