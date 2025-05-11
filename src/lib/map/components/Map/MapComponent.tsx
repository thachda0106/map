import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import type { MapOptions } from '../../types';
import { SearchControl } from '../../controls/SearchControl';
import { LayerSwitcher, UploadImageControl } from '../../controls';
import { createDefaultControls } from '../../utils/controls';
import { createDefaultInteractions } from '../../utils/interactions';

export const MapComponent: React.FC<MapOptions> = ({
  center = [0, 0],
  zoom = 2,
  controls = true,
  interactions = true,
  layers = [],
  className,
  style
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: layers,
      view: new View({
        center,
        zoom,
        projection: 'EPSG:3857'
      }),
      controls: controls ? createDefaultControls() : [],
      interactions: interactions ? createDefaultInteractions() : undefined
    });

    mapInstance.current = map;
    setMap(map);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, []); // Only run once on mount

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
      <div 
        ref={mapRef} 
        className={className}
        style={{ width: '100%', height: '100%' }}
      />
      {map && (
        <>
          <SearchControl map={map} />
          <LayerSwitcher map={map} />
          <UploadImageControl map={map} />
        </>
      )}
    </div>
  );
}; 