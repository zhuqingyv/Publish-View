/*
 * @Author: zhuqingyu
 * @Date: 2020-08-28 14:31:07
 * @LastEditTime: 2020-08-29 23:07:39
 * @LastEditors: zhuqingyu
 */
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {}
};