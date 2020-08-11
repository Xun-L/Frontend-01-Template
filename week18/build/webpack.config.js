module.exports = {
  mode: 'development',
  optimization: {
    minimize: false
  },
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
