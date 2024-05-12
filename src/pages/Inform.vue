<template>
  <div class="bg">
    <div class="notifications">
      <h2>通知</h2>
      <div
        class="notification"
        v-for="(note, index) in notifications"
        :key="note.id"
      >
        <el-avatar class="notification-avatar" :src="note.avatar"></el-avatar>
        <div class="notification-info">
          <p>{{ note.title }}</p>
          <p>{{ note.content }}</p>
          <p>来自: {{ note.author }}</p>
          <p>时间: {{ note.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, inject } from 'vue';
import { useStore } from 'vuex';
import router from '../router';

const $API = inject('$API');
const store = useStore();
const notifications = ref([]);

if (!store.state.isLogin) {
  router.push('/Lost');
  store.state.LoginRegisterVisible = true;
}

onMounted(async () => {
  try {
    const response = await $API.post.messages();
    console.log(response.data.data.list);
    if (response && response.data && response.data.success) {
      notifications.value = response.data.data.list.map((item) => ({
        id: item.id,
        userId: item.userId,
        content: item.content,
        author: item.username, // 使用 username 作为作者名字
        title: item.title,
        time: item.time,
        avatar: `http://10.21.32.86:8080/api/v1/public/downloadImage?fileName=${item.icon}`, // 构造完整的头像URL
      }));
    } else {
      console.error('获取通知失败');
    }
  } catch (error) {
    console.error('获取通知时发生错误:', error);
  }
});
</script>

<style>
/* 省略其他样式 */

.notifications {
  padding: 20px;
}

.notification {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.notification-avatar {
  margin-right: 15px;
}

.notification-info p {
  margin: 0;
  padding: 0;
}

/* 省略其他样式 */
</style>
