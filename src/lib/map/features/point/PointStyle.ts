import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';

export const pointStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({ color: '#1976d2' }),
    stroke: new Stroke({ color: '#fff', width: 2 })
  })
}); 