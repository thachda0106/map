import XYZ from 'ol/source/XYZ';
import { createTileLayer } from './TileLayer';

export function createXYZLayer(options: { url: string, maxZoom?: number }) {
  return createTileLayer({
    source: new XYZ({
      url: options.url,
      maxZoom: options.maxZoom || 19,
    })
  });
}