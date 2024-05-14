<template>
  <MainContainer/>
</template>

<script setup>
import { useStore } from "vuex"
import MainContainer from './components/MainContainer.vue'

const store = useStore()

// --实现刷新后store数据不丢失--
// 在页面加载时读取sessionStorage存到store
if (sessionStorage.getItem('store')) {
  store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('store'))))
}
// 在页面刷新时将store保存到sessionStorage里
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('store', JSON.stringify(store.state))
})

console.log('session存回store',store.state)
</script>

<style scoped>
</style>
