import VectorLayer from 'ol/layer/Vector';
import type VectorSource from 'ol/source/Vector';

export function createVectorLayer(source: VectorSource, zIndex = 1000) {
  return new VectorLayer({ source, zIndex });
} 