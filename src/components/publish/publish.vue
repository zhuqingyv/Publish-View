<!--
 * @Author: zhuqingyu
 * @Date: 2020-08-26 14:34:15
 * @LastEditTime: 2020-09-01 13:51:36
 * @LastEditors: zhuqingyu
-->
<template>
  <el-container
    class="__publish"
    v-loading="loading"
    :element-loading-text="loadingTitle"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-header class="header">Publish</el-header>
    <el-container>
      <menuLeft :projects="projects" @checkProject="checkProject" @addProject="addProject" />
      <publishContent :project="project" @deleteProject="deleteProject" />
    </el-container>
  </el-container>
</template>
<script>
import Api from "api";
import menuLeft from "./menu_left/menu_left";
import publishContent from "./content/content";
import Cookies from "js-cookie";

export default {
  name: "publish",
  data() {
    return {
      projects: [],
      project: null,
      loading: false,
      loadingTitle: "远程克隆git中",
      clone: null,
    };
  },
  components: { menuLeft, publishContent },
  methods: {
    getProjects() {
      const $this = this;
      const token = Cookies.get("PublishLoginToken");
      if (token) {
        Api({
          method: "post",
          url: "/publish/home/projects",
          data: {
            token,
          },
        })
          .then((data) => {
            console.log(data);
            const projects = data.data.projects;
            $this.projects = $this.projectsToArray(projects);
            console.log($this.projects);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    checkProject(project) {
      this.project = project;
    },
    deleteProject(project) {
      const $this = this;
      const token = Cookies.get("PublishLoginToken");
      $this.loading = true;
      $this.loadingTitle = "远程删除 git 仓库中！";
      Api({
        method: "post",
        url: "/publish/home/projects/delete",
        data: {
          id: project.id,
          token,
        },
      })
        .then((response) => {
          $this.projects = $this.projectsToArray(response.data.projects);
          $this.project = $this.projects[0];
          $this.loading = false;
        })
        .catch((err) => {
          console.warn("删除失败", err);
        });
    },
    addProject(data) {
      const $this = this;
      const token = Cookies.get("PublishLoginToken");
      $this.loading = true;
      $this.loadingTitle = "远程克隆 git 仓库中！";

      const clone = Api({
        method: "socket",
        url: "/publish/home/projects/add",
      });
      this.clone = clone;
      this.clone
        .then(this.cloneing, this)
        .catch(this.cloneError, this)
        .close(this.cloneEnd, this);
      this.clone.data = data;
    },
    cloneing(request) {
      const $this = this;
      try {
        const message = JSON.parse(request.data);
        if (message.end) {
          const projects = JSON.parse(message.publishJson);
          if (projects || projects.lenght) {
            this.projects = projects;
            this.project = this.projects[0];
          } else {
            this.clone = null;
            setTimeout(() => {
              $this.loading = false;
            }, 2000);
            return;
          }
          $this.loading = false;
          this.clone = null;
        }
        this.loadingTitle = message.cloneInfo;
      } catch (err) {
        if (!this.clone) throw "建立socket失败！";
        const token = Cookies.get("PublishLoginToken");
        const data = this.clone.data;
        const name = data.name;
        const url = data.url;
        const socketID = request.data;
        if (typeof request.data === "string") {
          request.target.send(
            JSON.stringify({
              token,
              name,
              url,
              socketID,
            })
          );
        }
      }
    },
    cloneEnd(request) {
      this.loading = false;
      this.clone = null;
    },
    cloneError(request) {
      this.loading = false;
      this.clone = null;
    },
    // projects 转 Array
    projectsToArray(projects) {
      const result = Object.keys(projects).reduce((pre, cur) => {
        if (projects[cur]) pre.push(projects[cur]);
        return pre;
      }, []);
      return result;
    },
  },
  mounted() {
    this.getProjects();
  },
};
</script>
<style lang="scss" scoped>
.__publish {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .header {
    background: #c4ced9;
    box-shadow: #ccc 1px 1px 6px;
    z-index: 10;
    text-align: center;
    font-size: 30px;
    font-weight: bolder;
    color: #ffffff;
    line-height: 60px;
    text-shadow: 2px 2px 5px #c3b3b3;
  }
}
</style>
