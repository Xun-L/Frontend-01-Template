module.exports = {
  mode: 'development',
  optimization: {
    minimize: false
  },
  entry: './main.js',
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
      },
      {
        test: /\.vue$/,
        loader: require.resolve('./myLoader.js')
      },
      {
        test: /\.css$/,
        loader: require.resolve('./cssLoader.js')
      }
    ]
  }
}
