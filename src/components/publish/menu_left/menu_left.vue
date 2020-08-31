<!--
 * @Author: zhuqingyu
 * @Date: 2020-08-26 14:48:52
 * @LastEditTime: 2020-09-01 02:18:38
 * @LastEditors: zhuqingyu
-->
<template>
  <el-aside class="__publish_menu_left">
    <el-menu class="__piblish_menu">
      <el-submenu index="1">
        <template slot="title">
          <i class="iconfont iconiconzhengli_xiangmu" style="font-size:20px;margin-right:6px;"></i>Projects
        </template>
        <el-menu-item-group class="listBox">
          <template slot="title">选择一个待发布的 gitHub 项目</template>
          <project
            :projectData="project"
            v-for="(project, index) in projects"
            :key="index"
            @checkProject="checkProject"
          />
          <div class="iconfont iconjiahao1 add-project" @click="showDialog"></div>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <motiDialog @submit="addProject" ref="dialog" />
  </el-aside>
</template>
<script>
import project from "./project/project";

export default {
  name: "menuLeft",
  data() {
    return {
      currentProject: null,
    };
  },
  props: {
    projects: {
      default: () => [],
    },
  },
  components: { project },
  methods: {
    checkProject(project) {
      this.currentProject = project;
      this.$emit("checkProject", project);
    },
    showDialog() {
      this.$refs.dialog.option.show = true;
    },
    addProject(data) {
      this.$emit("addProject", data);
    },
  },
};
</script>
<style scoped lang="scss">
.__publish_menu_left {
  width: 250px;
  background-color: #d3dce6;
  border-right: 1px solid #d3dce6;
  box-shadow: #ccc 1px 1px 6px;
  .__piblish_menu {
    width: 100%;
    background-color: #ecf5ff;
    box-shadow: #ccc 1px 1px 6px;
    .listBox {
      padding: 0;
    }
    .add-project {
      width: 100%;
      height: 50px;
      line-height: 50px;
      background-color: #cdd5df;
      color: #fff;
      font-size: 25px;
      // text-indent: 6px;
      font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
      font-weight: bolder;
      user-select: none;
      cursor: pointer;
      transition: opacity 0.5s;
      text-align: center;
    }
    .add-project:hover {
      opacity: 0.5;
    }
  }
}
</style>
