import { MapComponent } from './lib/map/components/Map';
import { fromLonLat } from 'ol/proj';
import { createStadiaVectorTileSource, createVectorTileLayer, createXYZLayer } from './lib/map/layers';
import 'ol/ol.css';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { createDefaultLayers } from './lib/map/utils/layers';

const App = () => {
  const layers = useMemo(() => {
    const layers = createDefaultLayers();

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

    const stadia = createVectorTileLayer({
      source: createStadiaVectorTileSource()
    });
    stadia.set('title', 'Stadia');
    stadia.setVisible(false);

    return [...layers, stamenToner, cartoPositron, openTopoMap, stadia]
  }, [])

  return (
    <Box style={{ width: '100%', height: '100vh' }}>
      <MapComponent
        center={fromLonLat([139.6917, 35.6895])}
        zoom={12}
        controls={true}
        interactions={true}
        layers={layers}
      />
    </Box>
  );
}

export default App;
