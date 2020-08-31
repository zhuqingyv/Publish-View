<!--
 * @Author: zhuqingyu
 * @Date: 2020-08-24 18:37:35
 * @LastEditTime: 2020-08-28 23:15:23
 * @LastEditors: zhuqingyu
-->
<template>
  <transition name="bounce">
    <div id="app">
      <component :is="currentPage" @login="login"></component>
      <!-- <login v-if /> -->
      <tip />
    </div>
  </transition>
</template>

<script>
import login from "./components/login/login";
import publish from "./components/publish/publish";
import Event from "event";
export default {
  name: "App",
  data() {
    return {
      list: ["login", "publish"],
      currentPage: "login",
    };
  },
  components: { login, publish },
  methods: {
    login(bool) {
      if (bool) {
        this.currentPage = "publish";
      }
    },
    reLogin() {
      this.currentPage = "login";
    },
  },
  mounted() {
    // token 失效重新登陆
    Event.$on("reLogin", this.reLogin);
  },
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  background: rgb(225, 229, 238);
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
