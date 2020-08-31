/*
 * @Author: zhuqingyu
 * @Date: 2020-08-25 15:20:18
 * @LastEditTime: 2020-08-28 14:47:09
 * @LastEditors: zhuqingyu
 */
import tip from './tip/tip.vue';
import motiDialog from './dialog/dialog.vue';
const components = [
	// { name: xxx, value: (vue组件: Object) }
	{
		name: 'tip',
		value: tip
	}, {
		name: 'motiDialog',
		value: motiDialog
	}
];

export default {
	install: Vue => {
		components.forEach(component => {
			Vue.component(component.name, component.value);
		});
	}
};