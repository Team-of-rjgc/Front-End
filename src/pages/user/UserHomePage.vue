<template>
  <div class="bg">
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="User" name="first">我发布的</el-tab-pane>
        <el-tab-pane label="Config" name="second">有回复的</el-tab-pane>
        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
      </el-tabs>
  </div>
  <el-backtop :right="100" :bottom="100" />
</template>

<script setup>
import router from '../../router'
import { useStore } from "vuex"
const store = useStore()

if (!store.state.isLogin) {
  router.push('/Lost')
  store.state.LoginRegisterVisible = true
}

</script>

<style>

</style>
