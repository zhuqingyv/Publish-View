<template>
  <div class="__publishing">
    <div class="icon el-icon-delete-solid" @click="deleteProject"></div>
    <div class="button-box">
      <div
        @click="run('install')"
        class="button"
        style="float:right;display:inline-block;"
        id="install"
      >安装</div>
      <div
        @click="run('build')"
        class="button"
        style="float:right;display:inline-block;"
        id="build"
      >打包</div>
      <div
        @click="run('online')"
        class="button"
        style="float:right;display:inline-block;"
        id="online"
      >发布</div>
    </div>

    <div class="scrollViewContainer">
      <div ref="scrollIntoView" id="scrollIntoView">
        <p v-for="(msg, index) in installMessage" :key="index" :class="msg.type">
          <span>{{ index + 1 }}.&nbsp;</span>
          <span>{{ msg.info }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import Event from "event";
import { Loading } from "element-ui";

export default {
  name: "publishing",
  data() {
    return {
      socketHub: {},
      installMessage: [],
      heartBeatTime: 5000, // 心跳时间
      options: {
        target: "#anzhuang",
        background: "rgba(0,0,0,0.2)",
      },
      api: {
        install: {
          url: "ws://localhost:8081/publish/home/projects/install",
          options: {
            target: "#install",
            background: "rgba(0,0,0,0.2)",
          },
        },
        build: {
          url: "ws://localhost:8081/publish/home/projects/build",
          options: {
            target: "#build",
            background: "rgba(0,0,0,0.2)",
          },
        },
        online: {
          url: "ws://localhost:8081/publish/home/projects/online",
          options: {
            target: "#online",
            background: "rgba(0,0,0,0.2)",
          },
        },
      },
      i: 0,
    };
  },
  props: ["project"],
  methods: {
    deleteProject() {
      this.$emit("deleteProject", this.project);
    },
    running(request) {
      let message;
      const $this = this;
      try {
        message = JSON.parse(request.data);
        const installMessage = message.info; // 安装消息
        this.setInfo(message);
        const scrollIntoView = document.querySelector("#scrollIntoView");
        if (scrollIntoView) {
          scrollIntoView.scrollIntoView({
            block: "end",
            inline: "nearest",
            behavior: "smooth",
          });
        }
      } catch (err) {
        // 第一次会返回socketID
        message = request.data;
        const socketID = message;
        const ws = request.target;
        ws.socketID = socketID;
        const heartBeat = setInterval(() => {
          $this.heartBeat(socketID);
        }, $this.heartBeatTime);
        this.socketHub[socketID] = {
          socketID,
          heartBeat,
          ws,
        };
        ws.send(
          JSON.stringify({
            socketID: socketID,
            projectID: this.project.id,
            token: Cookies.get("PublishLoginToken"),
          })
        );
      }
    },
    run(api) {
      if (this.Loading) return;
      const options = this.api[api].options;
      this.Loading = Loading.service(options);
      const token = Cookies.get("PublishLoginToken");

      if (!token) {
        Event.$emit("reLogin");
        return;
      }
      try {
        if (token && this.project) {
          const ws = new WebSocket(this.api[api].url);
          ws.onopen = (request) => {
            ws.onmessage = this.running.bind(this);
            ws.onerror = this.socketError.bind(this);
            ws.onclose = this.socketClose.bind(this);
          };
        }
      } catch (err) {
        this.cleatSocket();
      }
    },

    heartBeat(socketID) {
      let wsInfo = this.socketHub[socketID];
      if (wsInfo && wsInfo.ws) {
        if (wsInfo.ws.readyState !== WebSocket.OPEN) {
          this.cleatSocket(socketID);
          return;
        }
        wsInfo.ws.send(
          JSON.stringify({
            heartBeat: true,
            socketID,
          })
        );
      }
    },

    socketError(request) {
      this.cleatSocket();
      this.i = 0;
    },
    socketClose(request) {
      this.cleatSocket();
      console.log(`socket关闭！`, request);
      this.i = 0;
    },

    // 清理掉一个 socket
    cleatSocket(socketID) {
      let wsInfo = this.socketHub[socketID];
      if (wsInfo && wsInfo.ws) {
        const ws = wsInfo.ws;
        clearInterval(wsInfo.heartBeat);
        // 关闭socket
        ws.close();
        // 清除对象的引用
        this.socketHub[socketID] = null;
      }

      if (this.Loading) {
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.Loading.close();
          this.Loading = null;
        });
      }
      this.i = 0;
    },

    setInfo(message) {
      const info = message.info;
      const type = message.type;
      const end = message.end;
      const $this = this;
      const arr = info.split("\n").reduce((pre, cur) => {
        if (cur) {
          pre.push({
            type: type,
            info: cur,
          });
        }
        return pre;
      }, []);
      arr.forEach((msg, i) => {
        setTimeout(() => {
          $this.installMessage.push(msg);
        }, ($this.i + i + 1) * 30);
      });
      this.i = this.i + arr.length;
    },
  },
  mounted() {
    const scrollIntoView = this.$refs.scrollIntoView;
    if (scrollIntoView) {
      scrollIntoView.scrollIntoView({ block: "end", inline: "nearest" });
    }
  },
};
</script>
<style scoped lang="scss">
.__publishing {
  font-size: 20px;
  .icon:hover {
    color: #3f9eff;
  }
  .scrollViewContainer {
    background: #cccccc;
    padding: 50px;
    height: 500px;
    overflow: scroll;
    .warn {
      color: chocolate;
      animation: warn 0.05s;
    }
    .log {
      color: darkgreen;
      animation: log 0.05s;
    }
    #scrollIntoView {
      padding: 50px;
    }
    @keyframes warn {
      0% {
        transform: scale(1);
        color: chocolate;
      }
      50% {
        transform: scale(1.01);
        color: darkred;
      }
      100% {
        transform: scale(1);
        color: chocolate;
      }
    }
    @keyframes log {
      0% {
        transform: scale(1);
        opacity: 0;
        margin-left: 100px;
      }
      100% {
        transform: scale(1);
        opacity: 1;
        margin-left: 0px;
      }
    }
  }
  .button-box {
    display: inline-flex;
    justify-content: space-around;
    width: 300px;
    position: absolute;
    bottom: 20px;
    z-index: 999;
    .button {
      border-radius: 4px;
      padding: 5px 12px;
      border: 1px solid #cccccc;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }
    .button:hover {
      background: #3f9eff;
      color: #ffffff;
      border-color: #3f9eff;
    }
  }
}
</style>
