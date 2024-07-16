/* eslint-disable @typescript-eslint/no-var-requires */
const TerserPlugin = require('terser-webpack-plugin');

const lazyImports = [
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets/socket-module',
  '@nestjs/microservices',
  '@nestjs/websockets',
  '@nestjs/microservices-module',
];

module.exports = (options, webpack) => {
  return {
    ...options,
    devtool: 'source-map',
    externals: [
      '@nestjs/websockets/socket-module',
      '@nestjs/microservices/microservices-module',
    ],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    optimization: {
      minimize: false,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              defaults: false,
              unused: true,
            },
            keep_classnames: true,
            keep_fnames: true,
          },
        }),
      ],
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
