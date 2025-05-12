import { defaults as defaultInteractions } from 'ol/interaction';
import Draw from 'ol/interaction/Draw';
import type { InteractionOptions } from '../types/index';
import type VectorSource from 'ol/source/Vector';
import type { StyleLike } from 'ol/style/Style';
import type { GeometryType } from '../types/index';

export function createDefaultInteractions(options?: InteractionOptions) {
  const interactions = defaultInteractions();
  if (options?.active !== undefined) {
    interactions.forEach(i => i.setActive(options.active!));
  }
  return interactions;
}

export function createDrawInteraction(options: InteractionOptions & {
  source: VectorSource;
  type: GeometryType;
  style?: StyleLike;
  freehand?: boolean;
  geometryFunction?: Draw['geometryFunction'];
}) {
  const interaction = new Draw({
    source: options.source,
    type: options.type,
    style: options.style,
    freehand: options.freehand,
    geometryFunction: options.geometryFunction
  });

  if (options.active !== undefined) {
    interaction.setActive(options.active);
  }

  return interaction;
} 