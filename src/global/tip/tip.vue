<!--
 * @Author: zhuqingyu
 * @Date: 2020-08-25 15:17:47
 * @LastEditTime: 2020-08-26 23:26:12
 * @LastEditors: zhuqingyu
-->
<template>
  <transition name="slide-fade">
    <div v-show="option.show" class="__tip">
      <span
        class="iconfont"
        :class="option.bool ? 'iconyuanxingxuanzhongfill' : 'icontishifill'"
      ></span>
      <span>{{ option.title || "提示" }}</span>
    </div>
  </transition>
</template>
<script>
import Event from "event";
export default {
  name: "tip",
  data() {
    return {
      option: {
        show: false,
        bool: false,
        title: "提示！",
      },
    };
  },
  watch: {
    option: {
      handler(val) {
        if (val.show) {
          setTimeout(() => {
            this.option.show = false;
          }, 800);
        }
      },
    },
  },
  methods: {
    showTip(option) {
      console.log(option);
      this.option = option;
    },
  },
  mounted() {
    Event.$on("showTip", this.showTip);
  },
  destroyed() {
    Event.$off("showTip", this.showTip);
  },
};
</script>
<style scoped lang="scss">
.__tip {
  position: fixed;
  z-index: 9999999;
  display: inline-flex;
  top: 25px;
  left: 3px;
  height: 30px;
  background: #ffffff;
  padding: 0 16px;
  border-radius: 4px;
  transform: translateX(-50%);
  left: 50%;
  animation: showTip 0.2s;
  span {
    line-height: 30px;
  }
  .iconfont {
    margin-right: 8px;
  }
  .iconyuanxingxuanzhongfill {
    color: #79eb56;
  }
  .icontishifill {
    color: #e04646;
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  top: 0px;
  opacity: 0;
}
</style>
