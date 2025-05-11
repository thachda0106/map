import Draw from 'ol/interaction/Draw.js';
import type Map from 'ol/Map';
import type VectorSource from 'ol/source/Vector';

export function addLineDrawInteraction(map: Map, source: VectorSource) {
  const interaction = new Draw({
    source,
    type: 'LineString',
  });
  map.addInteraction(interaction);
  return interaction;
} 