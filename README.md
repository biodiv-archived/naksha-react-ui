<h1><a id="nakshareactui_0"></a>naksha-react-ui</h1>
<p>Naksha-react-ui is a ui library in react for better visualization of geohashes (from elasticsearch or <a href="https://github.com/strandls/naksha">https://github.com/strandls/naksha</a>) on a map. It can be embedded into an existing react project (<a href="https://indiabiodiversity.org/observation/list?view=map">https://indiabiodiversity.org/observation/list?view=map</a>) or can be used as a standalone system.</p>
<h3><a id="Installation_4"></a>Installation</h3>
<p>Download the zip or clone the repository</p>
<pre><code class="language-sh">$ <span class="hljs-built_in">cd</span> naksha-react-ui
$ npm install
$ npm run build
</code></pre>
<h3><a id="Example_14"></a>Example</h3>
<pre><code class="language-sh">import {Component} from <span class="hljs-string">'react'</span>;
import Naksha from <span class="hljs-string">'naksha-react-ui'</span>;

class NakshaReactUIDemo extends Component{

  constructor(props) {
    super(props);
    this.state={
      flag:<span class="hljs-literal">false</span>
    }
  }

  <span class="hljs-function"><span class="hljs-title">componentDidMount</span></span>() {
    this.setState({
      flag:<span class="hljs-literal">true</span>
    })
  }

  <span class="hljs-function"><span class="hljs-title">map</span></span>() {
    <span class="hljs-built_in">return</span> (
      &lt;Naksha.MapHolder url=<span class="hljs-string">"<http://localhost:8081/naksha/services/geohash-aggregation/observation/observation"></span>
           location_field=<span class="hljs-string">"location"</span>
           map_container=<span class="hljs-string">"map2"</span>
           restrict_to_bounds={\[[<span class="hljs-number">68</span>, <span class="hljs-number">5.75</span>], [<span class="hljs-number">98</span>, <span class="hljs-number">37.5</span>]]}
           url_response_geohash_field=<span class="hljs-string">"geohashAggregation"</span>
           url_response_filtered_geohash_field=<span class="hljs-string">"viewFilteredGeohashAggregation"</span>
           color_scheme=<span class="hljs-string">"YlOrRd"</span>
           no_legend_stops=<span class="hljs-string">"6"</span>
           is_legend_stops_data_driven={<span class="hljs-literal">true</span>}
      />
    )
  }

  <span class="hljs-function"><span class="hljs-title">render</span></span>(){
    <span class="hljs-built_in">return</span>(
      &lt;div style={{position:<span class="hljs-string">'relative'</span>}}>
        {this.state.flag ? this.map() : null}
        &lt;div id=<span class="hljs-string">"map2"</span> style={{height:<span class="hljs-string">'-webkit-fill-available'</span>}}>
        &lt;/div>
      &lt;/div>
    )
  }
}
</code></pre>

<h3><a id="Component_and_its_properties_62"></a>Component and its properties</h3>
<h4><a id="MapHolder_64"></a>MapHolder</h4>
<ul>
<li><strong>url</strong> - GET url for geohash data (This can either be Naksha url or ElasticSearch url).</li>
<li><strong>location_field</strong> - the field which has geo_point location data.</li>
<li><strong>map_container</strong> - The id of div which will hold the map.</li>
<li><strong>restrict_bounds</strong> - The bounding box in which the view of map has to be restricted. (Optional)</li>
<li><strong>url_response_geohash_field</strong> - The field in the response data which has geohash aggregation of the form- “geohash-grid”: {“buckets”: [{“key”: “t”, “doc_count”: 1200310}, {“key”: “w”, “doc_count”: 109702}]}</li>
<li><strong>url_response_filtered_geohash_field</strong> - The field in the response data which has geohash filtered in some proportion to current visible boundary of map. (Optional)</li>
<li><strong>color_scheme</strong> - Legend color scheme. One of <a href="https://github.com/strandls/naksha-react-ui/blob/master/src/colorbrewer/colorbrewer.js">https://github.com/strandls/naksha-react-ui/blob/master/src/colorbrewer/colorbrewer.js</a>.</li>
<li><strong>no_legend_stops</strong> - Number of buckets in which all buckets of response geohash aggregation will be merged into. Or number of legends(ranges) in which the view data will fall. Must be in the range 3-9.</li>
<li><strong>is_legend_stops_data_driven</strong> - True if we want to define legend range such that each range has nearly same number of buckets. False if we want to have equally distributed ranges.</li>
<li><strong>on_click</strong> - The function which should be called on clicking data square on map. (Optional)</li>
</ul>
<h4><a id="IndiaBoundaries_77"></a>IndiaBoundaries</h4>
<p>Provide India boundaries to mapboxgl maps.</p>
<pre><code class="language-sh">import Naksha from <span class="hljs-string">'naksha-react-ui'</span>;

// map is new  mapboxgl.Map
map.on(<span class="hljs-string">'load'</span>, <span class="hljs-function"><span class="hljs-title">function</span></span>() {
    Naksha.IndiaBoundaries(map)
})
</code></pre>

<h4><a id="Layers_90"></a>Layers</h4>
<p>Display map layers from <a href="https://github.com/strandls/naksha">https://github.com/strandls/naksha</a> on a mapboxgl map. Demo- <a href="https://indiabiodiversity.org/map">https://indiabiodiversity.org/map</a></p>
<h4><a id="NewLayerComponent_93"></a>NewLayerComponent</h4>
<p>Ability to add new layers to <a href="https://github.com/strandls/naksha">https://github.com/strandls/naksha</a>.</p>
<h2><a id="License_96"></a>License</h2>
<p>Apache License 2.0</p>
