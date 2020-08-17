var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  optimization: {
    minimize: false
  },
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]
            ]
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: './src'
  },
  plugins: [new HtmlWebpackPlugin()]
};
