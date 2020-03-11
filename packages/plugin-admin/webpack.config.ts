import htmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import PluginTerser from 'terser-webpack-plugin';
// import CopyPlugin from 'copy-webpack-plugin';

const DEFAULT_ENV = {
  NODE_ENV: 'development'
};

const ENV = Object.entries(DEFAULT_ENV).reduce((obj, [k, v]) => {
  // @ts-ignore
  obj[`process.env.${k}`] = JSON.stringify(process.env[k] || v);
  return obj;
}, {});

const DIST = path.resolve(__dirname, 'dist/client');


export default (_env: any, options: { mode: string }) => {
  const IS_PROD = options.mode === 'production';

  return {
    entry: [
      './src/client/index.tsx'
    ],
    output: {
      filename: 'admin.js',
      publicPath: '/admin/',
      path: DIST
    },
    devtool: IS_PROD ? false : 'cheap-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: [
            'babel-loader',
            {
              loader: 'ts-loader', options: {
                // configFile: path.resolve(__dirname, './tsconfig.client.json'),
                allowTsInNodeModules: true,
                compilerOptions: {
                  sourceMap: !IS_PROD
                }
              }
            }
          ]
        },
        {
          test: /\/fonts\/.*\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader?name=fonts/[hash].[ext]'
        },
        {
          test: [/\/images\/.*\.svg$/, /@coreui\/icons/],
          loader: 'svg-react-loader'
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader'
        },

        {
          test: /\.(css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css',
        chunkFilename: 'styles.css'
      }),
      new htmlWebpackPlugin({
        title: 'Brix Admin',
        template: './src/client/index.html'
      }),
      new webpack.DefinePlugin(ENV)
      // new FaviconsWebpackPlugin('./src/images/logos/logo-light.svg')
      // new CopyPlugin([
      //   { from: 'src/api-url.js', to: '.' },
      //   { from: 'src/app-env.js', to: '.' }
      // ])
    ],

    devServer: {
      contentBase: DIST,
      compress: true,
      port: 8888,
      historyApiFallback: true,
      writeToDisk: true
    },

    optimization: {
      minimize: true,
      minimizer: [new PluginTerser()]
    }
  } as webpack.Configuration;
};
