const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const buildPath = path.resolve(__dirname, 'dist');

module.exports = (async () => {
    return {
        devtool: 'source-map',
        entry: './src/index.js',
        output: {
            filename: '[name].[hash:20].js',
            path: buildPath
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
                    test: /\.(scss|css|sass)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            // translates CSS into CommonJS
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        /*{ 
                            // Breaks css in production
                            // Runs compiled CSS through postcss for vendor prefixing
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },*/
                        {
                            // compiles Sass to CSS
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'expanded',
                                sourceMap: true,
                                sourceMapContents: true
                            }
                        }
                    ]
                },
                {
                //load images + pdf
                    test: /\.(png|svg|jpg|gif|pdf|webp)$/,
                    include: [
                        path.resolve(__dirname, 'src/assets/img')
                    ],
                    use: {
                        loader: 'file-loader',
                        options: {
                            publicPath: ''
                        }
                    }
                }
                ,
                {
                    // Load all icons
                    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './pages/index.hbs',
                filename: 'index.html',
                minify: false, // Disable minification during production mode
                hash: true
            }),
            new HtmlWebpackPlugin({
                template: './pages/terms-conditions.hbs',
                filename: 'terms-conditions.html',
                minify: false, // Disable minification during production mode
                hash: true
            }),
            new HtmlWebpackInjector(),
            new CleanWebpackPlugin(buildPath),
            new FaviconsWebpackPlugin({
                // Your source logo
                logo: './src/assets/img/fav.png',
                // The prefix for all image files (might be a folder or a name)
                prefix: 'icons-[hash]/',
                // Generate a cache file with control hashes and
                // don't rebuild the favicons until those hashes change
                persistentCache: true,
                // Inject the html into the html-webpack-plugin
                inject: true,
                // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
                background: '#fff',
                // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
                title: 'Acre',

                // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
                icons: {
                    android: true,
                    appleIcon: true,
                    appleStartup: true,
                    coast: false,
                    favicons: true,
                    firefox: true,
                    opengraph: false,
                    twitter: false,
                    yandex: false,
                    windows: false
                }
            }),
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
            new ImageminPlugin({
                test: /\.(png|jpg|gif)$/i,
                pngquant: {
                    quality: '85-95'
                },
                optipng: {
                    optimizationLevel: 1
                }
            })
        ]
    }
});
