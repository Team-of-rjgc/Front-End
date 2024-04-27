<template>
  <el-header class="header-box">
    <div class="header-content">
      <div class="header-left">
        <div class="menu-items">
          <router-link to="/Lost" class="items" active-class="active">失物招领</router-link>
          <router-link to="/Found" class="items" active-class="active">寻物启事</router-link>
        </div>

        
      </div>

      <div class="mt-4 search-box">
          <el-input
            v-model="searchInput"
            style="min-width: 500px"
            placeholder="搜索帖子"
            class="input-with-select"
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
        <router-link to="/EditPost" class="items edit-btn" active-class="active"><el-icon class="icon"><Edit /></el-icon>发布</router-link>
      
      <el-dropdown>
        <el-avatar class="el-dropdown-link avatar" :size="30" shape="square" :src="avatarUrl" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item><router-link to="/UserInfo">个人信息</router-link></el-dropdown-item>
              <el-dropdown-item><router-link to="/UserHomePage">我的主页</router-link></el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
  <el-main>
    <router-view />
  </el-main>
  
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { Edit } from '@element-plus/icons-vue'

const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
let searchInput = ref('')

function toSearch() {
  console.log(searchInput.value)
  
}
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
}

.header-left,
.hearder-right {
  display: flex;
  align-items: center;
}

.header-content .items {
  display: inline-block;
  margin-right: 30px;
  padding: 0 10px;

  height: 35px;
  line-height: 35px;

  font-size: 16px;
  font-weight: 600;
  color: #788387;

  border-bottom: 3px solid transparent;
  border-radius: 2px;
  transition: all .2s;
}

.header-content .items:hover {
  color: rgb(94, 115, 134);
  
  border-color: rgb(160, 207, 255);
  transition: all .2s;
}

.header-content .active {
  border-color: rgba(160, 207, 255, .8);
}

/* .search-box { */
  /* margin-left: 150px; */
/* } */

.avatar {
  border-color: transparent;
  outline: none;
}

.avatar:hover {
  cursor: pointer;
}

.header-content .search-btn {
  transition: all .2s;
}

.header-box .search-btn:hover {
  color: rgb(64, 158, 255) !important;
  background-color: rgb(236, 245, 255) !important;
  border-color: rgb(64, 158, 255) !important;

  transition: all .2s;
}

.header-content .edit-btn {
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 3px;
}
</style>
