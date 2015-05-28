var path = require('path')

module.exports = {
    entry: {
        app: path.join(__dirname, 'src/app.js')
    },
    output: {
        filename: 'lib/bundle.js'
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']}
        ]
    }
}
