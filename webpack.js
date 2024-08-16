const path = require('path');

module.exports = {
  mode: 'development',  // Set this to 'development' or 'production'
  entry: './src/app3.js', // Make sure this path is correct
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@azure/storage-blob': require.resolve('@azure/storage-blob'),
    },
  },
};
