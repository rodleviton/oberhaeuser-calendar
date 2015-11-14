var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

module.exports = function (options) {

  var PATHS = {
    app: __dirname + '/app',
    build: __dirname + '/build',
    bower: __dirname + '/bower_components'
  };

  var postLoaders = [];

  var preLoaders = [{
    test: /\.js$/,
    exclude: [/libs/, /node_modules/],
    loader: 'jscs-loader'
  }];

  var loaders = [{
      test: /\.js$/,
      loader: 'ng-annotate!babel!jshint',
      exclude: [/libs/, /node_modules/]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.html$/,
      loader: 'raw',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.(otf|eot|png|svg|jpg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000'
    },
  ];

  if (process.env.NODE_ENV === 'production') {
    PATHS.build = __dirname + '/dist';
  }

  var plugins = [
    new webpack.DefinePlugin({
      ON_TEST: process.env.NODE_ENV === 'test',
      ON_DEV: process.env.NODE_ENV === 'dev',
      ON_PROD: process.env.NODE_ENV === 'production'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      extraFiles: 'app/images/logo-2015.svg',
      template: 'app/index.html',
      favicon: 'app/favicons/favicon.ico',
      minify: true
    })
  ];

  if (options.test) {
    postLoaders.push({
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'istanbul-instrumenter'
    });
  }

  if (options.separateStylesheet) {
    plugins.push(new ExtractTextPlugin("main.css" + (options.longTermCaching ?
      "?[contenthash]" : "")));
    loaders.push({
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('css!sass')
    });
  }

  if (!options.separateStylesheet) {
    loaders.push({
      test: /\.scss$/,
      loader: 'style!css!sass'
    })
  }

  if (options.minimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  return {
    devtool: options.devtool,
    debug: options.debug,

    context: PATHS.app,

    entry: {
      index: './index.js'
    },

    output: {
      path: PATHS.build,
      filename: 'bundle.js'
    },

    resolve: {
      modulesDirectories: ['node_modules']
    },

    plugins: plugins,

    devServer: {
      stats: {
        cached: false,
        exclude: [/node_modules/]
      }
    },

    module: {
      loaders: loaders,
      preLoaders: preLoaders,
      postLoaders: postLoaders
    }
  }
}
