const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        library: ['Motion'],
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }
                
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
