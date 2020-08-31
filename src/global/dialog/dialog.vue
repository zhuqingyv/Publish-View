<!--
 * @Author: zhuqingyu
 * @Date: 2020-08-26 22:38:19
 * @LastEditTime: 2020-08-26 23:29:00
 * @LastEditors: zhuqingyu
-->
<template>
  <el-dialog :title="option.title" :visible.sync="option.show">
    <div class="dialog-body">
      <div class="addInfo">
        <div class="item">
          <span>名称：</span
          ><input type="text" v-model="option.name" placeholder="请输入名称" />
        </div>
        <div class="item">
          <span>地址：</span>
          <input
            type="text"
            v-model="option.url"
            placeholder="请输入 github 地址"
          />
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Event from "event";

export default {
  name: "addView",
  data() {
    return {
      option: {
        title: "标题",
        show: false,
        url: "",
        name: "",
      },
    };
  },
  methods: {
    showDialog(option) {
      this.option = option;
    },
    submit() {
      try {
        if (!this.option.name) throw "请填写名称！";
        if (!this.option.url) throw "请填github地址！";
        this.$emit("submit", { name: this.option.name, url: this.option.url });
        this.cancel();
      } catch (err) {
        Event.$emit("showTip", {
          show: true,
          bool: false,
          title: err,
        });
      }
    },
    cancel() {
      this.option.show = false;
    },
  },
};
</script>
<style scoped lang="scss">
.dialog-body {
  display: flex;
  justify-content: center;
  .addInfo {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .item {
      input {
        outline: none;
        border: 1px solid #cccccc;
        width: 200px;
        height: 30px;
        border-radius: 4px;
        text-indent: 12px;
        margin-left: 20px;
      }
    }
    .item:last-child {
      margin-top: 25px;
    }
  }
}
</style>
