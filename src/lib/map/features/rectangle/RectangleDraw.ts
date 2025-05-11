import Draw, { createBox } from 'ol/interaction/Draw.js';
import type Map from 'ol/Map';
import type VectorSource from 'ol/source/Vector';

export function addRectangleDrawInteraction(map: Map, source: VectorSource) {
  const interaction = new Draw({
    source,
    type: 'Circle', // OpenLayers uses Circle with geometryFunction for rectangle
    geometryFunction: createBox(),
  });
  map.addInteraction(interaction);
  return interaction;
} 