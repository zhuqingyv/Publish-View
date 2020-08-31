<!--
 * @Author: zhuqingyu
 * @Date: 2020-08-26 16:38:39
 * @LastEditTime: 2020-08-28 16:52:58
 * @LastEditors: zhuqingyu
-->
<template>
  <div class="projectInfo">
    <div class="info_base">
      <p class="projectItem">
        <span>名称:</span>
        <span>{{ project.name }}</span>
      </p>
      <p class="projectItem">
        <span>描述:</span>
        <span>{{ project.description }}</span>
      </p>

      <p class="projectItem">
        <span>gitHub名称:</span>
        <span>{{ project.gitName }}</span>
      </p>
      <p class="projectItem">
        <span>版本:</span>
        <span>{{ project.version }}</span>
      </p>
      <p class="projectItem">
        <span>ID:</span>
        <span>{{ project.id }}</span>
      </p>
      <p class="projectItem">
        <span>github地址:</span>
        <span>
          <a :href="project.url">{{ project.url }}</a>
        </span>
      </p>
    </div>
    <div class="info_package">
      <p class="title">package.json</p>
      <pre>{{ project.packageJson }}</pre>
    </div>
  </div>
</template>
<script>
export default {
  name: "projectInfo",
  data() {
    return {};
  },
  props: {
    project: {
      default: () => ({}),
    },
  },
  computed: {},
};
</script>
<style scoped lang="scss">
.projectInfo {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  height: 100%;
  .info_base {
    transition: all 0.5s;
    // background: red;
    .projectItem {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      height: 45px;
      span {
        display: inline-block;
        line-height: 45px;
        a {
          text-decoration: none;
          color: darkcyan;
        }
      }
      span:first-child {
        width: 100px;
        font-weight: bolder;
        color: #777777 !important;
      }
    }
  }
  .info_package {
    // background: green;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    overflow: scroll;
    transition: all 0.5s;
    .title {
      line-height: 42px;
      margin: 0;
      text-indent: 30px;
    }
    pre {
      padding-left: 50px;
      background: rgba($color: #000000, $alpha: 0.1);
      margin: 0;
    }
  }
}
</style>
