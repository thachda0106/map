import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';

export function createXYZLayer(options: { url: string, maxZoom?: number }) {
  return new TileLayer({
    source: new XYZ({
      url: options.url,
      maxZoom: options.maxZoom ?? 19,
    }),
  });
}

export function createDefaultLayers() {
  return [
    createXYZLayer({ url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png', maxZoom: 19 }),
  ];
} 