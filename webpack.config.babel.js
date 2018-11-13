import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';

// Config settings/paths
import CONFIG from './config.js'

module.exports = {
	mode: 'development',
	entry: ['babel-polyfill', './src/js/scripts.js'],
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js'
	},
	resolve : {
		alias: {
			leaf: path.resolve(__dirname, 'node_modules/leaflet/dist/'),
			markercluster: path.resolve(__dirname, 'node_modules/leaflet.markercluster/dist/'),
			awesomemarkers: path.resolve(__dirname, 'node_modules/leaflet.awesome-markers/dist/'),
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: path.resolve(__dirname, "src"),
				exclude: /(node_modules|bower_components)/,
				options: {
				  presets: ['@babel/preset-env']
				}
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {}
					},
					{
						loader: 'css-loader',
						options: {}
					},
					{
						loader: 'sass-loader',
						options: {
							includePaths: ['node_modules/font-awesome/scss']
						}
					}
				]
			},
			{
      	test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
        	name: 'images/[name].[ext]'
        }
      },
      {
       	test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
        	name: 'fonts/[name].[ext]'
        }
      }
		]
	},
	plugins: [
		new CleanWebpackPlugin(['public']),
		new MiniCssExtractPlugin({filename: "styles.css"}),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
		new BrowserSyncPlugin({
			server: ['./', 'public'],
	    port: 3000
		})
	]
}