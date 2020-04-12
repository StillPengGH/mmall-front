const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPulgin = require('html-webpack-plugin')

// 判断当前环境变量是否是“开发环境”
const isDev = process.env.WEBPACK_ENV == 'development'

var getHtmlConfig = function (htmlName) {
	return {
		template: './src/view/' + htmlName + '.html',
		filename: 'view/' + htmlName + '.html',
		inject: true,
		hash: true,
		chunks: ['common', htmlName],
	}
}

var config = {
	entry: {
		index: ['./src/page/index.js'],
		a: ['./src/page/a.js'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].bundle.js',
	},
	externals: {
		jquery: 'window.jQuery',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				}),
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4096, // 小于4kb则图片转为base64编码，大于则转为图片
							name: '[name].[hash:8].[ext]', // 打包后图片名称[ext]指图片格式
							outputPath: '/static/img/', // 输出路径
						},
					},
				],
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 2048,
							name: '[name].[hash:8].[ext]',
							outputPath: 'static/img/',
						},
					},
				],
			},
		],
	},
	plugins: [
		new ExtractTextPlugin('/css/[name].css'),
		new HtmlWebpackPulgin(getHtmlConfig('index')),
		new HtmlWebpackPulgin(getHtmlConfig('a')),
	],
	optimization: {
		splitChunks: {
			minSize: 10,
			cacheGroups: {
				default: {
					name: 'common', // 提取出来公共模块的名称
					chunks: 'initial', // 指定哪些chunk参与拆分
					minChunks: 2, // 模块被引用次数大于等于2才被提取
					priority: -20,
				},
				// vendors: {
				// 	test: /[\\/]node_modules[\\/]/,
				// 	name: 'vendor',
				// 	chunks: 'initial',
				// 	priority: -10,
				// },
				// locallib: {
				// 	// 拆分指定文件
				// 	test: /(src[\\/]page[\\/]locallib\.js)$/,
				// 	name: 'locallib',
				// 	chunks: 'initial',
				// 	priority: -9,
				// },
			},
		},
	},
	mode: 'development',
}

// 开发环境才添加webpack-dev-server
if (isDev) {
	config.devServer = {
		contentBase: './dist', // 服务器所加载文件目录
		host: 'localhost',
		port: '8089',
		inline: true, // 是否试试刷新
		historyApiFallback: true, //找不到页面默认跳index.html
		open: true,
	}
}

module.exports = config
