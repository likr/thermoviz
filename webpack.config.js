const path = require('path')
const webpack = require('webpack')

const options = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['latest', 'react']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?localIdentName=[path][name]---[local]---[hash:base64:5]&modules'
        ]
      }
    ]
  },
  entry: {
    bundle: './src/index'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },
  externals: {
    jquery: '$'
  },
  plugins: [
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
    port: 9000
  }
}

if (process.env.NODE_ENV === 'production') {
  options.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
} else {
  Object.assign(options, {
    devtool: 'inline-source-map'
  })
}

module.exports = options
