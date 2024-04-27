import { createApp } from 'vue'
import App from './App.vue'
import './css/common.css'
import './css/layout.css'
import router from './router/index'

const app = createApp(App)
app.use(router)
app.mount('#app')
