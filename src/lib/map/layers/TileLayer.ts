import TileLayer from 'ol/layer/Tile';
import type TileSource from 'ol/source/Tile';

export function createTileLayer(source: TileSource, zIndex = 0) {
  return new TileLayer({ source, zIndex });
} 