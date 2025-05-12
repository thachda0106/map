import { Layer } from 'ol/layer';
import { Control } from 'ol/control';
import { Interaction } from 'ol/interaction';
import type { CSSProperties } from 'react';
import type Map from 'ol/Map';
import type View from 'ol/View';
import type VectorSource from 'ol/source/Vector';
import type { StyleLike } from 'ol/style/Style';
import type { Coordinate } from 'ol/coordinate';
import type { ProjectionEnum } from './utils';

export interface MapOptions {
  center?: Coordinate;
  zoom?: number;
  controls?: boolean;
  interactions?: boolean;
  layers?: Layer[];
  className?: string;
  style?: CSSProperties;
  projection?: ProjectionEnum;
}

export interface MapInstance {
  map: Map;
  view: View;
  layers: Layer[];
  controls: Control[];
  interactions: Interaction[];
}

export interface DrawOptions {
  source: VectorSource;
  type: GeometryType;
  style?: StyleLike;
}

export type GeometryType = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon'; 