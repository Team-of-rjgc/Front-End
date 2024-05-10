import { createApp } from 'vue'
import App from './App.vue'
import './css/common.css'
import './css/layout.css'
import router from './router/index'
import store from './store'
import API from './network'

const app = createApp(App)
app.provide('$API', API)
app.use(router)
app.use(store)
app.mount('#app')
