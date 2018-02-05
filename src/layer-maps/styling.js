var mapboxgl = require('mapbox-gl')
var GoogleMapsLoader = require('google-maps')
var Base64 = require('base-64')
var encode = Base64.encode
// var encode = Base64.default.encode
// var set_initial_zoom from './sync'
var sync = require('./sync.js')
var set_initial_zoom = sync.set_initial_zoom
var syncMaps = sync.syncMaps
var sync_map_move = sync.sync_map_move

var baseUrl = "http://" + get_host() + "/geoserver/"
var workspace_name = 'biodiv'
var geoserver_user = ''
var geoserver_pass = ''
var baseUrl_with_auth = "http://" + geoserver_user + ":" + geoserver_pass + "@" + "localhost:6792/geoserver/"
var style_file_json_url = "http://localhost:6792/geoserver/styles/"

var current_selected_layer = null;
var current_selected_style = null;

var map_style = null;
var active_layers = [];

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
                "tiles": ["http://localhost:6792/geoserver/gwc/service/tms/1.0.0/biodiv:lyr_104_india_states_census01@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf"]
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
    return '6792';
}

function get_host(){
    return get_host_name() + ":" + get_port();
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
    var style_file_url = style_file_json_url + style_name + ".json"
    var style = httpGetAsync(style_file_url);
    return JSON.parse(style);
}

// gets all available styles for a layer
function getAvailableStyles(layer){
    var style_url = baseUrl + "rest/layers/" + layer + "/styles.json";
    var styles = httpGetAsync(style_url);
    var styles_json = JSON.parse(styles);

    var all_styles = styles_json.styles.style.map(feature => feature.name);
    return all_styles;
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, false);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function httpGetAsync(theUrl)
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
    xmlHttp.setRequestHeader("Authorization", "Basic " + encode(geoserver_user + ":" + geoserver_pass));
    // xmlHttp.setRequestHeader('Access-Control-Allow-Origin', 'localhost:3000')
    xmlHttp.send();
    console.log(xmlHttp.responseText);
    return xmlHttp.responseText;
}

function print(str){
	console.log("Print:" + str);
}

function getAvailableLayers(){
	var url = baseUrl_with_auth + "rest/workspaces/" + workspace_name + "/featuretypes.json"
    print(url);
	var layers = httpGetAsync(url)
	var layers_json = JSON.parse(layers);

    // extract list of all available layers
    var all_layers = layers_json.featureTypes.featureType.map(feature => feature.name);
    return all_layers
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function update_map(style){
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

// function getLayersByTheme(theme) {
//     var url = 'http://' + 'localhost:6792' + '/geoserver/ows';
//
//     var params = {
//         request:'getLayersByTheme',
//         service:'csw',
//         version:'1.0.0',
//         theme: theme
//     };
//
//     var layers = [];
//     $.ajax({
//         url: url,
//         type: 'GET',
//         async: false,
//         cache: false,
//         timeout: 30000,
//         data: params,
//         dataType: 'text',
//         error: function(){
//             return true;
//         },
//         success: function(data, msg){
//             if (parseFloat(msg)){
//                 return false;
//             } else {
//                 layers = data.split('///');
//                 return true;
//             }
//         }
//     });
//
//     return layers;
// }

function populateLayerPanel() {
    var layers = getAvailableLayers();
    var nav_pane = document.getElementById('nav-all-layers');

    var layer_pane_html = nav_pane.innerHTML;
    layers.forEach(function(layer){
        layer_pane_html +=
            "<div class='layer-div no-select'>"
                +"<div id="+layer+" class='layer-name-div no-select' onclick='expand_layer_details(this.id)'>" + layer + "</div>\n"
                +"<div id="+layer+"_expanded class='layer-expanded hide'>"
                    +"<div><img class='layer-thumb'></img></div>"
                    +"<div class='layer-desc'></div>"
                    +"<i id=add_"+layer+"_button class='fa fa-plus-circle float-right pointer' onclick='add_layer_to_map(\""+layer+"\")' style='font-size:36px;color:green;'></i>"
                    +"<i id=rem_"+layer+"_button class='fa fa-minus-circle float-right pointer hide' onclick='remove_layer_from_map(\""+layer+"\")' style='font-size:36px;color:red;'></i>"
                +"</div>"
            +"</div>"
    });
    nav_pane.innerHTML = layer_pane_html;
}

function expand_layer_details(layer_id) {
    var expanded_div_id = layer_id + "_expanded";
    var div = document.getElementById(expanded_div_id);
    div.classList.toggle('hide');
}

function toggleSideBar(){
    document.getElementById("nav").classList.toggle("nav--active");
}

function add_layer_to_map(layer){
    if(active_layers.indexOf(layer) != -1){
        // layer is already active
        alert("Layer " + layer + " is already added to map");
        return;
    }
    var style_name = getAvailableStyles(layer)[0];
    var style = getStyle(style_name);
    console.log(style_name);
    append_new_style(style);
    document.getElementById("add_" + layer + "_button").classList.toggle('hide');
    document.getElementById("rem_" + layer + "_button").classList.toggle('hide');
    active_layers.push(layer);
}

function append_new_style(style){
    if(get_map_style == null || get_map_style == {}){
        // if no style is currently present
        set_map_style(style);
    }
    else{

        Object.keys(style.sources).forEach(function(key){
            if (!map.isSourceLoaded(key)) {
            map.addSource(key, style.sources[key]);
            console.log("Adding source " + key);
            }
        })
        style.layers.forEach(function(layer){
            map.addLayer(layer)
        })
    }
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

function openTab(evt, tab_name) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    /*tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }*/

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    // document.getElementById(cityName).style.display = "block";
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

export default {
  toggleSideBar: toggleSideBar,
  openTab: openTab,
  initMap: initMap
}
