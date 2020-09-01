/*
 * @Author: zhuqingyu
 * @Date: 2020-08-29 11:04:39
 * @LastEditTime: 2020-09-01 16:02:25
 * @LastEditors: zhuqingyu
 */
const proxy = {
	public: `${process.env.VUE_APP_HTTP}`,
	publicSocket: `${process.env.VUE_APP_SOCKET}`,
};

export default new Proxy(proxy, {
	get(target, value) {
		const baseUrl = target[`${value}`];

		if (baseUrl) {
			return function (api) {
				const url = `${baseUrl}${api}`;

				// 带证书的 地址转换
				if (window.location.href.startsWith("https")) {
					if (!url.startsWith("https")) {
						url.replace("http", "https");
					}
					if (!url.startsWith("wss")) {
						url.replace("ws", "wss");
					}
				}
				return url;
			};
		} else {
			return (api) => {
				throw new Error(`${api}的代理没有找到！`);
			};
		}
	},
});