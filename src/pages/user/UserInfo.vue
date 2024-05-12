<template>
  <div class="bg">
    <el-container style="height: 500px">
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <router-link
                  to="/UserInfo/BasicInfo"
                  class="link"
                  active-class="active"
                  ref="intro"
                >
                  <el-icon><InfoFilled /></el-icon>
                  基本信息
                </router-link>
              </el-menu-item>
              <el-menu-item index="1-2">
                <router-link
                  to="/UserInfo/ResetPassword"
                  class="link"
                  active-class="active"
                >
                  <el-icon><Tools /></el-icon>
                  重置密码
                </router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <!-- 主要部分 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { InfoFilled, Tools } from '@element-plus/icons-vue';
import router from '../../router';
import { useStore } from 'vuex';
const store = useStore();

if (!store.state.isLogin) {
  router.push('/Lost');
  store.state.LoginRegisterVisible = true;
}
</script>

<style>
.link {
  width: 100%;
  height: 100%;
}

.el-menu {
  border: none;
}

.el-menu a {
  padding-left: 20px;

  color: rgb(120, 131, 135);
  font-weight: 700;

  border-left: 4px solid transparent;
}

aside {
  margin-left: -20px;
  border-right: 1px solid rgb(220, 223, 230);
}

.el-menu .active {
  border-left: 4px solid rgb(220, 223, 230);
  transition: all 0.2s;
}
</style>
