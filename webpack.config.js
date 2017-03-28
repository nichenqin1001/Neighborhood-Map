var path = require('path');
var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js',
        publicPath: 'http://localhost:8080'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }]
    },
    plugins: [
        new Webpack.ProvidePlugin({
            ko: 'knockout'
        }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
    ]
};
