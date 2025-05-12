import React, { useRef, useState } from 'react';
import type Map from 'ol/Map';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { getCenter, getWidth, getHeight, boundingExtent } from 'ol/extent';
import { fromLonLat } from 'ol/proj';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GroupIcon from '@mui/icons-material/Group';
import GroupOffIcon from '@mui/icons-material/GroupOff';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import PointerInteraction from 'ol/interaction/Pointer';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import TuneIcon from '@mui/icons-material/Tune';
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import type { FeatureLike } from 'ol/Feature';

interface UploadedImage {
  id: string;
  imageLayer: ImageLayer<ImageStatic>;
  marker: Feature<Point>;
  markerLayer: VectorLayer<VectorSource>;
  extent: [number, number, number, number];
  url: string;
  name: string;
}

interface GroupData {
  groupId: string;
  imageIds: string[];
  groupMarker: Feature<Point>;
  groupMarkerLayer: VectorLayer<VectorSource>;
  dragInteraction: PointerInteraction | null;
}

interface UploadImageControlProps {
  map: Map;
}

export const UploadImageControl: React.FC<UploadImageControlProps> = ({ map }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const markerDragInteractionsRef = useRef<PointerInteraction[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editImage, setEditImage] = useState<UploadedImage | null>(null);
  const [editCanvasUrl, setEditCanvasUrl] = useState<string | null>(null);
  const [editState, setEditState] = useState({ rotate: 0, grayscale: false, skewX: 0, skewY: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper: generate unique id
  const genId = () => Math.random().toString(36).substring(2, 10);

  // Helper: get group by marker
  const getGroupByMarker = (marker: FeatureLike) => {
    if (!(marker instanceof Feature) || !(marker.getGeometry() instanceof Point)) return undefined;
    return groups.find(g => g.groupMarker === marker);
  };

  // Handle upload multiple images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imageUrl = event.target?.result as string;
        const offset = (images.length + idx) * 0.01;
        const min = fromLonLat([139.68 + offset, 35.68 + offset]);
        const max = fromLonLat([139.70 + offset, 35.70 + offset]);
        const extent: [number, number, number, number] = [min[0], min[1], max[0], max[1]];
        const imageLayer = new ImageLayer<ImageStatic>({
          source: new ImageStatic({
            url: imageUrl,
            imageExtent: extent,
            projection: 'EPSG:3857',
          }),
          properties: {
            title: file.name || 'Uploaded Image',
          },
          zIndex: 1000 + images.length + idx,
        });
        map.addLayer(imageLayer);
        const center = getCenter(extent);
        const marker = new Feature({ geometry: new Point(center) });
        marker.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 10,
              fill: new Fill({ color: '#1976d2' }),
              stroke: new Stroke({ color: '#fff', width: 2 })
            })
          })
        );
        const markerSource = new VectorSource({ features: [marker] });
        const markerLayer = new VectorLayer({ source: markerSource, zIndex: 1100 + images.length + idx });
        map.addLayer(markerLayer);
        setImages(prev => [
          ...prev,
          {
            id: genId(),
            imageLayer,
            marker,
            markerLayer,
            extent,
            url: imageUrl,
            name: file.name || 'Uploaded Image',
          },
        ]);
        if (images.length + idx === 0) {
          map.getView().fit(extent, { duration: 1000, maxZoom: 18 });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle marker click (select/deselect)
  React.useEffect(() => {
    map.getInteractions().forEach(inter => {
      if ((inter as { _isMarkerSelect?: boolean })._isMarkerSelect) map.removeInteraction(inter);
    });
    const selectInteraction = new PointerInteraction({
      handleDownEvent: (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
        if (!feature) return false;
        const group = getGroupByMarker(feature);
        if (group) {
          setSelectedIds([]);
          setSelectedGroupId(group.groupId);
          return true;
        }
        const found = images.find(img => img.marker === feature);
        if (found) {
          setSelectedGroupId(null);
          setSelectedIds(prev => {
            if (evt.originalEvent.ctrlKey || evt.originalEvent.metaKey) {
              if (prev.includes(found.id)) {
                return prev.filter(id => id !== found.id);
              } else {
                return [...prev, found.id];
              }
            } else {
              return [found.id];
            }
          });
          return true;
        }
        setSelectedGroupId(null);
        return false;
      },
    });
    (selectInteraction as { _isMarkerSelect?: boolean })._isMarkerSelect = true;
    map.addInteraction(selectInteraction);
    return () => {
      map.removeInteraction(selectInteraction);
    };
  }, [images, groups]);

  // Highlight selected markers
  React.useEffect(() => {
    images.forEach(img => {
      img.marker.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: selectedIds.includes(img.id) ? '#ff9800' : '#1976d2' }),
            stroke: new Stroke({ color: '#fff', width: 2 })
          })
        })
      );
    });
  }, [selectedIds, images]);

  // Group selected images
  const handleGroup = () => {
    if (selectedIds.length < 2) return;
    
    // Get all selected images
    const selectedImages = images.filter(img => selectedIds.includes(img.id));
    
    // Hide individual markers
    selectedImages.forEach(img => {
      img.markerLayer.setVisible(false);
    });

    // Create group marker
    const groupExtent = boundingExtent(selectedImages.map(img => getCenter(img.extent)));
    const groupCenter = getCenter(groupExtent);
    const groupMarker = new Feature({ geometry: new Point(groupCenter) });
    const groupMarkerId = genId();
    groupMarker.setId(groupMarkerId);
    groupMarker.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 14,
          fill: new Fill({ color: '#43a047' }),
          stroke: new Stroke({ color: '#fff', width: 3 })
        })
      })
    );

    const groupMarkerSource = new VectorSource({ features: [groupMarker] });
    const groupMarkerLayer = new VectorLayer({ source: groupMarkerSource, zIndex: 9999 });
    map.addLayer(groupMarkerLayer);
    // Group marker layer added

    // Create drag interaction for this group
    let isDragging = false;
    let startCoord: number[] | null = null;
    // Find DragPan interaction
    const dragPanInteraction = map.getInteractions().getArray().find(i => i.constructor && i.constructor.name === 'DragPan');
    const dragInteraction = new PointerInteraction({
      handleDownEvent: (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, f => f, { layerFilter: l => l === groupMarkerLayer });
        // Handle down event for group marker drag
        if (feature && feature.getId && feature.getId() === groupMarkerId) {
          isDragging = true;
          startCoord = groupMarker.getGeometry()?.getCoordinates().slice() as number[];
          map.getTargetElement().style.cursor = 'move';
          // Disable DragPan while dragging group
          if (dragPanInteraction) dragPanInteraction.setActive(false);
          evt.preventDefault();
          evt.stopPropagation();
          return true;
        }
        return false;
      },
      handleDragEvent: (evt) => {
        if (!isDragging || !startCoord) return;
        const dx = evt.coordinate[0] - startCoord[0];
        const dy = evt.coordinate[1] - startCoord[1];
        groupMarker.getGeometry()?.setCoordinates(evt.coordinate);
        selectedImages.forEach(img => {
          const oldCenter = getCenter(img.extent);
          const newCenter: [number, number] = [oldCenter[0] + dx, oldCenter[1] + dy];
          img.marker.getGeometry()?.setCoordinates(newCenter);
          const width = getWidth(img.extent);
          const height = getHeight(img.extent);
          const newExtent: [number, number, number, number] = [
            newCenter[0] - width / 2,
            newCenter[1] - height / 2,
            newCenter[0] + width / 2,
            newCenter[1] + height / 2,
          ];
          img.extent = newExtent;
          const newSource = new ImageStatic({
            url: img.url,
            imageExtent: newExtent,
            projection: 'EPSG:3857',
          });
          img.imageLayer.setSource(newSource);
        });
        startCoord = evt.coordinate.slice() as number[];
        evt.preventDefault();
        evt.stopPropagation();
      },
      handleUpEvent: () => {
        isDragging = false;
        startCoord = null;
        map.getTargetElement().style.cursor = '';
        // Re-enable DragPan
        if (dragPanInteraction) dragPanInteraction.setActive(true);
        return false;
      },
      handleMoveEvent: (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, f => f, { layerFilter: l => l === groupMarkerLayer });
        if (feature && feature.getId && feature.getId() === groupMarkerId) {
          map.getTargetElement().style.cursor = 'move';
        } else {
          map.getTargetElement().style.cursor = '';
        }
      },
      stopDown: () => true
    });
    // Add the interaction to the map (always last)
    map.addInteraction(dragInteraction);
    // Group drag interaction added

    // Store the interaction in the group data
    setGroups(prev => [
      ...prev,
      {
        groupId: genId(),
        imageIds: selectedIds,
        groupMarker,
        groupMarkerLayer,
        dragInteraction,
      },
    ]);
    
    setSelectedIds([]);
  };

  // Ungroup a group
  const handleUngroup = (groupId: string) => {
    const group = groups.find(g => g.groupId === groupId);
    if (!group) return;

    // Show individual markers
    images.forEach(img => {
      if (group.imageIds.includes(img.id)) {
        img.markerLayer.setVisible(true);
      }
    });

    // Remove group marker and interaction
    map.removeLayer(group.groupMarkerLayer);
    if (group.dragInteraction) {
      map.removeInteraction(group.dragInteraction);
    }

    setGroups(prev => prev.filter(g => g.groupId !== groupId));
  };

  // Add drag interaction for individual markers
  React.useEffect(() => {
    markerDragInteractionsRef.current.forEach(inter => map.removeInteraction(inter));
    markerDragInteractionsRef.current = [];

    if (selectedIds.length !== 1) return;
    
    const img = images.find(i => i.id === selectedIds[0]);
    if (!img) return;

    // Check if image is in any group
    const isInGroup = groups.some(g => g.imageIds.includes(img.id));
    if (isInGroup) return;

    let isDragging = false;
    let startCoord: number[] | null = null;
    let dragStartPixel: number[] | null = null;
    let wasDragged = false;

    const dragInteraction = new PointerInteraction({
      handleDownEvent: (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
        if (feature === img.marker) {
          isDragging = true;
          startCoord = img.marker.getGeometry()?.getCoordinates().slice() as number[];
          dragStartPixel = evt.pixel.slice();
          wasDragged = false;
          return true;
        }
        return false;
      },
      handleDragEvent: (evt) => {
        if (!isDragging || !startCoord) return;
        wasDragged = true;
        img.marker.getGeometry()?.setCoordinates(evt.coordinate);
        const width = getWidth(img.extent);
        const height = getHeight(img.extent);
        const newCenter = evt.coordinate;
        const newExtent: [number, number, number, number] = [
          newCenter[0] - width / 2,
          newCenter[1] - height / 2,
          newCenter[0] + width / 2,
          newCenter[1] + height / 2,
        ];
        img.extent = newExtent;
        const newSource = new ImageStatic({
          url: img.url,
          imageExtent: newExtent,
          projection: 'EPSG:3857',
        });
        img.imageLayer.setSource(newSource);
      },
      handleUpEvent: (evt) => {
        if (!isDragging) return false;
        isDragging = false;
        startCoord = null;
        // If not dragged (or dragged less than 5px), treat as click to open edit dialog
        if (!wasDragged && dragStartPixel && evt.pixel) {
          const dx = evt.pixel[0] - dragStartPixel[0];
          const dy = evt.pixel[1] - dragStartPixel[1];
          if (Math.sqrt(dx*dx + dy*dy) < 5) {
            setEditImage(img);
            setEditDialogOpen(true);
            setEditState({ rotate: 0, grayscale: false, skewX: 0, skewY: 0 });
            setEditCanvasUrl(img.url);
          }
        }
        dragStartPixel = null;
        wasDragged = false;
        return false;
      },
    });

    (dragInteraction as { _isMarkerDrag?: boolean })._isMarkerDrag = true;
    map.addInteraction(dragInteraction);
    markerDragInteractionsRef.current.push(dragInteraction);
  }, [images, groups, selectedIds]);

  // Clean up interactions when component unmounts
  React.useEffect(() => {
    return () => {
      groups.forEach(group => {
        if (group.dragInteraction) {
          map.removeInteraction(group.dragInteraction);
        }
      });
    };
  }, [groups, map]);

  // Add this effect after component definition
  React.useEffect(() => {
    const clickListener = () => {
      // Map click event for debugging group marker detection
    };
    map.on('click', clickListener);
    return () => map.un('click', clickListener);
  }, [map]);

  // Draw image to canvas with current edit state
  React.useEffect(() => {
    if (!editDialogOpen || !editImage || !editCanvasUrl) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.save();
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Move to center for rotation/skew
      ctx.translate(canvas.width / 2, canvas.height / 2);
      // Skew
      ctx.transform(1, editState.skewY, editState.skewX, 1, 0, 0);
      // Rotate
      ctx.rotate((editState.rotate * Math.PI) / 180);
      // Draw image
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
      // Grayscale
      if (editState.grayscale) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
          imageData.data[i] = avg;
          imageData.data[i + 1] = avg;
          imageData.data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
      }
    };
    img.src = editCanvasUrl;
  }, [editDialogOpen, editImage, editCanvasUrl, editState]);

  // Handle edit actions
  const handleRotate = (angle: number) => {
    setEditState(s => ({ ...s, rotate: s.rotate + angle }));
  };
  const handleGrayscale = () => {
    setEditState(s => ({ ...s, grayscale: !s.grayscale }));
  };
  const handleSkew = (dx: number, dy: number) => {
    setEditState(s => ({ ...s, skewX: s.skewX + dx, skewY: s.skewY + dy }));
  };
  const handleReset = () => {
    setEditState({ rotate: 0, grayscale: false, skewX: 0, skewY: 0 });
    setEditCanvasUrl(editImage?.url || null);
  };
  const handleSave = () => {
    if (!editImage || !canvasRef.current) return;
    const url = canvasRef.current.toDataURL();
    // Update image layer source
    const newSource = new ImageStatic({
      url,
      imageExtent: editImage.extent,
      projection: 'EPSG:3857',
    });
    editImage.imageLayer.setSource(newSource);
    // Update url in state
    setImages(prev => prev.map(img => img.id === editImage.id ? { ...img, url } : img));
    setEditDialogOpen(false);
    setEditImage(null);
    setEditCanvasUrl(null);
  };

  return (
    <>
      {/* Image Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md">
        <DialogTitle>Edit Image</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <canvas ref={canvasRef} style={{ maxWidth: 400, maxHeight: 400, border: '1px solid #ccc' }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => handleRotate(-15)} title="Rotate Left"><RotateLeftIcon /></IconButton>
          <IconButton onClick={() => handleRotate(15)} title="Rotate Right"><RotateRightIcon /></IconButton>
          <IconButton onClick={() => handleGrayscale()} title="Grayscale"><FilterBAndWIcon color={editState.grayscale ? 'primary' : 'inherit'} /></IconButton>
          <IconButton onClick={() => handleSkew(0.2, 0)} title="Skew X+"><TuneIcon /></IconButton>
          <IconButton onClick={() => handleSkew(-0.2, 0)} title="Skew X-"><TuneIcon sx={{ transform: 'scaleX(-1)' }} /></IconButton>
          <IconButton onClick={() => handleSkew(0, 0.2)} title="Skew Y+"><TuneIcon sx={{ transform: 'rotate(90deg)' }} /></IconButton>
          <IconButton onClick={() => handleSkew(0, -0.2)} title="Skew Y-"><TuneIcon sx={{ transform: 'rotate(-90deg)' }} /></IconButton>
          <IconButton onClick={handleReset} title="Reset"><RestoreIcon /></IconButton>
          <IconButton onClick={handleSave} title="Save"><SaveIcon /></IconButton>
        </DialogActions>
      </Dialog>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1200, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<UploadFileIcon />}
          onClick={() => inputRef.current?.click()}
        >
          Upload Image(s)
        </Button>
        {selectedIds.length >= 2 && (
          <Button
            variant="contained"
            color="success"
            startIcon={<GroupIcon />}
            onClick={handleGroup}
          >
            Group
          </Button>
        )}
        {groups.map(g => selectedGroupId === g.groupId && (
          <Button
            key={g.groupId}
            variant="contained"
            color="warning"
            startIcon={<GroupOffIcon />}
            onClick={() => handleUngroup(g.groupId)}
          >
            Un-group
          </Button>
        ))}
      </Box>
    </>
  );
}; 