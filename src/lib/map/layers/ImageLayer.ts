import ImageLayer from 'ol/layer/Image';
import type ImageSource from 'ol/source/Image';

export function createImageLayer(options: { source: ImageSource; zIndex?: number }) {
  return new ImageLayer({ source: options.source, zIndex: options.zIndex || 0 });
}