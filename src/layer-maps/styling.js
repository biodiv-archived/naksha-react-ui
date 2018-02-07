var mapboxgl = require('mapbox-gl')
var GoogleMapsLoader = require('google-maps')
//var sync = require('./sync.js')
//var set_initial_zoom = sync.set_initial_zoom
//var syncMaps = sync.syncMaps
//var sync_map_move = sync.sync_map_move

var baseUrl = "http://" + get_host() + "/naksha/geoserver/"
var workspace_name = 'biodiv'
var style_file_json_url = "http://localhost:6792/geoserver/styles/"
var icons_url = "http://localhost:6792/geoserver/www/icons/"

var current_selected_layer = null;
var current_selected_style = null;

var map_style = null;
var active_layers = [];

var initial_zoom = null;

var map = null;
var gmap = null;
function initMap() {
    var india_center = {lat: 25, lng: 77};
    GoogleMapsLoader.load(function(google) {
        gmap = new google.maps.Map(document.getElementById('gmap'), {
        zoom: 4,
        center: india_center
      });
    })
    initializeMap();
}

function initializeMap() {
    var india_boundary = {
        version: 8,
        sources: {
            "vector-tiles": {
                "type" : "vector",
                "scheme": "tms",
                "tiles": ["http://localhost:8080/geoserver/gwc/service/tms/1.0.0/biodiv:lyr_104_india_states_census01@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf"]
            }
        },
        "layers": [
                /*{
                    "id": "background",
                    "type": "raster",
                    "source": "background"
                },*/
              /*  {
                "id": "vector-layer",
                "type": "line",
                "source": "vector-tiles",
                "source-layer": "lyr_104_india_states_census01",
                "paint": {
                    'line-color': '#aaaaaa'
                }}*/
        ]
    };

    map = new mapboxgl.Map({
          container: 'map',
          center: [77, 25],
          zoom: 3,
          style: india_boundary
        });
    map.addControl(new mapboxgl.NavigationControl());

    map.on('zoomstart', function(){
        set_initial_zoom(map);
    })
    map.on('zoom', function(){
        syncMaps(map, gmap);
    })
    map.on('move', function(){
        sync_map_move(map, gmap);
    })

    map.on('click', function (e) {
        showClickedFeature(e);
    });
    populateLayerPanel();
}

function get_host_name(){
    return 'localhost';
}

function get_port(){
    return '8080';
}

function get_host(){
    return get_host_name() + ":" + get_port();
}

function getWorkspace() {
    return workspace_name;
}

function get_map_style(){
    return map_style;
}

function set_map_style(style){
    map_style = style;
}

// style_name should be combination of layer name and the attribute
// on which the styling is needed
function getStyle(style_name){
    var style_file_url = baseUrl + "styles/" + style_name + ".json"
    var style = httpGetAsync(style_file_url);
    return JSON.parse(style);
}

// gets all available styles for a layer
function getAvailableStyles(layer){
    var style_file_url = baseUrl + "layers/" + layer + "/styles"
    var styles = httpGetAsync(style_file_url);
    var styles_json = JSON.parse(styles);

    var all_styles = styles_json.styles.style.map(feature => feature.name);
    return all_styles;
}

function httpGetAsync(theUrl, isXML=false)
{
    // var xmlHttp = createCORSRequest("GET", theUrl)
    var xmlHttp = new XMLHttpRequest();
    // below code is used in case of async requests,
    // which is the correct way going forward
    /*xmlHttp.onreadystatechange = function() {
    	console.log(xmlHttp.readyState);
        if (xmlHttp.readyState == 4){
        	callback(xmlHttp.responseText)
            // return xmlHttp.responseText;
        }
    }*/
    xmlHttp.open("GET", theUrl, false); // true for asynchronous
    // xmlHttp.setRequestHeader('Access-Control-Allow-Origin', 'localhost:3000')
    xmlHttp.send();
    if (isXML)
        return xmlHttp.responseXML;
    else
        return xmlHttp.responseText;
}

function print(str){
	console.log("Print:" + str);
}

function getAvailableLayers(){
    // var url = baseUrl + workspace_name + '/ows?SERVICE=WFS&REQUEST=GetCapabilities';
    var url = baseUrl + 'layers/' + workspace_name + '/wfs';
    console.log(url);
    var layers = [];
    var isXML = true;
	var response = httpGetAsync(url, isXML);
    var featureTypeList = response.getElementsByTagName('FeatureTypeList')[0];
    for (var i = 0; i < featureTypeList.childNodes.length; i++){
        var feature = featureTypeList.childNodes[i];
        // console.log(feature)
        var layer_info = getLayerInfo_WMS_3(feature);
        if (layer_info !== undefined){
                layers.push(layer_info);
        }
    }
    return layers
    // extract list of all available layers
    // var all_layers = layers_json.featureTypes.featureType.map(feature => feature.name);
    // return all_layers
}

function getLayerInfo_WMS_3(layerElement) {
    var name;
    var title;
    var bbox;
    var abstract;
    var keywords = [];
    var styles = [];

    var childNodes = layerElement.childNodes;

    var occurrence = getWorkspace() + ":occurrence";
    for (var i=0; i<childNodes.length; i++) {
        if (childNodes[i].nodeName === "Name"){
            if (childNodes[i].childNodes[0] === undefined)
                return;
            name = childNodes[i].childNodes[0].nodeValue.split(':')[1];
            if (name === occurrence)
                return;
        }else if (childNodes[i].nodeName === "Title"){
            if (childNodes[i].childNodes[0] === undefined || childNodes[i].childNodes[0] === null)
                return;
            title = childNodes[i].childNodes[0].nodeValue;
        }else if (childNodes[i].nodeName === "Abstract") {
            var abstract_node = childNodes[i].childNodes[0];
            abstract = (abstract_node !== undefined)?abstract_node.nodeValue:'';
        }
        else if (childNodes[i].nodeName.endsWith("BoundingBox")){
            bbox = getLatLonBBoxString(childNodes[i]);
        }/*else if (childNodes[i].nodeName.endsWith("Keywords"))
            keywords = getLayerKeywords(childNodes[i]);*/
        // else if (childNodes[i].nodeName.endsWith("Style")) {
        //     styles.push(getStyleInfo(childNodes[i]));
        // }
    }

    return {name: name, title: title, bbox: bbox, abstract: abstract, keywords: keywords, styles: styles};

}

function getLatLonBBoxString(boundingBoxElement) {
    var lowerCorner = boundingBoxElement.childNodes[0].childNodes[0].nodeValue.split(' ');
    var upperCorner = boundingBoxElement.childNodes[1].childNodes[0].nodeValue.split(' ');
    var minx = lowerCorner[0];
    var miny = lowerCorner[1];
    var maxx = upperCorner[0];
    var maxy = upperCorner[1];

    var bboxArr = [];
    bboxArr.push(minx);
    bboxArr.push(miny);
    bboxArr.push(maxx);
    bboxArr.push(maxy);

    return bboxArr.join(',');
}

function layer_changed(){
    var new_layer = document.getElementById('layer_input').value;
    if (new_layer == current_selected_layer)
        // nothing has changed
        return;

    // if new layer has been selected
    var styles = getAvailableStyles(new_layer);
    var style_selector = document.getElementById('styles');

    var i = 0;
    print (style_selector.options.length)
    while (i < style_selector.options.length){
        style_selector.removeChild(style_selector.options[i]);
    }

    styles.forEach(function(style){
       var option = document.createElement('option');
       option.value = style;
       style_selector.appendChild(option);
    });

    document.getElementById('style_input').value = styles[0];
    style_changed()
}

function style_changed(){
    var new_style = document.getElementById('style_input').value;
    if (new_style == current_selected_style)
        // nothing has changed
        return;

    // if new style has been selected
    var style = getStyle(new_style)
    update_map(style)
}

// async function update_map(style){
function update_map(style){
    // add_background_to_style(style)
    // print(style)
    map.setStyle(style);
    // await sleep(2000);
    // map.addLayer(new google.maps.TransitLayer());
}


// Adds a background layer to the map style json
function add_background_to_style(style){
    style.sources["background"] = {
                "type": "raster",
                "tiles": ["http://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                // "tiles": ["https://www.googleapis.com/tile/v1/tiles/{z}/{x}/{y}?key=AIzaSyCFan9y3E6XCb_3HE6kbbghfmRTmIgVJ9M"],
                "tileSize": 256
            };
    var first_layer_id = style.layers[0].id;
    style.layers.splice(first_layer_id, 0, {
                    "id": "background",
                    "type": "raster",
                    "source": "background"
                });
}



function getThemeNames(theme_type) {
    var by_themes = 'Biogeography///Abiotic///Demography///Species///Administrative Units///Land Use Land Cover///Conservation';

    var by_geography = 'India///Nilgiri Biosphere Reserve///Western Ghats///BR Hills, Karnataka///Vembanad, Kerala///Bandipur, Karnataka';

    if (theme_type == 1)
    return by_themes.split('///');
    else if (theme_type == 2)
    return by_geography.split('///');
}

function expand_layer_details(layer_id) {
    var expanded_div_id = layer_id + "_expanded";
    var div = document.getElementById(expanded_div_id);
    div.classList.toggle('hide');
}

function populateLayerPanel() {
    var layers = getAvailableLayers();
    var nav_pane = document.getElementById('nav-all-layers');

    var layer_pane_html = nav_pane.innerHTML;
    layers.forEach(function(layer){
        layer.thumbnail = ""
        layer_pane_html +=
            "<div class='layer-div no-select'>"
                +"<div id="+layer.name+" class='layer-name-div no-select' onclick='expand_layer_details(this.id)'>" + layer.title + "</div>"
                +"<div id="+layer.name+"_expanded class='layer-expanded hide'>"
                    +"<div class='layer-thumb'>"
                    // +"<img src="+map_thumbnails_url + layer.name +"_thumb.gif></img>"
                    +"</div>"
                    +"<div class='layer-desc'>"+layer.abstract+"</div>"
                    +"<i id=add_"+layer.name+"_button class='fa fa-plus-circle float-right pointer' onclick='add_layer_to_map(\""+layer.name+"\",\""+layer.title+"\")' style='font-size:36px;color:green;'></i>"
                    +"<i id=rem_"+layer.name+"_button class='fa fa-minus-circle float-right pointer hide' onclick='remove_layer_from_map(\""+layer.name+"\")' style='font-size:36px;color:red;'></i>"
                +"</div>"
            +"</div>"
    });
    nav_pane.innerHTML = layer_pane_html;
}

function toggleSideBar(){
    document.getElementById("nav").classList.toggle("nav--active");
}

function add_layer_to_map(layerName, layerTitle){

    if(active_layers.indexOf(layerName) != -1){
        // layer is already active
        alert("Layer " + layerName + " is already added to map");
        return;
    }
    var all_styles = getAvailableStyles(layerName)
    var default_style = all_styles[0];
    var style = getStyle(default_style);
    append_new_style(style);
    addLayerToSelectedTab(layerName, layerTitle, all_styles, style)
    document.getElementById("add_" + layerName + "_button").classList.toggle('hide');
    document.getElementById("rem_" + layerName + "_button").classList.toggle('hide');
    active_layers.push(layerName);
}

function append_new_style(style){
    /*if(get_map_style == null || get_map_style == {}){
        // if no style is currently present
        set_map_style(style);
    }
    else{*/

        Object.keys(style.sources).forEach(function(key){
            // if (!map.isSourceLoaded(key))
		style.sources[key].tiles = [style.sources[key].tiles[0].replace('6792', '8080')];//[baseUrl + "gwc/service/tms/1.0.0/" + getWorkspace() + "/" + style.layers[0].id + "/EPSG%3A900913/{z}/{x}/{y}"];
                map.addSource(key, style.sources[key]);
        })
        style.layers.forEach(function(layer){
            map.addLayer(layer)
        })
    // }
}

function addLayerToSelectedTab(layerName, layerTitle, all_styles, style){
    var selectedLayersPanel = document.getElementById('nav-selected-layers');
    var html = selectedLayersPanel.innerHTML;
    html +=  "<div id="+layerName+"_styler class='layer-div no-select'>"
            +   "<div class='layer-name-div no-select'>" + layerTitle + "</div>\n"
            +   "<div class='zoom-to-extent-div inline' style='background-image:url("+icons_url+"zoom-to-extent.png)'>"
            // +   "<img src="+icons_url+"zoom-to-extent.png style='margin: 0 4% 0 0;'></img>"
            +   "zoom to extent"
            +   "</div>"
            +   "<div style='width: 18%;float: left;font-size: 14px;opacity: 0.5;margin: 0 0 0 3%;'>opacity</div>"
            +   "<div class='slidecontainer inline'>"
            +       "<input id="+layerName+"_slider class='slider' type='range' min='1' max='100' step='5' value="+getOpacity(style)+"></input>"
            +   "</div>"
            +   "<div style='font-size:14px; padding-top: 7%;'>Style map by: "
            +       "<select class='style-selector'>"
            +           all_styles
            +       "</select>"
            +   "</div>"
            +"</div>"

    selectedLayersPanel.innerHTML = html;
}

function getOpacity(style){
    if (style.layers[0].type === "circle")
        return style.layers[0].paint['circle-opacity'] * 100
    else if (style.layers[0].type === "fill")
        return style.layers[0].paint['fill-opacity'] * 100
    else
        return 70
}

function remove_layer_from_map(layer_name){
    if (active_layers.indexOf(layer_name) == -1){
        alert("Layer " + layer_name + " is not present on the map");
    }
    console.log("Removing source " + layer_name)
    // map.isSourceLoaded(layer_name);
    if (map.getLayer(layer_name+'-highlighted') != undefined)
        map.removeLayer(layer_name+'-highlighted');
    map.removeLayer(layer_name);
    // map.removeSource(layer_name);
    document.getElementById("add_" + layer_name + "_button").classList.toggle('hide');
    document.getElementById("rem_" + layer_name + "_button").classList.toggle('hide');
    console.log(active_layers);
    active_layers.splice(layer_name, 1);
    active_layers.splice(layer_name+'-highlighted', 1);
    console.log(active_layers);
    console.log(map)
}

function openTab(evt, div_name) {
    // Declare all variables
    var i, tabcontent, tablinks;
    console.log('div name', div_name);
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(div_name).style.display = "block";
    evt.currentTarget.className += " active";
}

function showClickedFeature(event) {
    var features = map.queryRenderedFeatures(event.point);
    if (!features.length)
        clear_selected_features();
    hightlight_selected_feature(features);
    update_selected_feature_tree(features);
}

function hightlight_selected_feature(features) {
    for (var i = 0; i < features.length; i++){
        var feature = features[i];
        var layer = feature.layer.id
        console.log(feature)
        map.addLayer({
            'id': layer+'-highlighted',
            'type': 'line',
            'source': feature.layer.source,
            'source-layer': feature.layer.source,
            'paint': {
                'line-width': 1,
                'line-color': 'red'
            },
            'filter': ['in', '__mlocate__id', feature.properties.__mlocate__id]
        })
        if (active_layers.indexOf(layer+'-highlighted') == -1)
            active_layers.push(layer+'-highlighted');
    }
}

function clear_selected_features() {
    clear_selected_feature_tree();
}

function get_style_by(feature) {
    if (feature.layer.type == "fill")
        return feature.layer.paint['fill-color'].property;
    else if (feature.layer.type == "circle")
        return feature.layer.paint['circle-color'].property;
    else
        return null;
}

function clear_selected_feature_tree(){
    document.getElementById('features').innerHTML = "";
}

function update_selected_feature_tree(features) {
    var selected_features_json = {};
    var num_layers = features.length;
    for (var i = 0; i < num_layers; i++){
        selected_features_json[features[i].layer.id] = features[i].properties;
    }
    document.getElementById('features').innerHTML = renderJSON(selected_features_json);
}

function renderJSON(obj) {
    'use strict';
    var keys = [],
        retValue = "";
    for (var key in obj) {
        if (key.startsWith("__"))
            continue;
        if (typeof obj[key] === 'object') {
            retValue += "<div class='tree-expandable'>";
            retValue += "<div class='pointer no-select' onclick='toggleAllChildren(this.parentElement)'>" + key + "</div>";
            retValue += renderJSON(obj[key]);
            retValue += "</div>";
        } else {
            retValue += "<div class='tree-node hide'>" + key + " : " + obj[key] + "</div>";
        }

        keys.push(key);
    }
    return retValue;
}

function toggleAllChildren(div) {
    if (!div.hasChildNodes())
        return;
    var children = div.childNodes;
    // var isCollapsed = children[1].style.display == '';
    for (var i = 1; i < children.length; i++){
        children[i].classList.toggle('hide');
    }
}

function set_initial_zoom(map){
	initial_zoom = map.getZoom();
}

function syncMaps(master, google_map){
	var center = master.getCenter();
  	var zoom = master.getZoom();

  	google_map.setCenter(center);
	google_map.setZoom(zoom+1);

	// now if zoom level was non-integer, the google map
	// would have become blank.
	var new_zoom;
	if (zoom > initial_zoom)
		new_zoom = Math.ceil(zoom);
	else
		new_zoom = Math.floor(zoom);

	if (new_zoom === zoom)
		return;
	else{
		master.setZoom(new_zoom);
		google_map.setZoom(new_zoom + 1);
	}

}

function sync_map_move(map, gmap){
	var center = map.getCenter();
	gmap.setCenter(center);
}


export default {
  toggleSideBar: toggleSideBar,
  openTab: openTab,
  initMap: initMap
}

window.initMap                     =initMap
window.initializeMap               =initializeMap
window.get_host_name               =get_host_name
window.get_port                    =get_port
window.get_host                    =get_host
window.getWorkspace                =getWorkspace
window.get_map_style               =get_map_style
window.set_map_style               =set_map_style
window.getStyle                    =getStyle
window.getAvailableStyles          =getAvailableStyles
window.httpGetAsync                =httpGetAsync
window.print                       =print
window.getAvailableLayers          =getAvailableLayers
window.getLayerInfo_WMS_3          =getLayerInfo_WMS_3
window.getLatLonBBoxString         =getLatLonBBoxString
window.layer_changed               =layer_changed
window.style_changed               =style_changed
window.update_map                  =update_map
window.add_background_to_style     =add_background_to_style
window.getThemeNames               =getThemeNames
window.expand_layer_details        =expand_layer_details
window.populateLayerPanel          =populateLayerPanel
window.toggleSideBar               =toggleSideBar
window.add_layer_to_map            =add_layer_to_map
window.append_new_style            =append_new_style
window.addLayerToSelectedTab       =addLayerToSelectedTab
window.getOpacity                  =getOpacity
window.remove_layer_from_map       =remove_layer_from_map
window.openTab                     =openTab
window.showClickedFeature          =showClickedFeature
window.hightlight_selected_feature =hightlight_selected_feature
window.clear_selected_features     =clear_selected_features
window.get_style_by                =get_style_by
window.clear_selected_feature_tree =clear_selected_feature_tree
window.update_selected_feature_tree=update_selected_feature_tree
window.renderJSON                  =renderJSON
window.toggleAllChildren           =toggleAllChildren
window.set_initial_zoom=set_initial_zoom
window.syncMaps        =syncMaps
window.sync_map_move   =sync_map_move
