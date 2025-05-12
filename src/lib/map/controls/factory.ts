import { defaults as defaultControls } from 'ol/control';
import type { ControlOptions } from '../types/index';

export function createDefaultControls() {
  return defaultControls();
}

export function createDrawControl(options: ControlOptions) {
  return {
    map: options.map,
    position: options.position || 'top-left',
    className: options.className,
    style: options.style
  };
}

export function createLayerControl(options: ControlOptions) {
  return {
    map: options.map,
    position: options.position || 'top-right',
    className: options.className,
    style: options.style
  };
}

export function createSearchControl(options: ControlOptions) {
  return {
    map: options.map,
    position: options.position || 'top-right',
    className: options.className,
    style: options.style
  };
} 