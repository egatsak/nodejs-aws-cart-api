import TerserPlugin from 'terser-webpack-plugin';

// TODO try to build with webpack
module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    externals: [
      '@nestjs/websockets/socket-module',
      '@nestjs/microservices/microservices-module',
    ],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    devtool: 'source-map',
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
