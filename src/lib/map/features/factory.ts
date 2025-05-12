import { createBox } from 'ol/interaction/Draw.js';
import type { DrawFeatureOptions, DrawFeatureType } from './types';
import { pointStyle } from './point/PointStyle';
import { lineStyle } from './line/LineStyle';
import { polygonStyle } from './polygon/PolygonStyle';
import { rectangleStyle } from './rectangle/RectangleStyle';
import { circleStyle } from './circle/CircleStyle';
import { freehandStyle } from './freehand/FreehandStyle';

export function createDrawFeatureOptions(type: DrawFeatureType): DrawFeatureOptions {
  switch (type) {
    case 'Point':
      return {
        type: 'Point',
        style: pointStyle
      };
    case 'LineString':
      return {
        type: 'LineString',
        style: lineStyle
      };
    case 'Polygon':
      return {
        type: 'Polygon',
        style: polygonStyle
      };
    case 'Rectangle':
      return {
        type: 'Circle',
        style: rectangleStyle,
        geometryFunction: createBox()
      };
    case 'Circle':
      return {
        type: 'Circle',
        style: circleStyle
      };
    case 'Freehand':
      return {
        type: 'Polygon',
        style: freehandStyle,
        freehand: true
      };
    default:
      return {
        type: 'Point',
        style: pointStyle
      };
  }
} 