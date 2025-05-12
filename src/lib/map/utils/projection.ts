import { fromLonLat, toLonLat } from 'ol/proj';
export { fromLonLat, toLonLat };

export const ProjectionEnum = {
  EPSG_3857: 'EPSG:3857',
  EPSG_4326: 'EPSG:4326',
} as const;

export type ProjectionEnum = typeof ProjectionEnum[keyof typeof ProjectionEnum];