const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    baseUrl: '/',
    outputDir: 'dist',
    productionSourceMap: false,

    pages: {
        manage: {
            // entry for the page
            entry: 'src/main.js',
            // the source template
            template: 'src/index.html',
            // output as dist/index.html
            filename: 'index.html'
        },
    },

    devServer: {
        open: false, //配置自动启动浏览器
        https: false, // https:{type:Boolean}
        port: 8080,
        disableHostCheck: true,
        proxy: {
            '/api': {
                // target: 'https://dsd.bb.tenv.dsdcoin.app/bbapi',
                target:
                // 'https://admin.tenv.dsdcoin.app/bbapi',
                // 'http://192.168.2.89:8000',
                    'http://10.10.10.29:9000',
                // 'https://app.tenv.dsdiot.com/bbapi',
                // 'https://admin.tenv.dsdiot.com',
                // 'http://192.168.1.181:8080',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },

    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                path.resolve(__dirname, 'src/assets/less/*.less'),
            ]
        }
    },
    lintOnSave: true,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_assets', resolve('src/assets'))
            .set('_components', resolve('src/components'))
            .set('_views', resolve('src/views'))
            .set('_utils', resolve('src/utils'))
    }
}