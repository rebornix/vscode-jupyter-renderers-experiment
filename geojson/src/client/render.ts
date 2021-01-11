/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

// We've set up this sample using CSS modules, which lets you import class
// names into JavaScript: https://github.com/css-modules/css-modules
// You can configure or change this in the webpack.config.js file.
import './style.css';
import "leaflet/dist/leaflet.css";
import * as leaflet from 'leaflet';
// import leaflet from 'leaflet';
import { NotebookRendererApi } from 'vscode-notebook-renderer';

interface IRenderInfo {
  container: HTMLElement;
  mimeType: string;
  data: any;
  notebookApi: NotebookRendererApi<unknown>;
}

/**
 * 
 * "application/geo+json": {
       "geometry": {
        "coordinates": [
         -118.4563712,
         34.0163116
        ],
        "type": "Point"
       },
       "type": "Feature"
      },
 */

/**
 * The url template that leaflet tile layers.
 * See http://leafletjs.com/reference-1.0.3.html#tilelayer
 */
const URL_TEMPLATE: string =
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

/**
* The options for leaflet tile layers.
* See http://leafletjs.com/reference-1.0.3.html#tilelayer
*/
const LAYER_OPTIONS: leaflet.TileLayerOptions = {
attribution:
  'Map data (c) <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
minZoom: 0,
maxZoom: 18
};


// This function is called to render your contents.
export function render({ container, mimeType, data, notebookApi }: IRenderInfo) {
  // Format the JSON and insert it as <pre><code>{ ... }</code></pre>
  // Replace this with your custom code!
  const outputNode = document.createElement('div');
  container.appendChild(outputNode);
  outputNode.style.height = '360px';

  const _map = leaflet.map(outputNode, {
    trackResize: false
  });

  leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(_map);

  const _geoJSONLayer= leaflet.geoJSON(data, {
      onEachFeature: function (feature: any, layer: any) {
        if (feature.properties) {
          var popupContent = '<table>';
          for (var p in feature.properties) {
            popupContent += '<tr><td>' + p + ':</td><td><b>' + feature.properties[p] + '</b></td></tr>';
          }
          popupContent += '</table>';
          // TODO, sanitizer
          layer.bindPopup(popupContent);
        }
      }
    }).addTo(_map);

    setTimeout(() => {
      _map.invalidateSize();
      _map.fitBounds(_geoJSONLayer.getBounds());
    }, 0);

    _map.invalidateSize();
    _map.fitBounds(_geoJSONLayer.getBounds());

  notebookApi.onDidReceiveMessage(msg => {
    console.log('got a message from the extension', msg);
  });
}

if (module.hot) {
  module.hot.addDisposeHandler(() => {
    // In development, this will be called before the renderer is reloaded. You
    // can use this to clean up or stash any state.
  });
}
