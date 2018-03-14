'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BackgroundControl = function () {
    function BackgroundControl(params) {
        _classCallCheck(this, BackgroundControl);

        this.styles = [];
        for (var i = 0; i < params.length; i++) {
            this.styles.push({
                name: params[i].name,
                style: params[i].style
            });
        }
    }

    _createClass(BackgroundControl, [{
        key: 'onAdd',
        value: function onAdd(map) {
            this._map = map;
            var _this = this;

            this._btn = document.createElement('button');
            this._btn.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-backgroundtoggle';
            this._btn.type = 'button';
            this._btn['aria-label'] = 'Toggle Background';
            this._btn.onclick = function () {
                // sources added by user
                var addedSources = map.getStyle().sources;
                // layers added by user
                var addedLayers = map.getStyle().layers.filter(function (layer) {
                    return layer.source !== 'mapbox' && layer.source !== 'world' && layer.id !== 'background';
                });

                // go to next style
                var currentStyleName = map.getStyle().name;
                var styleIndex = _this.styles.findIndex(function (x) {
                    return x.name === currentStyleName;
                });
                map.setStyle(_this.styles[(styleIndex + 1) % _this.styles.length].style, { diff: false });

                map.on('style.load', function () {
                    // add all sources back
                    Object.keys(addedSources).forEach(function (source) {
                        if (!map.getSource(source)) map.addSource(source, addedSources[source]);
                    });
                    // add all layers back
                    addedLayers.forEach(function (layer) {
                        map.addLayer(layer);
                    });
                });
            };

            this._container = document.createElement('div');
            this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
            this._container.appendChild(this._btn);

            return this._container;
        }
    }, {
        key: 'onRemove',
        value: function onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
    }]);

    return BackgroundControl;
}();

exports.default = BackgroundControl;