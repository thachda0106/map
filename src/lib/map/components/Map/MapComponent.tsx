import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { type MapOptions } from '../../types';
import { SearchControl } from '../../controls/SearchControl';
import { LayerSwitcher } from '../../controls';
import { DrawFeatureControl } from '../../controls/DrawFeatureControl';
import { createDefaultControls } from '../../utils/controls';
import { createDefaultInteractions } from '../../utils/interactions';
import { Box } from '@mui/material';
import { ProjectionEnum } from '../../utils';
import { UploadImageControl } from '../../controls/UploadImageControl';

export const MapComponent: React.FC<MapOptions> = ({
  center = [0, 0],
  zoom = 2,
  controls = true,
  interactions = true,
  layers = [],
  className,
  style,
  projection = ProjectionEnum.EPSG_3857,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return
    };

    const map = new Map({
      target: mapRef.current,
      layers: layers,
      view: new View({
        center,
        zoom,
        projection,
      }),
      controls: controls ? createDefaultControls() : [],
      interactions: interactions ? createDefaultInteractions() : undefined
    });

    setMap(map);
  }, [controls, interactions, layers, center, zoom, projection]);

  return (
    <Box style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
      <Box
        ref={mapRef} 
        className={className}
        style={{ width: '100%', height: '100%' }}
      />
      {map && (
        <>
          <SearchControl map={map} />
          <LayerSwitcher map={map} />
          <UploadImageControl map={map} />
          <DrawFeatureControl map={map} />
        </>
      )}
    </Box>
  );
}; 