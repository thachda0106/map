import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import type { StyleLike } from 'ol/style/Style';
import MVT from 'ol/format/MVT';

export function createVectorTileLayer(options: {
  source: VectorTileSource;
  zIndex?: number;
  style?: StyleLike;
}) {
  return new VectorTileLayer({
    source: options.source,
    zIndex: options.zIndex || 0,
    style: options.style
  });
}

export function createStadiaVectorTileSource() {
  return new VectorTileSource({
    format: new MVT(),
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.pbf'
  });
}

export function createMapTilerVectorTileSource(apiKey: string) {
  return new VectorTileSource({
    format: new MVT(),
    url: `https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=${apiKey}`
  });
}

export function createMapboxVectorTileSource(accessToken: string) {
  return new VectorTileSource({
    format: new MVT(),
    url: `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=${accessToken}`
  });
}
