<!--
 * @Author: zhuqingyu
 * @Date: 2020-08-26 15:26:30
 * @LastEditTime: 2020-08-27 19:04:29
 * @LastEditors: zhuqingyu
-->
<template>
  <div class="project" @click="checkProject">
    <span>{{ projectData.name }}</span>
  </div>
</template>
<script>
export default {
  name: "project",
  data() {
    return {};
  },
  props: {
    projectData: {
      default: () => ({}),
    },
  },
  methods: {
    checkProject() {
      this.$emit("checkProject", this.projectData);
    },
  },
};
</script>
<style scoped lang="scss">
.project {
  height: 50px;
  line-height: 50px;
  background-color: #cdd5df;
  color: #fff;
  font-size: 25px;
  text-indent: 6px;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  font-weight: bolder;
  user-select: none;
  cursor: pointer;
  transition: opacity 0.5s;
  span {
    display: inline-block;
    text-indent: 34px;
  }
}
.project:hover {
  opacity: 0.5;
}
</style>
