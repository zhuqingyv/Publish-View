/*
 * @Author: zhuqingyu
 * @Date: 2020-08-25 16:19:04
 * @LastEditTime: 2020-08-29 23:29:10
 * @LastEditors: zhuqingyu
 * // 发送 POST 请求
 * axios({
    method: 'post',
    url: '/user/12345',
    data: {
     firstName: 'Fred',
     lastName: 'Flintstone'
 *  }
 * });
 *
 * axios({
  method:'get',
  url:'http://bit.ly/2mTM3nY',
  responseType:'stream'
})
  .then(function(response) {
  response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
});
 */
import axios from 'axios';
import socketHub from './socketHub.js';
import proxy from './proxy.js';

export default function (option) {

  // 如果是socket对象，就返回一个 特殊 Promise
  if (option.method === 'socket') {
    option.url = proxy.publicSocket(option.url);
    return socketHub.add(option);
  }
  // 普通 http 请求
  option.url = proxy.public(option.url);
  return axios(option);
}