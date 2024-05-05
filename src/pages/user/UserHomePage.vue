<template>
  <div class="bg">
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="我发布的" name="first">
          我发布的
        </el-tab-pane>
        <el-tab-pane label="回复我的" name="second">
          回复我的
        </el-tab-pane>
      </el-tabs>
  </div>
  <el-backtop :right="100" :bottom="100" />
</template>

<script setup>
import router from '../../router'
import { ref } from 'vue'
import { useStore } from "vuex"
const store = useStore()

if (!store.state.isLogin) {
  router.push('/Lost')
  store.state.LoginRegisterVisible = true
}

const activeName = ref('first')

function handleClick (tab, event) {
  console.log(tab, event)
}
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 15px;
  color: #6b778c;
}
</style>
