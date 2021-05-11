const Dotenv = require('dotenv-webpack');
const DefinePlugin = require('webpack').DefinePlugin;

console.log('in heroku', process.env)

let environmentConfig;
if(process.env.NODE_ENV ==='development'){
  environmentConfig = new Dotenv()
}
else{
environmentConfig = new DefinePlugin({"process.env.GOOGLE_MAPS_API_KEY": `${process.env.GOOGLE_MAPS_API_KEY}`})
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
    new DefinePlugin(({}))
  ]
}
