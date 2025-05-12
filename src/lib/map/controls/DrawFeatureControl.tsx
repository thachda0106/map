import React, { useRef, useState, useEffect } from 'react';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw.js';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TimelineIcon from '@mui/icons-material/Timeline';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import GestureIcon from '@mui/icons-material/Gesture';
import type { Geometry } from 'ol/geom';
import { Point, LineString, Polygon, Circle } from 'ol/geom';
import type { Feature } from 'ol';
import type { DrawFeatureType } from '../features/types';
import { createDrawFeatureOptions } from '../features/factory';

interface DrawFeatureControlProps {
  map: Map;
}

export const DrawFeatureControl: React.FC<DrawFeatureControlProps> = ({ map }) => {
  const [drawType, setDrawType] = useState<DrawFeatureType | null>(null);
  const drawLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const drawSourceRef = useRef<VectorSource | null>(null);
  const drawInteractionRef = useRef<Draw | null>(null);

  // Initialize draw layer and source
  useEffect(() => {
    if (!drawLayerRef.current) {
      const drawSource = new VectorSource();
      const drawLayer = new VectorLayer({ 
        source: drawSource, 
        zIndex: 999999,
        properties: {
          name: 'drawLayer'
        }
      });
      map.addLayer(drawLayer);
      drawLayerRef.current = drawLayer;
      drawSourceRef.current = drawSource;
    }

    return () => {
      if (drawLayerRef.current) {
        map.removeLayer(drawLayerRef.current);
      }
      if (drawInteractionRef.current) {
        map.removeInteraction(drawInteractionRef.current);
      }
    };
  }, [map]);

  // Handle draw type changes
  useEffect(() => {
    // Remove existing draw interaction if any
    if (drawInteractionRef.current) {
      map.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }

    if (!drawType || !drawSourceRef.current) {
      return;
    }

    // Get draw options for the selected type
    const options = createDrawFeatureOptions(drawType);

    // Create new draw interaction
    const interaction = new Draw({
      source: drawSourceRef.current,
      ...options
    });

    // Add event listeners
    interaction.on('drawend', (event) => {
      const feature = event.feature as Feature<Geometry>;
      const geometry = feature.getGeometry();
      if (geometry) {
        if (geometry instanceof Point || 
            geometry instanceof LineString || 
            geometry instanceof Polygon || 
            geometry instanceof Circle) {
          console.log('Drawn feature coordinates:', geometry.getCoordinates());
        }
      }

      // Reset draw type
      setDrawType(null);
    });

    // Add the interaction to the map
    map.addInteraction(interaction);
    drawInteractionRef.current = interaction;

    // Disable default interactions while drawing
    const defaultInteractions = map.getInteractions().getArray();
    defaultInteractions.forEach(i => {
      if (i !== interaction) {
        i.setActive(false);
      }
    });

    return () => {
      // Re-enable default interactions when done
      defaultInteractions.forEach(i => {
        if (i !== interaction) {
          i.setActive(true);
        }
      });
    };
  }, [drawType, map]);

  const handleDrawTypeChange = (event: React.MouseEvent<HTMLElement>, newType: DrawFeatureType | null) => {
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