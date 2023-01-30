const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");
const getPort = require('get-port');

module.exports = (async () => {
    const port = await getPort({ port: getPort.makeRange(8080, 8100) });
    return {
        mode: 'development',
        devtool: 'eval-cheap-module-source-map',
        entry: './src/index.js',
        devServer: {
            port: port,
            host: '0.0.0.0',
            contentBase: path.join(__dirname, "dist"),
            disableHostCheck: true,
            useLocalIp: true,
            proxy: {
                    /* hack webpack dev server to serve pretty url */
                    /* TODO: handle non HTML files request, e.g. http://localhost:8080/main.css */
                    '/': {
                        target: 'http://localhost:' + port,
                        pathRewrite: function (path, req) {
                            return path.replace(/(.+)/, '$1.html');
                        }
                    }
                }
        },
        node: {
            fs: 'empty'
        },
        module: {
            rules: [
                {   
                    test: /\.hbs$/,
                    loader: "handlebars-loader",
                    query: { inlineRequires: '/img/' }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                },
                {
                    test: /\.(scss|css)$/,
                    use: [
                        {
                            // creates style nodes from JS strings
                            loader: "style-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            // translates CSS into CommonJS
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            // compiles Sass to CSS
                            loader: "sass-loader",
                            options: {
                                outputStyle: 'expanded',
                                sourceMap: true,
                                sourceMapContents: true
                            }
                        }
                        // Please note we are not running postcss here
                    ]
                }
                ,
                {
                    //load images + pdf
                    test: /\.(png|svg|jpg|gif|pdf|webp)$/,
                    include: [
                        path.resolve(__dirname, 'src/assets/img')
                    ],
                    use: {
                        loader: 'file-loader',
                        options: {
                            publicPath: '/'
                        }
                    }
                }
                ,
                {
                    // Match woff2 in addition to patterns like .woff?v=1.1.1.
                    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    use: {
                        loader: "url-loader",
                        options: {
                        // Limit at 50k. Above that it emits separate files
                        limit: 1500000,

                        // url-loader sets mimetype if it's passed.
                        // Without this it derives it from the file extension
                        mimetype: "application/font-woff",

                        // Output below fonts directory
                        name: "./fonts/[name].[ext]",
                        }
                    },
                }
            ],
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    handlebarsLoader: {}
                }
            }),
            new HtmlWebpackPlugin({
                template: './pages/index.hbs',
                filename: 'index.html'
            }),
            new HtmlWebpackPlugin({
                template: './pages/terms-conditions.hbs',
                filename: 'terms-conditions.html'
            }),
            new HtmlWebpackInjector(),
            new MiniCssExtractPlugin({
                filename: 'styles.[contenthash].css'
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    map: {
                        inline: false,
                    },
                    discardComments: {
                        removeAll: true
                    },
                    discardUnused: false
                },
                canPrint: true
            }),
            new CopyPlugin([
                { from: 'static', to: '.' },
            ]),
            new UnusedFilesWebpackPlugin({
                patterns: ['src/assets/img/**/*.*'],
                globOptions: {
                    ignore: [
                        'src/assets/img/favicon.png',
                        'src/assets/img/favicon.svg'
                    ]
                }
            })
        ]
    }
});
