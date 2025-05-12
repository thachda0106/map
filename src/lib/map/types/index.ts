import type { Layer } from 'ol/layer';
import type { Control } from 'ol/control';
import type { Interaction } from 'ol/interaction';
import type { CSSProperties } from 'react';
import type Map from 'ol/Map';
import type View from 'ol/View';
import type VectorSource from 'ol/source/Vector';
import type { StyleLike } from 'ol/style/Style';
import type { Coordinate } from 'ol/coordinate';
import type { ProjectionEnum } from '../utils/projection';

// Map related types
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

// Layer related types
export interface LayerOptions {
  source: VectorSource;
  style?: StyleLike;
  zIndex?: number;
  visible?: boolean;
  properties?: Record<string, unknown>;
}

// Control related types
export interface ControlOptions {
  map: Map;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  style?: CSSProperties;
}

// Interaction related types
export interface InteractionOptions {
  map: Map;
  active?: boolean;
  properties?: Record<string, unknown>;
}

// Draw related types
export interface DrawOptions {
  source: VectorSource;
  type: GeometryType;
  style?: StyleLike;
}

export type GeometryType = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon'; 