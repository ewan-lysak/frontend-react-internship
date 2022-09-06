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
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      }
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
    new HtmlWebPackPlugin({
      template: "./src/template/pages/index.pug",
      filename: "./index.html"
    }),
    new CopyWebpackPlugin([
      { from: './src/assets/images', to: './assets/images' },
      { from: './src/assets/icons', to: './assets/fonts' },
    ])
  ]
};     