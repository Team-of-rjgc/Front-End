<template>
  <div class="bg">
    通知
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import router from '../router'
import { useStore } from "vuex"
const store = useStore()

if (!store.state.isLogin) {
  router.push('/Lost')
  store.state.LoginRegisterVisible = true
}
</script>

<style>

</style>
