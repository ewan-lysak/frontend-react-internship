const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/js/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    compress: true,
    port: 9000,
    open: ['http://localhost:9000/'],
  },
  module: {
    rules: [

      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "./index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/images'),
          to: path.resolve(__dirname, 'dist/assets/images')
        },
        {
          from: path.resolve(__dirname, 'src/assets/icons'),
          to: path.resolve(__dirname, 'dist/assets/icons')
        },
      ]
    }),
  ]
};     