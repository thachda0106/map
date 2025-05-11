import React, { useEffect, useState } from 'react';
import type Map from 'ol/Map';
import type BaseLayer from 'ol/layer/Base';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface LayerSwitcherProps {
  map: Map;
}

export const LayerSwitcher: React.FC<LayerSwitcherProps> = ({ map }) => {
  const [layers, setLayers] = useState<BaseLayer[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!map) return;
    const mapLayers = map.getLayers().getArray();
    setLayers(mapLayers as BaseLayer[]);
    // Listen for layer changes (add/remove)
    const handleChange = () => setRefresh(r => r + 1);
    map.getLayers().on('add', handleChange);
    map.getLayers().on('remove', handleChange);
    return () => {
      map.getLayers().un('add', handleChange);
      map.getLayers().un('remove', handleChange);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    setLayers(map.getLayers().getArray() as BaseLayer[]);
  }, [refresh, map]);

  const handleToggle = (layer: BaseLayer) => {
    layer.setVisible(!layer.getVisible());
    setRefresh(r => r + 1);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 80,
        right: 16,
        zIndex: 1100,
        minWidth: 200,
        maxWidth: 300,
      }}
    >
      <Paper elevation={4} sx={{ p: 1, borderRadius: 2 }}>
        <List dense>
          {layers.map((layer, idx) => {
            const title = layer.get('title') || `Layer ${idx + 1}`;
            const visible = layer.getVisible();
            return (
              <ListItem
                key={title + idx}
                secondaryAction={
                  <Tooltip title={visible ? 'Ẩn layer' : 'Hiện layer'}>
                    <IconButton edge="end" onClick={() => handleToggle(layer)}>
                      {visible ? <VisibilityIcon color="primary" /> : <VisibilityOffIcon color="disabled" />}
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemText primary={title} />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}; 