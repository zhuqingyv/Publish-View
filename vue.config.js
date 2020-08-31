/*
 * @Author: zhuqingyu
 * @Date: 2020-07-23 14:49:02
 * @LastEditTime: 2020-08-29 22:51:47
 * @LastEditors: zhuqingyu
 */

const path = require('path');

module.exports = {
	configureWebpack: {
		// 为了使用npm link 调试本地项目，所以需要禁用掉该规则。避免追踪软连接实际地址
		// https://github.com/webpack/webpack/issues/811#issuecomment-309797397
		resolve: {
			symlinks: false,
			extensions: ['.js', '.vue', '.json'],
			alias: {
				event: path.resolve(__dirname, './src/event/index.js'),
				api: path.resolve(__dirname, './src/api/index.js')
			}
		},
		optimization: {
			minimizer: []
		}
	},

	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost',
				changeOrigin: true
			}
		}
	}
};