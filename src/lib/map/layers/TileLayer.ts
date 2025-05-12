import TileLayer from 'ol/layer/Tile';
import type TileSource from 'ol/source/Tile';

export function createTileLayer(options: { source: TileSource; zIndex?: number }) {
  return new TileLayer({ source: options.source, zIndex: options.zIndex || 0 });
} 