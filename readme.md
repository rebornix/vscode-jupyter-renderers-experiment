# VS Code notebook renderers for Jupyter

This repo is an experiment on how to port a Jupyter renderer plugin to VS Code extension ecosystem. The major purpose (if not the only one) for now is figuring out the challenges of porting an output renderer plugin on Jupyter Notebook/JupyterLab to VS Code environment.

## Geojson

Changes on top of https://github.com/jupyterlab/jupyter-renderers/tree/master/packages/geojson-extension

* Static images
  * Alias them so Webpack knows where to find them in the node modules folder
  * Keep the names for images as leaflet relies on those names
  * Also copy images used by leaflet but not linked anywhere directly
* Set `webpack_public_path` as VS Code webview has its own customized uri protocol handler
  * `webpack_public_path` works only when we are using `require` other than ES6 style import, otherwise the module is resolved before the `webpack_public_path` is updated properly, see details in https://github.com/webpack/webpack/issues/2776

Other than that, the code is almost identical.