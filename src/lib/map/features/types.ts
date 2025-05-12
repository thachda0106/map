import type { Style } from 'ol/style';
import type { Type } from 'ol/geom/Geometry';
import type { GeometryFunction } from 'ol/interaction/Draw';

export interface DrawFeatureOptions {
  type: Type;
  style: Style;
  freehand?: boolean;
  geometryFunction?: GeometryFunction;
}

export type DrawFeatureType = 'Point' | 'LineString' | 'Polygon' | 'Rectangle' | 'Circle' | 'Freehand'; 