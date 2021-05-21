const Dotenv = require('dotenv-webpack');
const DefinePlugin = require('webpack').DefinePlugin;

let environmentConfig;
if(process.env.NODE_ENV !=='production'){

  environmentConfig = new Dotenv()
}
else{

environmentConfig = new DefinePlugin({
  'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY)
}
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
//   resolve: {
//     fallback: {
//       "buffer": false,
//       "stream": false,
//       "net": false,
//       "path": false,
//       "zlib": false,
//       "http": false,
//       "https": false,
//       "crypto": false,
//       "cheerio": false,
//       "parse5": false
//     } 
// }
  plugins: [
   environmentConfig
  ]
}
