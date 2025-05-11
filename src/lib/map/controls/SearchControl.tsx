import React, { useState } from 'react';
import type Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

interface SearchControlProps {
  map: Map;
  className?: string;
}

export const SearchControl: React.FC<SearchControlProps> = ({ map, className }) => {
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const lon = parseFloat(longitude);
      const lat = parseFloat(latitude);
      if (isNaN(lon) || isNaN(lat)) {
        throw new Error('Please enter valid numbers');
      }
      if (lon < -180 || lon > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
      if (lat < -90 || lat > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      const coordinates = fromLonLat([lon, lat]);
      map.getView().animate({
        center: coordinates,
        zoom: 15,
        duration: 1000
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid coordinates');
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,
        width: 'auto',
        maxWidth: 600,
      }}
      className={className}
    >
      <Paper elevation={4} sx={{ p: 2, borderRadius: 2 }}>
        <form onSubmit={handleSearch}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Longitude"
              variant="outlined"
              size="small"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              sx={{ minWidth: 120 }}
            />
            <TextField
              label="Latitude"
              variant="outlined"
              size="small"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              sx={{ minWidth: 120 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              sx={{ height: 40 }}
            >
              Search
            </Button>
          </Stack>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
}; 