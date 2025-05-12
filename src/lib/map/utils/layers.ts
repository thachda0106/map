import { createOSMLayer } from "../layers";

export function createDefaultLayers() {
  const osmLayer = createOSMLayer();
  osmLayer.set('title', 'OpenStreetMap');
  osmLayer.setVisible(true);

  return [
    osmLayer
  ];
}