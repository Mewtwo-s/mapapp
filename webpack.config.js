const Dotenv = require('dotenv-webpack');
const DefinePlugin = require('webpack').DefinePlugin;

let environmentConfig;
if (process.env.NODE_ENV !== 'production') {
  environmentConfig = new Dotenv();
} else {
  environmentConfig = new DefinePlugin({
    'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
    'process.env.MAIL_USERNAME': JSON.stringify(process.env.MAIL_USERNAME),
    'process.env.MAIL_PASSWORD': JSON.stringify(process.env.MAIL_PASSWORD),
    'process.env.OAUTH_CLIENTID': JSON.stringify(process.env.OAUTH_CLIENTID),
    'process.env.OAUTH_CLIENT_SECRET': JSON.stringify(process.env.OAUTH_CLIENT_SECRET),
    'process.env.OAUTH_REFRESH_TOKEN': JSON.stringify(process.env.OAUTH_REFRESH_TOKEN),
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
  resolve: {
    alias: {
      process: 'process/browser',
    },
    fallback: {
      buffer: false,
      stream: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      crypto: false,
      cheerio: false,
      parse5: false,
      constants: false,
      assert: false,
      fs: false,
      url: false,
      vm: false,
      querystring: false,
      os: false,
      child_process: false,
      worker_threads: false,
      inspector: false,
      process: false,
      util: require.resolve('util/'),
    },
  },
  plugins: [environmentConfig],
};
