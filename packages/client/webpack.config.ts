import 'webpack-dev-server';

// import Copy from 'copy-webpack-plugin';
import ExtractText from 'extract-text-webpack-plugin';
import HTMLWebpack from 'html-webpack-plugin';
import { Configuration } from 'webpack';

// const favicon = require('favicons-webpack-plugin');
const replacePlugin = require('webpack-plugin-replace');

const CSS = new ExtractText('app.css');

const isProd = process.env.NODE_ENV !== 'development';

const config: Configuration = {
  entry: ['./src/index.tsx'],

  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.gql']
  },

  output: {
    publicPath: '/'
  },

  devServer: {
    historyApiFallback: true
  },

  module: {
    rules: [
      { test: /\.ts/, loader: 'ts-loader' },
      { test: /\.scss/, loader: CSS.extract(['css-loader', 'sass-loader']) },
      { test: /\.html/, loader: 'html-loader' },
      { test: /\.svg|png/, loader: 'url-loader' },
      {
        test: /font\/.*\.(svg|eot|ttf|woff|woff2)/, loader: 'url-loader', options: {
          limit: false,
          outputPath: 'fonts'
        }
      },
      { test: /\.gql/, loader: 'graphql-tag/loader' }
    ]
  },

  plugins: [
    new HTMLWebpack({
      template: './src/index.html'
    }),
    CSS,
    // new favicon('./src/images/logo.jpg'),
    // new Copy([
    // { from: './src/images/social', to: 'social' },
    // { from: './src/images/', to: 'images' },
    // { from: './_redirects' }
    // ]),
    new replacePlugin({
      values: {
        '{{API_URL}}': isProd ? 'https://api.sketchsite.com' : 'http://localhost:4000',
        '{{IS_PROD}}': isProd
      }
    })
  ]

};

// tslint:disable-next-line
export default config;
