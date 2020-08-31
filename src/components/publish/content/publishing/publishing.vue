<template>
  <div class="__publishing">
    <div class="icon el-icon-delete-solid" @click="clearLog"></div>
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
      <div @click="preload(true)" class="button" style="float:right;display:inline-block;">预览</div>
    </div>

    <div class="scrollViewContainer">
      <div ref="scrollIntoView" id="scrollIntoView">
        <p
          v-for="(msg, index) in installMessage"
          :key="index"
          :class="msg.type"
          class="messageItem"
        >
          <span>{{ index + 1 }}.&nbsp;</span>
          <span>{{ msg.info }}</span>
        </p>
      </div>
    </div>

    <div class="preload" v-if="showPreload">
      <iframe :src="iframUrl" frameborder="0"></iframe>
      <input type="text" v-model="preloadUrl" @keyup.enter="iframUrl = preloadUrl" />
      <button @click="preload(false)">X</button>
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
      }, // http://publish.pianoboy.club/
      api: {
        install: {
          url: "ws://publish.pianoboy.club:8081/publish/home/projects/install",
          options: {
            target: "#install",
            background: "rgba(0,0,0,0.2)",
          },
        },
        build: {
          url: "ws://publish.pianoboy.club:8081/publish/home/projects/build",
          options: {
            target: "#build",
            background: "rgba(0,0,0,0.2)",
          },
        },
        online: {
          url: "ws://publish.pianoboy.club:8081/publish/home/projects/online",
          options: {
            target: "#online",
            background: "rgba(0,0,0,0.2)",
          },
        },
      },
      i: 0,
      showPreload: false, //是否显示预览
      preloadUrl: "", // 预览Url
      iframUrl: "",
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

    preload(bool) {
      this.showPreload = bool;
      if (!bool) {
        this.iframUrl = "";
        this.preloadUrl = "";
      }
    },

    clearLog() {
      for (let i = this.installMessage.length; i >= 0; i--) {
        this.installMessage.splice(i, 1);
      }
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
    cursor: pointer;
  }
  .scrollViewContainer {
    background: #cccccc;
    border-width: 50px 50px 65px 50px;
    border-style: solid;
    border-color: #cccccc;
    height: 500px;
    overflow: scroll;
    border-radius: 4px;
    #scrollIntoView {
      border-radius: 4px;
      .warn {
        color: chocolate;
        animation: warn 0.05s;
      }
      .log {
        color: darkgreen;
        animation: log 0.05s;
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
      .el-icon-document {
        display: none;
      }
      .messageItem:hover .el-icon-document {
        display: block;
        color: #ffffff;
        float: right;
        font-weight: bolder;
        cursor: pointer;
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
  .preload {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 15;
    border: none;
    top: 0;
    left: 0;
    input {
      outline: none;
      width: 250px;
      height: 30px;
      border: 1px solid #000;
      position: absolute;
      top: 20px;
      left: 50%;
      margin-left: -125px;
      background: rgba(255, 255, 255, 0.5);
    }
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    button {
      position: absolute;
      right: 50px;
      top: 20px;
      border: 1px solid #ffffff;
      width: 25px;
      height: 25px;
      border-radius: 50px;
      line-height: 24px;
      text-align: center;
      background: brown;
      color: #ffffff;
      user-select: none;
      cursor: pointer;
    }
    button:hover {
      transform: scale(1.2);
    }
  }
}
</style>
