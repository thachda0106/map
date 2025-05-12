import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import TileSource from 'ol/source/Tile';
import type { LayerOptions } from '../types/index';

export function createVectorLayer(options: LayerOptions): VectorLayer<VectorSource> {
  return new VectorLayer({
    source: options.source,
    style: options.style,
    zIndex: options.zIndex,
    visible: options.visible,
    properties: options.properties
  });
}

export function createTileLayer(options: LayerOptions & { source: TileSource }): TileLayer {
  return new TileLayer({
    source: options.source,
    zIndex: options.zIndex,
    visible: options.visible,
    properties: options.properties
  });
} 