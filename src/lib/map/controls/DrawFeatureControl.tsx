import React, { useRef, useState } from 'react';
import type Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw, { createBox } from 'ol/interaction/Draw.js';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TimelineIcon from '@mui/icons-material/Timeline';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import GestureIcon from '@mui/icons-material/Gesture';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import type { Geometry } from 'ol/geom';
import { Point, LineString, Polygon, Circle } from 'ol/geom';
import type { Feature } from 'ol';

interface DrawFeatureControlProps {
  map: Map;
}

export const DrawFeatureControl: React.FC<DrawFeatureControlProps> = ({ map }) => {
  const [drawType, setDrawType] = useState<string | null>(null);
  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
  const drawLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Add draw layer once
  React.useEffect(() => {
    if (!drawLayerRef.current) {
      const drawSource = new VectorSource();
      const drawLayer = new VectorLayer({ 
        source: drawSource, 
        zIndex: 9999,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#ff0000',
            width: 3,
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ff0000',
            }),
          }),
        }),
      });
      map.addLayer(drawLayer);
      drawLayerRef.current = drawLayer;
      console.log('Draw layer added:', drawLayer);

      // Add click handler for features
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
        if (feature) {
          console.log('Clicked feature:', feature);
          evt.preventDefault();
        }
      });
    }
  }, [map]);

  // Handle draw type change
  React.useEffect(() => {
    if (drawInteraction) {
      map.removeInteraction(drawInteraction);
      setDrawInteraction(null);
    }
    if (!drawType || !drawLayerRef.current) return;

    console.log('Creating draw interaction for type:', drawType);
    let type = drawType;
    let freehand = false;
    if (drawType === 'Rectangle') {
      type = 'Circle'; // OpenLayers uses Circle with geometryFunction for rectangle
    }
    if (drawType === 'Freehand') {
      type = 'Polygon';
      freehand = true;
    }

    const source = drawLayerRef.current.getSource();
    if (!source) {
      console.error('Draw source is null');
      return;
    }

    const interaction = new Draw({
      source: source,
      type: type as 'Point' | 'LineString' | 'Polygon' | 'Circle',
      freehand,
      geometryFunction: drawType === 'Rectangle'
        ? createBox()
        : undefined,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ff0000',
          width: 3,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ff0000',
          }),
        }),
      }),
    });

    // Add event listeners for debugging
    interaction.on('drawstart', (event) => {
      console.log('Draw started:', event);
    });

    interaction.on('drawend', (event) => {
      console.log('Draw ended:', event);
      const feature = event.feature as Feature<Geometry>;
      console.log('Drawn feature:', feature);
      const geometry = feature.getGeometry();
      console.log('Feature geometry:', geometry);
      if (geometry) {
        if (geometry instanceof Point || 
            geometry instanceof LineString || 
            geometry instanceof Polygon || 
            geometry instanceof Circle) {
          console.log('Feature coordinates:', geometry.getCoordinates());
        }
      }
      console.log('Feature count in source:', source.getFeatures().length);
      setDrawType(null);
      map.removeInteraction(interaction);
      setDrawInteraction(null);
    });

    map.addInteraction(interaction);
    setDrawInteraction(interaction);
    console.log('Draw interaction added:', interaction);
  }, [drawType, map]);

  const handleDrawTypeChange = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
    console.log('Draw type changed to:', newType);
    setDrawType(newType);
  };

  return (
    <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1200, background: '#fff', borderRadius: 1, p: 1, boxShadow: 2 }}>
      <ToggleButtonGroup
        value={drawType}
        exclusive
        onChange={handleDrawTypeChange}
        size="small"
      >
        <ToggleButton value="Point" title="Draw Point"><RadioButtonUncheckedIcon /></ToggleButton>
        <ToggleButton value="LineString" title="Draw Line"><TimelineIcon /></ToggleButton>
        <ToggleButton value="Polygon" title="Draw Polygon"><ChangeHistoryIcon /></ToggleButton>
        <ToggleButton value="Rectangle" title="Draw Rectangle"><CropSquareIcon /></ToggleButton>
        <ToggleButton value="Circle" title="Draw Circle"><PanoramaFishEyeIcon /></ToggleButton>
        <ToggleButton value="Freehand" title="Draw Freehand Polygon"><GestureIcon /></ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}; 