import { createRouter, createWebHashHistory } from 'vue-router'

// import MainContainer from '../components/MainContainer.vue'
import HomePage from '../pages/HomePage.vue'
import PostDetail from '../pages/post/PostDetail.vue'
import Lost from '../pages/post/Lost.vue'
import Found from '../pages/post/Found.vue'
import EditPost from '../pages/post/EditPost.vue'

import UserInfo from '../pages/user/UserInfo.vue'
import UserHomePage from '../pages/user/UserHomePage.vue'
import BasicInfo from '../pages/user/BasicInfo.vue'
import ResetPassword from '../pages/user/ResetPassword.vue'

import Inform from '../pages/Inform.vue'
import SearchResult from '../pages/post/SearchResult.vue'


const routes = [
  {
    path: '/',
    redirect: '/Lost',
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
  {
    path: '/Lost',
    name: 'Lost',
    component: Lost,
  },
  {
    path: '/Found',
    name: 'Found',
    component: Found,
  },
  {
    path: '/EditPost',
    name: 'EditPost',
    component: EditPost,
  },
  {
    path: '/UserInfo',
    name: 'UserInfo',
    component: UserInfo,
    children: [
      { path: 'BasicInfo', component: BasicInfo },
      { path: 'ResetPassword', component: ResetPassword }
    ]
  },
  {
    path: '/UserHomePage',
    name: 'UserHomePage',
    component: UserHomePage,
  },
  {
    path: '/Inform',
    name: 'Inform',
    component: Inform,
  },
  {
    path: '/SearchResult',
    name: 'SearchResult',
    component: SearchResult,
  },
]

// 创建路由实例 并将路由记录传递给该实例的 routes 属性
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
