# OpenLayers Modular React Map App

A modern, modular, and extensible map application built with [OpenLayers](https://openlayers.org/), [React](https://react.dev/), and [Material-UI (MUI)](https://mui.com/).

## Features
- 🗺️ Multiple base layers (OSM, Stamen, CartoDB, OpenTopoMap...)
- 🖼️ Upload, drag, group, and edit images on the map
- 🔍 Search by longitude/latitude
- 🖊️ Draw all geometry types: Point, Line, Polygon, Rectangle, Circle, Freehand
- 👁️ Layer switcher with visibility toggles
- 🎨 Modular, feature-based folder structure for easy extension
- ⚡ Fast, clean, and ready for production or research

## Folder Structure
```
src/lib/map/
  components/         # React components (Map, ...)
  controls/           # UI controls (UploadImageControl, DrawFeatureControl, ...)
  features/           # Drawing logic & styles for each geometry type
  layers/             # Layer factories (ImageLayer, VectorLayer, ...)
  interactions/       # Custom OpenLayers interactions
  utils/              # Utility functions (projection, extent, id, ...)
  types.ts            # Shared TypeScript types
```

## Getting Started
1. **Install dependencies:**
   ```sh
   yarn install
   # or
   npm install
   ```
2. **Start the dev server:**
   ```sh
   yarn dev
   # or
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Contributing
- PRs and issues are welcome!
- Please follow the modular structure and keep code clean and well-documented.

## License
MIT
