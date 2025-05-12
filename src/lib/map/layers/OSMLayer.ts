import { OSM } from "ol/source";
import { createTileLayer } from "./TileLayer";

export function createOSMLayer(options: Record<string, unknown> = {}) {
  return createTileLayer({ source: new OSM(options) })
}