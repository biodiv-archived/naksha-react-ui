"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var initial_zoom = null;

function set_initial_zoom(map) {
	initial_zoom = map.getZoom();
}

function syncMaps(master, google_map) {
	var center = master.getCenter();
	var zoom = master.getZoom();

	google_map.setCenter(center);
	google_map.setZoom(zoom + 1);

	// now if zoom level was non-integer, the google map
	// would have become blank.
	var new_zoom;
	if (zoom > initial_zoom) new_zoom = Math.ceil(zoom);else new_zoom = Math.floor(zoom);

	if (new_zoom === zoom) return;else {
		master.setZoom(new_zoom);
		google_map.setZoom(new_zoom + 1);
	}
}

function sync_map_move(map, gmap) {
	var center = map.getCenter();
	gmap.setCenter(center);
}

exports.default = {
	set_initial_zoom: set_initial_zoom,
	syncMaps: syncMaps,
	sync_map_move: sync_map_move
};


window.set_initial_zoom = set_initial_zoom;
window.syncMaps = syncMaps;
window.sync_map_move = sync_map_move;