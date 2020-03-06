/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    hydra: ['./src/index.js'],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  optimization: {
    // splitChunks: {
    //   chunks: 'all',
    //   maxSize: 400000,
    // },
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        // eslint-disable-next-line global-require
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      }),
      new TerserPlugin({
        sourceMap: false,
        extractComments: false,
        parallel: true,
        terserOptions: {
          ecma: 6,
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              [
                '@babel/plugin-transform-runtime',
                {
                  absoluteRuntime: false,
                  corejs: false,
                  helpers: true,
                  regenerator: true,
                  useESModules: false,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [autoprefixer()],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(html)$/,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader',
          options: { minimize: false },
        },
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              emitFile: true,
              outputPath: 'img',
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...glob.sync('./src/*.html').map((htmlFile) => new HtmlWebpackPlugin({
      filename: path.basename(htmlFile),
      template: htmlFile,
      inject: true,
      compress: true,
      meta: {
        viewport: 'width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no',
      },
      minify: {
        removeComments: true,
      },
    })),
    new SvgSpriteHtmlWebpackPlugin({
      includeFiles: ['src/img/sprite/*.svg'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].styles.[contenthash:8].css',
      publicPath: './',
    }),
    new FaviconsWebpackPlugin({
      logo: './src/img/logo.png',
      mode: 'webapp',
      devMode: 'webapp',
      prefix: 'assets/',
      favicons: {
        appName: 'HYDRA',
        appDescription: 'The Emperor protects...',
        developerName: 'HYDRA dev',
        developerURL: null,
        display: 'browser',
        orientation: 'any',
        dir: 'ltr',
        lang: 'ru-RU',
        background: '#323232',
        theme_color: '#ff0164',
        appleStatusBarStyle: 'black-translucent',
        start_url: '.',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          coast: true,
          favicons: true,
          firefox: true,
          windows: true,
          yandex: true,
        },
      },
    }),
    new CopyWebpackPlugin([{ from: 'src/img', to: 'img' }]),
  ],
};
