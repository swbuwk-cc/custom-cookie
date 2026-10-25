const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

const appName = process.env.APP_NAME || 'CustomCookie';

module.exports = function (_env, argv) {
  const isProd = argv.mode === 'production';

  return {
    devtool: isProd ? 'source-map' : 'inline-source-map',
    watchOptions: { ignored: /node_modules/ },
    entry: './src/main.ts',
    plugins: [
      new webpack.DefinePlugin({
        "process.env.APP_NAME": JSON.stringify(appName),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.js', ".ts"],
    },
    output: {
      clean: true,
      filename: `${appName}.js`,
      path: path.resolve(__dirname, isProd ? 'dist' : 'build'),
    },
  };
};