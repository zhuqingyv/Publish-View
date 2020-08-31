/*
 * @Author: zhuqingyu
 * @Date: 2020-08-29 09:37:49
 * @LastEditTime: 2020-08-29 16:49:31
 * @LastEditors: zhuqingyu
 * 【注】:_promise 的 init、then、catch、send、close 均不能 改变bind指向，比如 _promise.then.bind(context)，会报错！！
 */
const socketHub = {
	client: [],
	add(option) {
		const socket = new WebSocket(option.url);
		const client = this.client;
		const _promise = {
			socket,
			init(callback, context = socket) {
				if (!callback) {
					return;
				}
				callback.call(context, ...arguments);
			},
			send(_message) {
				let message;

				if (!_message) {
					message = '';
				} else if (typeof _message === 'string') {
					message = _message;
				} else if (typeof _message === 'object') {
					message = JSON.stringify(_message);
				} else {
					throw '类型错误！';
				}
				if (this.socket.readyState !== WebSocket.OPEN) {
					throw new Error('WebSocket is not open!');
				}

				this.socket.send(message);
			},
			then(callback, context = socket) {
				socket.onmessage = callback.bind(context);
				return this;
			},
			catch (callback, context) {
				socket.onerror = callback.bind(context);
				return this;
			},
			close(callback, context = socket, clear = true) {
				socket.onclose = callback.bind(context);
				// 默认清理掉
				const indexOf = client.indexOf(socket);

				if (clear && indexOf !== -1) {
					client.splice(indexOf, 1);
				}
				return this;
			}
		};

		this.client.push(_promise);

		return _promise;
	}
};

export default socketHub;