const Dotenv = require('dotenv-webpack');

let environmentConfig;
if(process.env.NODE_ENV ==='development'){
  environmentConfig = new Dotenv()
}
else{
environmentConfig = new Dotenv({systemvars:true})
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
