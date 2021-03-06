const Dotenv = require('dotenv-webpack');
const DefinePlugin = require('webpack').DefinePlugin;

let environmentConfig;
if (process.env.NODE_ENV !== 'production') {
  environmentConfig = new Dotenv();
} else {
  environmentConfig = new DefinePlugin({
    'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
  });
}
module.exports = {
  entry: ['./client/index.js'],
  output: {
    path: __dirname,
    filename: './public/bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
      {
        test: /\.(png)$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(sass|scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'public/map-logo.png',
            outputPath: 'fonts/',
          },
        },
      },
    ],
  },

  plugins: [environmentConfig],
};
