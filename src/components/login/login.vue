<!--
 * @Author: zhuqingyu
 * @Date: 2020-08-25 13:33:13
 * @LastEditTime: 2020-09-01 14:54:48
 * @LastEditors: zhuqingyu
-->
<template>
  <div class="__login" :class="show ? 'show' : 'hidden'" v-loading="loading">
    <div class="__login_title">{{ title }}</div>
    <div class="__login_content">
      <input
        type="text"
        v-model="form.name"
        placeholder="请输入账号"
        @mousedown="mousedown($event, form.name)"
        @change="change('name', $event.target.value)"
      />
      <input
        type="password"
        v-model="form.passWord"
        placeholder="请输入密码"
        @mousedown="mousedown($event, form.passWord)"
        @change="change('password', $event.target.value)"
      />
      <div class="__login_button button" @click="login()">登陆</div>
      <dir class="__login_tourist button" @click="touristLogin()">游客登陆</dir>
    </div>
  </div>
</template>
<script>
import Api from "api";
import Event from "event";
import Cookies from "js-cookie";

export default {
  name: "login",
  data() {
    return {
      title: "Publish 系统登陆",
      form: {
        name: "",
        passWord: "",
      },
      show: false,
      loading: false,
    };
  },
  methods: {
    // 鼠标按下事件
    mousedown(event, value) {
      if (!value) {
        event.target.value = "";
      }
    },
    change(type, value) {
      this.form[type] = value;
    },
    login(_body) {
      const $this = this;
      const name = this.form.name;
      const passWord = this.form.passWord;
      const uuid = Date.now();
      this.loading = true;
      let body = _body || {
        name,
        passWord,
        uuid,
      };
      if (!_body && (!name || !passWord)) {
        Event.$emit("showTip", {
          show: true,
          bool: false,
          title: `请填写账号名或密码！`,
        });
        $this.loading = false;
      } else {
        Api({
          method: "post",
          url: "/publish/login",
          data: body,
        })
          .then((response) => {
            const title = response.data.login ? "登陆成功" : "登陆失败";
            const token = response.data.token;
            if (token) {
              Cookies.set("PublishLoginToken", token);
            }
            Event.$emit("showTip", {
              show: true,
              bool: response.data.login,
              title: title,
            });
            $this.$emit("login", response.data.login);
            $this.loading = false;
          })
          .catch((err) => {
            Event.$emit("showTip", {
              show: true,
              bool: false,
              title: err.response ? err.response.data : "登陆失败！",
            });
            $this.loading = false;
            $this.show = true;
            $this.form.name = "";
            $this.form.passWord = "";
            console.clear();
          });
      }
    },
    touristLogin() {
      const $this = this;
      let body = {
        name: "tourist",
        passWord: "123456",
        uuid: Date.now(),
      };
      Api({
        method: "post",
        url: "/publish/login",
        data: body,
      })
        .then((response) => {
          const title = response.data.login ? "登陆成功" : "登陆失败";
          const token = response.data.token;
          Cookies.set("PublishLoginToken", "");
          Event.$emit("showTip", {
            show: true,
            bool: response.data.login,
            title: title,
          });
          $this.$emit("login", response.data.login);
          $this.loading = false;
        })
        .catch((err) => {
          Event.$emit("showTip", {
            show: true,
            bool: false,
            title: err.response ? err.response.data : "登陆失败！",
          });
          $this.loading = false;
          $this.show = true;
          $this.form.name = "";
          $this.form.passWord = "";
          console.clear();
        });
    },
  },
  mounted() {
    const token = Cookies.get("PublishLoginToken");
    if (token) {
      this.login({ token });
    } else {
      this.show = true;
    }
  },
};
</script>
<style lang="scss" scoped>
.__login {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  animation: blueBg 2s;
  animation-fill-mode: forwards;
  @keyframes blueBg {
    0% {
      background: #ffffff;
    }
    100% {
      background: #5a95d8;
    }
  }
  .__login_title {
    font-size: 45px;
    font-weight: bolder;
    color: #ffffff;
    text-shadow: 2px 2px 5px #c3b3b3;
    user-select: none;
    margin-bottom: 50px;
  }
  .__login_content {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #cccccc;
    padding: 30px;
    border-radius: 8px;
    animation: show 0.5s;
    background: #ffffff;
    box-shadow: #c3b3b3 0px 0px 30px 5px;
    input {
      border: 1px solid #cccccc;
      border-radius: 4px;
      height: 30px;
      width: 168px;
      margin-top: 12px;
      outline: none;
      font-size: 12px;
      color: #777777;
      text-indent: 6px;
      font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
    }
    .button {
      height: 30px;
      border: 1px solid #cccccc;
      border-radius: 4px;
      text-align: center;
      line-height: 30px;
      font-size: 14px;
      margin-top: 12px;
      user-select: none;
      cursor: pointer;
      padding: 4px 12px;
    }
    .button:hover {
      background: #1a74db;
      color: #fff;
      border: 1px solid #1a74db;
    }
    .__login_tourist {
      opacity: 0.05;
      transition: all 0.5s;
    }
    .__login_tourist:hover {
      opacity: 1;
    }
    @keyframes show {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  }
}
.show {
  opacity: 1;
}
.hidden {
  opacity: 0;
}
</style>
