import React from 'react';
import { MapComponent } from './lib/map/components/Map';
import { fromLonLat } from 'ol/proj';
import { createXYZLayer, createDefaultLayers } from './lib/map/layers';
import 'ol/ol.css';

// OSM layer mặc định (visible: true)
const osmLayer = createDefaultLayers()[0];
osmLayer.set('title', 'OpenStreetMap');
osmLayer.setVisible(true);

const stamenToner = createXYZLayer({
  url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
  maxZoom: 20,
});
stamenToner.set('title', 'Stamen Toner');
stamenToner.setVisible(false);

const cartoPositron = createXYZLayer({
  url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  maxZoom: 20,
});
cartoPositron.set('title', 'CartoDB Positron');
cartoPositron.setVisible(false);

const openTopoMap = createXYZLayer({
  url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
  maxZoom: 17,
});
openTopoMap.set('title', 'OpenTopoMap');
openTopoMap.setVisible(false);

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MapComponent
        center={fromLonLat([139.6917, 35.6895])}
        zoom={12}
        controls={true}
        interactions={true}
        layers={[osmLayer, stamenToner, cartoPositron, openTopoMap]}
      />
    </div>
  );
}

export default App;
