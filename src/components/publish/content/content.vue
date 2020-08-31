<!--
 * @Author: zhuqingyu
 * @Date: 2020-08-26 14:48:56
 * @LastEditTime: 2020-08-31 10:53:24
 * @LastEditors: zhuqingyu
-->
<template>
  <el-container class="__publish_content" v-if="project">
    <el-header class="header">{{ project.name }}</el-header>
    <el-container>
      <el-header class="tab-header">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="基本信息">
            <projectInfo :project="project" />
          </el-tab-pane>
          <el-tab-pane label="Publish" name="third">
            <publishing :project="project" @deleteProject="deleteProject" />
          </el-tab-pane>
        </el-tabs>
      </el-header>
    </el-container>
  </el-container>
</template>
<script>
import projectInfo from "./projectInfo/projectInfo";
import publishing from "./publishing/publishing";
export default {
  name: "publishContent",
  data() {
    return {
      activeName: "基本信息",
    };
  },
  components: { projectInfo, publishing },
  props: {
    project: {
      default: () => ({}),
    },
  },
  watch: {
    activeName(val) {
      console.log(val);
    },
  },
  methods: {
    handleClick(data) {
      console.log(data);
    },
    deleteProject(project) {
      this.$emit("deleteProject", project);
    },
  },
};
</script>
<style scoped lang="scss">
.__publish_content {
  background-color: rgb(224 228 237);
  height: 100%;
  overflow-y: scroll;
  .header {
    background: #ffffff;
    font-size: 30px;
    color: #777777;
    line-height: 60px;
    text-shadow: #cccccc 2px 2px;
  }
}
</style>
