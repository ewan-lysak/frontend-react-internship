const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/assets/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [ 
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@models': path.resolve(__dirname, 'src/images'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
      new HtmlWebpackPlugin({ template: 'index.html' })
    ]
};