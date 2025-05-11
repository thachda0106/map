import React, { useEffect, useRef, useState } from 'react';
import type Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw, { createBox } from 'ol/interaction/Draw.js';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TimelineIcon from '@mui/icons-material/Timeline';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import GestureIcon from '@mui/icons-material/Gesture';
import Box from '@mui/material/Box';

interface DrawFeatureControlProps {
  map: Map;
}

export const DrawFeatureControl: React.FC<DrawFeatureControlProps> = ({ map }) => {
  const [drawType, setDrawType] = useState<string | null>(null);
  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
  const drawLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Add draw layer once
  useEffect(() => {
    if (!drawLayerRef.current) {
      const drawSource = new VectorSource();
      const drawLayer = new VectorLayer({ source: drawSource, zIndex: 500 });
      map.addLayer(drawLayer);
      drawLayerRef.current = drawLayer;
    }
  }, [map]);

  // Handle draw type change
  useEffect(() => {
    if (drawInteraction) {
      map.removeInteraction(drawInteraction);
      setDrawInteraction(null);
    }
    if (!drawType || !drawLayerRef.current) return;
    let type = drawType;
    let freehand = false;
    if (drawType === 'Rectangle') {
      type = 'Circle'; // OpenLayers uses Circle with geometryFunction for rectangle
    }
    if (drawType === 'Freehand') {
      type = 'Polygon';
      freehand = true;
    }
    const interaction = new Draw({
      source: drawLayerRef.current.getSource()!,
      type: type as 'Point' | 'LineString' | 'Polygon' | 'Circle',
      freehand,
      geometryFunction: drawType === 'Rectangle'
        ? createBox()
        : undefined,
    });
    map.addInteraction(interaction);
    setDrawInteraction(interaction);
    // Auto-disable after drawing one shape
    interaction.on('drawend', () => {
      setDrawType(null);
      map.removeInteraction(interaction);
      setDrawInteraction(null);
    });
  }, [drawType, map]);

  return (
    <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1200, background: '#fff', borderRadius: 1, p: 1, boxShadow: 2 }}>
      <ToggleButtonGroup
        value={drawType}
        exclusive
        onChange={(_, val) => setDrawType(val)}
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