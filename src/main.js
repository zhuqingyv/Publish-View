/*
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:37:35
 * @LastEditTime: 2020-08-31 19:36:10
 * @LastEditors: zhuqingyu
 */
import Vue from "vue";
import App from "./App.vue";
// sass
import "./style/index.scss";

// 全局组件
import global from "./global/index.js";
import Event from "./event/index.js";

// elementUI
import ElementUI from "element-ui"; //element-ui的全部组件
import "element-ui/lib/theme-chalk/index.css"; //element-ui的css

Vue.config.productionTip = false;
Vue.use(global);
Vue.use(Event);
Vue.use(ElementUI); //使用elementUI

new Vue({
  render: (h) => h(App),
}).$mount("#app");
