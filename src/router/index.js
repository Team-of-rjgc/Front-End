import { createRouter, createWebHashHistory } from 'vue-router'

import MainContainer from '../components/MainContainer.vue'
import PostDetail from '../pages/post/PostDetail.vue'
import HomePage from '../pages/HomePage.vue'

const routes = [
  // {
  //   path: '/',
  //   redirect: '/MainContainer'
  // },
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/HomePage',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/PostDetail',
    name: 'PostDetail',
    component: PostDetail,
  },
]

// 创建路由实例 并将路由记录传递给该实例的 routes 属性
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
