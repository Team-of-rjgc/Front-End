<template>
  <el-header class="header-box">
    <div class="header-content">
      <div class="header-left">
        <div class="menu-items">
          <router-link to="/Lost" class="items" active-class="active"
            >寻物启事</router-link
          >
          <router-link to="/Found" class="items" active-class="active"
            >失物招领</router-link
          >
        </div>
      </div>

      <div class="mt-4 search-box">
        <el-input
          v-model="searchInput"
          style="min-width: 400px"
          placeholder="搜索帖子"
          class="input-with-select"
          clearable
          @keyup.enter="toSearch"
        >
          <template #prepend>
            <el-icon :size="16"><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="toSearch" class="search-btn">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div class="hearder-right">
        <div class="items flex-btn edit-btn" @click="toEdit">
          <el-icon class="icon"><Edit /></el-icon>发布
        </div>

        <router-link
          to="/Inform"
          class="items"
          active-class="active"
          v-if="$store.state.isLogin"
        >
          <!-- <el-badge :value="notificationNum" :max="10" class="notification-icon" type="primary"><el-icon class="icon"><Bell /></el-icon>通知</el-badge> -->
          <div class="flex-btn">
            <el-icon class="icon"><Bell /></el-icon>通知
          </div>
        </router-link>

        <el-dropdown v-if="$store.state.isLogin">
          <el-avatar
            class="el-dropdown-link avatar"
            :size="30"
            shape="square"
            :src="avatarUrl"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                ><router-link to="/UserInfo"
                  ><el-icon><User /></el-icon>个人信息</router-link
                ></el-dropdown-item
              >
              <!-- <el-dropdown-item><router-link to="/UserHomePage"><el-icon><House /></el-icon>我的主页</router-link></el-dropdown-item> -->
              <el-dropdown-item divided @click="logOut"
                ><el-icon><Switch /></el-icon>退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div
          v-if="!$store.state.isLogin"
          @click="$store.state.LoginRegisterVisible = true"
          class="items flex-btn login-register-btn"
          active-class="active"
          style="margin-right: 0"
        >
          登录/注册
        </div>
      </div>
    </div>
  </el-header>
  <el-main>
    <router-view />
  </el-main>

  <!-- 登录/注册窗口 -->
  <LoginOrRegister :key="$store.state.LoginRegisterKey" />
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import router from '../router';
import { useStore } from 'vuex';
import { Search } from '@element-plus/icons-vue';
import { Edit, Bell, User, House, Switch } from '@element-plus/icons-vue';
import LoginOrRegister from '../pages/user/LoginOrRegister.vue';

const $Tools = inject('$Tools');
const $API = inject('$API');
const store = useStore();

// 刷新后登录页关闭
store.state.LoginRegisterVisible = false

const avatarUrl = ref(store.state.avatar)
let searchInput = ref('')
// 未读通知数量
// let notificationNum = 2

function toSearch() {
  if (searchInput.value) {
    router.push({
      name: 'SearchResult',
      query: { keyword: searchInput.value },
    }); // 通过query携带关键词参数
  } else {
    Message({
      message: '请输入搜索词',
      type: 'warning',
    });
  }
}

function toEdit() {
  // 未登录 跳转到登录页
  if (!store.state.isLogin) store.state.LoginRegisterVisible = true;
  else router.push('/EditPost');
}

function logOut() {
  $Tools.showMessage('退出登录成功！', 'success');
  store.state.isLogin = false;
  store.state.userInfo = {};
  store.state.avatar = '';
  sessionStorage.clear();
  router.push('/Lost');
}

watch(
  () => store.state.isLogin,
  (val) => {
    if (val) {
      if (store.state.userInfo.icon) {
        $Tools
          .downloadImg('upload_5096045757543304800.jpg')
          .then((res) => {
            avatarUrl.value = res;
            store.state.avatar = res;
          })
          .catch((err) => {
            console.log('err', err);
            store.state.value =
              'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
          });
      } else {
        avatarUrl.value = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        store.state.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      }
    }
  },
);

watch(
  () => store.state.avatar,
  (val) => {
    avatarUrl.value = val
  }
)
</script>

<style>
.header-box {
  position: fixed;
  top: 0;
  left: 0;
  margin-bottom: 20px;
  padding: 0 40px;

  width: 100vw;
  height: 50px;
  line-height: 50px;

  background-color: #fff;
  box-shadow: #dedede 0px 0px 20px 5px;
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 100%;
}

.header-left,
.hearder-right {
  display: flex;
  align-items: center;
}

.header-left .menu-items {
  width: 250px;
}

.header-content .items {
  display: inline-block;
  margin-right: 30px;
  padding: 0 10px;

  height: 35px;
  width: 85px;
  line-height: 35px;

  font-size: 16px;
  font-weight: 600;
  color: #788387;

  border-bottom: 3px solid transparent;
  border-radius: 2px;
  transition: all 0.2s;
}

.header-content .items:hover {
  color: rgb(160, 207, 255);

  border-color: rgb(160, 207, 255);
  transition: all 0.2s;
}

.header-content .edit-btn:hover {
  border-color: transparent;
}

.header-content .login-register-btn {
  width: 95px;
}

.header-content .active {
  border-color: rgba(160, 207, 255, 0.8);
  color: rgb(160, 207, 255);
}

.avatar {
  margin-left: 10px;
  border-color: transparent;
  outline: none;
}

.avatar:hover {
  cursor: pointer;
}

.header-content .search-btn {
  transition: all 0.2s;
}

.header-box .search-btn:hover {
  color: var(--el-color-primary) !important;
  background-color: var(--el-color-primary-light-9) !important;
  border-color: var(--el-color-primary) !important;

  transition: all 0.2s;
}

.header-content .flex-btn {
  display: flex;
  align-items: center;

  cursor: pointer;
}

.icon {
  margin-right: 3px;
}

.notification-icon {
  cursor: pointer;
  outline: none;
}

.notification-menu {
  width: 350px;
}

.notification-menu h4 {
  color: rgb(101, 103, 108);
}

.notification-item {
  padding: 5px 15px;
  width: 100%;

  cursor: pointer;
  transition: all 0.2s;
}

.notification-item:hover {
  background-color: var(--el-color-primary-light-9);

  transition: all 0.2s;
}

.notification-detail {
  margin-left: 5px;
  font-size: 12px;
  color: var(--el-color-info);
}
</style>
