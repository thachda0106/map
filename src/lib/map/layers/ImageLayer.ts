import ImageLayer from 'ol/layer/Image';
import type ImageSource from 'ol/source/Image';

export function createImageLayer(source: ImageSource, zIndex = 1000) {
  return new ImageLayer({ source, zIndex });
} 