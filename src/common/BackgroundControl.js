export default class BackgroundControl {

    constructor(params) {
      this.styles = [];
      for (let i=0; i<params.length; i++) {
        this.styles.push({
          name : params[i].name,
          style : params[i].style
        });
      }
    }

    onAdd(map) {
        this._map = map;
        let _this = this;

        this._btn = document.createElement('button');
        this._btn.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-backgroundtoggle';
        this._btn.type = 'button';
        this._btn['aria-label'] = 'Toggle Background';
        this._btn.onclick = function() {
            // sources added by user
            var addedSources = map.getStyle().sources;
            // layers added by user
            var addedLayers  = map.getStyle().layers.filter(layer => layer.source !== 'mapbox' && layer.source !== 'world' && layer.id !== 'background');

            // go to next style
            let currentStyleName = map.getStyle().name;
            let styleIndex = _this.styles.findIndex(x => x.name === currentStyleName)
            map.setStyle(_this.styles[(styleIndex + 1)%_this.styles.length].style, {diff: false})

            map.on('style.load', function() {
              // add all sources back
              Object.keys(addedSources).forEach(function(source) {
                  if(!map.getSource(source))
                    map.addSource(source, addedSources[source]);
              });
              // add all layers back
              addedLayers.forEach(function(layer) {
                  map.addLayer(layer);
              });
            });
        };

        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        this._container.appendChild(this._btn);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
