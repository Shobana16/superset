const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// input dir
const APP_DIR = path.resolve(__dirname, './');

// output dir
const BUILD_DIR = path.resolve(__dirname, './dist');

const config = {
  entry: {
    'css-theme': APP_DIR + '/javascripts/css-theme.js',
    common: APP_DIR + '/javascripts/common.js',
    addSlice: ['babel-polyfill', APP_DIR + '/javascripts/addSlice/index.jsx'],
    dashboard: ['babel-polyfill', APP_DIR + '/javascripts/dashboard/Dashboard.jsx'],
    explore: ['babel-polyfill', APP_DIR + '/javascripts/explore/index.jsx'],
    sqllab: ['babel-polyfill', APP_DIR + '/javascripts/SqlLab/index.jsx'],
    welcome: ['babel-polyfill', APP_DIR + '/javascripts/welcome.js'],
    profile: ['babel-polyfill', APP_DIR + '/javascripts/profile/index.jsx'],
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].[chunkhash].entry.js',
    chunkFilename: '[name].[chunkhash].entry.js',
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
    alias: {
      webworkify: 'webworkify-webpack',
      'mapbox-gl/js/geo/transform': path.join(
        __dirname, '/node_modules/mapbox-gl/js/geo/transform'),
      'mapbox-gl': path.join(__dirname, '/node_modules/mapbox-gl/dist/mapbox-gl.js'),
    },

  },
  module: {
    noParse: /mapbox-gl\/dist/,
    loaders: [
      {
        test: /datatables\.net.*/,
        loader: 'imports-loader?define=>false',
      },
      {
        test: /\.jsx?$/,
        exclude: APP_DIR + '/node_modules',
        loader: 'babel-loader',
        query: {
          presets: [
            'airbnb',
            'es2015',
            'react',
          ],
        },
      },
      /* for react-map-gl overlays */
      {
        test: /\.react\.js$/,
        include: APP_DIR + '/node_modules/react-map-gl/src/overlays',
        loader: 'babel-loader',
      },
      /* for require('*.css') */
      {
        test: /\.css$/,
        include: APP_DIR,
        loader: 'style-loader!css-loader',
      },
      /* for css linking images */
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader',
      },
      {
        test: /\.gif$/,
        loader: 'file-loader',
      },
      /* for font-awesome */
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      /* for require('*.less') */
      {
        test: /\.less$/,
        include: APP_DIR,
        loader: 'style-loader!css-loader!less-loader',
      },
      /* for mapbox */
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.js$/,
        include: APP_DIR + '/node_modules/mapbox-gl/js/render/painter/use_program.js',
        loader: 'transform/cacheable?brfs',
      },
    ],
  },
  externals: {
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  plugins: [
    new ManifestPlugin(),
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // Using settings suggested in https://github.com/webpack/webpack/issues/537
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      minimize: true,
      compress: {
        drop_debugger: true,
        warnings: false,
        drop_console: true,
      },
    }),
  );
}
module.exports = config;
