const Dotenv = require('dotenv-webpack');
const DefinePlugin = require('webpack').DefinePlugin;

let environmentConfig;
if(process.env.NODE_ENV !=='production'){
  console.log('!!!! production')
  environmentConfig = new Dotenv()
}
else{
  console.log('!!!! DEV')
environmentConfig = new DefinePlugin({'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY)}
)
}
module.exports = {

  entry: [
    './client/index.js'
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react'
          ]
        }
      }
    ]
  },
  plugins: [
   environmentConfig
  ]
}
