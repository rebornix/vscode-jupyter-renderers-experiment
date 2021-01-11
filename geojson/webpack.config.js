const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const crypto = require('crypto');

const outputFilename = 'index.js';
const devServerPort = 8111;

module.exports = (env, argv) => ({
  mode: argv.mode,
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: './src/client/index.ts',
  output: {
    // Multiple renderers might exist on the same page, so provide a random
    // jsonpFunction name--otherwise the bundles could interfere with each other.
    jsonpFunction: crypto.randomBytes(8).toString('hex'),
    path: path.join(__dirname, 'out', 'client'),
    filename: outputFilename,
    publicPath: process.env.WEBPACK_DEV_SERVER ? `http://localhost:${devServerPort}/` : undefined,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
    alias: {
        "./images/layers.png$": path.resolve(
            __dirname,
            "./node_modules/leaflet/dist/images/layers.png"
        ),
        "./images/layers-2x.png$": path.resolve(
            __dirname,
            "./node_modules/leaflet/dist/images/layers-2x.png"
        ),
        "./images/marker-icon.png$": path.resolve(
            __dirname,
            "./node_modules/leaflet/dist/images/marker-icon.png"
        ),
        "./images/marker-icon-2x.png$": path.resolve(
            __dirname,
            "./node_modules/leaflet/dist/images/marker-icon-2x.png"
        ),
        "./images/marker-shadow.png$": path.resolve(
            __dirname,
            "./node_modules/leaflet/dist/images/marker-shadow.png"
        )
    }
  },
  module: {
    rules: [
      // Allow importing ts(x) files:
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'src/client/tsconfig.json',
          // transpileOnly enables hot-module-replacement
          transpileOnly: true,
          compilerOptions: {
            // Overwrite the noEmit from the client's tsconfig
            noEmit: false,
          },
        },
      },
      // Allow importing CSS modules:
      {
        test: /\leaflet.css$/,
        use: [
            {loader: "style-loader"},
            {loader: "css-loader"}
        ]
      },
      {
        test: /\.css$/,
        exclude: /\leaflet.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          },
        ]
      }
    ],
  },
  devServer: {
    port: devServerPort,
    hot: true,
    writeToDisk: true,
    // Set host policies, otherwise the bundle running in VS Code won't be
    // able to connect to the dev server
    disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  plugins: [
    new CopyPlugin([
      { from: "node_modules/leaflet/dist/images/marker-icon-2x.png", to: "marker-icon-2x.png" },
      { from: "node_modules/leaflet/dist/images/marker-shadow.png", to: "marker-shadow.png" },
    ]),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: 'src/client/tsconfig.json',
    }),
    new DefinePlugin({
      // Path from the output filename to the output directory
      __webpack_relative_entrypoint_to_root__: JSON.stringify(
        path.posix.relative(path.posix.dirname(`/${outputFilename}`), '/'),
      ),
    }),
  ],
});
