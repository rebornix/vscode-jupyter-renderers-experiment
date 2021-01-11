
// Renderer view type, it should match the "viewType" in your package.json.
// This is a unique identifier for the renderer you're working on.
export const rendererType = 'jupyter-notebook-renderer-geojson';

// Callback function registered by the renderer client code. We use the
// viewType to make this unique so that other renderers don't conflict.
export const renderCallback = `render-notebook-${rendererType}`;
