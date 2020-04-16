const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPulgin = require('html-webpack-plugin')

// 判断当前环境变量是否是“开发环境”
const isDev = process.env.WEBPACK_ENV == 'development'

var getHtmlConfig = function (htmlName, title) {
	return {
		template: './src/view/' + htmlName + '.html',
		filename: 'view/' + htmlName + '.html',
		inject: true,
		hash: true,
		title: title,
		chunks: ['common', htmlName],
	}
}
var config = {
	// 入口
	entry: {
		common: ['./src/page/common/index.js'],
		index: ['./src/page/index/index.js'],
		result: ['./src/page/result/index.js'],
	},
	// 出口
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].bundle.js',
	},
	// 引入jquery（cdn方式），减少项目体积
	externals: {
		jquery: 'window.jQuery',
	},
	// 项目目录别名
	resolve: {
		alias: {
			node_modules: path.join(__dirname, 'node_modules'),
			util: path.join(__dirname, 'src/util'),
			page: path.join(__dirname, 'src/page'),
			service: path.join(__dirname, 'src/service'),
			image: path.join(__dirname, 'src/image'),
		},
	},
	// loader
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
				test: /\.(woff(2)?|eot|ttf|otf)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 2048,
							name: '[name].[hash:8].[ext]',
							outputPath: '/css/common',
						},
					},
				],
			},
			{
				test: /\.string$/,
				loader: 'html-loader',
			},
		],
	},
	plugins: [
		// 把css单独打包到文件里，否则将会打包在js文件中
		new ExtractTextPlugin('css/[name]/[name].css'),
		// html模板处理
		new HtmlWebpackPulgin(getHtmlConfig('index', '首页')),
		new HtmlWebpackPulgin(getHtmlConfig('result', '操作结果页')),
	],
	optimization: {
		splitChunks: {
			minSize: 10,
			cacheGroups: {
				common: {
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
		// host: 'localhost',
		host: 'localhost.charlesproxy.com',
		port: '8089',
		inline: true, // 是否试试刷新
		historyApiFallback: true, //找不到页面默认跳index.html
		// open: true, 我们在package.json中使用--open了，这里就不用了
		disableHostCheck: true,
	}
}

module.exports = config