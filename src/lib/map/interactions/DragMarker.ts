import PointerInteraction from 'ol/interaction/Pointer';
import type Map from 'ol/Map';
import type Feature from 'ol/Feature';
import type Point from 'ol/geom/Point';

export function createDragMarkerInteraction(map: Map, marker: Feature<Point>, onDrag?: (coords: number[]) => void) {
  let isDragging = false;
  const interaction = new PointerInteraction({
    handleDownEvent: (evt) => {
      if (map.forEachFeatureAtPixel(evt.pixel, f => f) === marker) {
        isDragging = true;
        return true;
      }
      return false;
    },
    handleDragEvent: (evt) => {
      if (isDragging) {
        marker.getGeometry()?.setCoordinates(evt.coordinate);
        onDrag?.(evt.coordinate);
      }
    },
    handleUpEvent: () => {
      isDragging = false;
      return false;
    }
  });
  map.addInteraction(interaction);
  return interaction;
} 