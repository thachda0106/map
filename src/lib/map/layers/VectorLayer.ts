import VectorLayer from 'ol/layer/Vector';
import type VectorSource from 'ol/source/Vector';

export function createVectorLayer(options: { source: VectorSource; zIndex?: number }) {
  return new VectorLayer({ source: options.source, zIndex: options.zIndex });
}
