<template>
  <div class="bg">
    <div class="notifications">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="18"><h2>通知</h2></el-col>
        <el-col :span="6" class="text-right">
          <el-button type="danger" @click="deleteMultipleComments"
            >批量删除评论</el-button
          >
        </el-col>
      </el-row>
      <div
        class="notification"
        v-for="(note, index) in notifications"
        :key="note.lostFoundId"
        @click="goToPostDetail(note)"
      >
        <el-checkbox
          v-model="selections[note.id]"
          :label="note.id.toString()"
          size="large"
          class="large-checkbox"
          @change="handleSelectionChange(note.id)"
          @click.stop
          ><br />
        </el-checkbox>
        <el-avatar class="notification-avatar" :src="note.avatar"></el-avatar>
        <div class="notification-info">
          <p>帖子标题: {{ note.title }}</p>
          <p>评论内容: {{ note.content }}</p>
          <p>来自用户: {{ note.author || '匿名' }}</p>
          <div class="notification-time">{{ note.time }}</div>
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

const selectedComments = ref([]); // 用于存储选中的评论ID
const selections = ref({}); // 响应式变量存储每个复选框的选中状态
if (!store.state.isLogin) {
  router.replace('/Lost');
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
        lostFoundId: item.lostFoundId,
      }));
      console.log(notifications.value);
      // 初始化每个复选框的选中状态
      notifications.value.forEach((note) => {
        selections.value[note.id] = false;
      });
    } else {
      console.error('获取通知失败');
    }
  } catch (error) {
    console.error('获取通知时发生错误:', error);
  }
});
// 在这里定义goToPostDetail函数
const goToPostDetail = (note) => {
  router.push({ name: 'foundDetail', query: { id: note.lostFoundId } });
};
// 当复选框状态改变时调用此方法
const handleSelectionChange = (commentId) => {
  const isSelected = selections.value[commentId];
  if (isSelected) {
    if (!selectedComments.value.includes(commentId.toString())) {
      selectedComments.value.push(commentId.toString()); // 添加到选中评论数组
      console.log(selectedComments.value);
    }
  } else {
    selectedComments.value = selectedComments.value.filter(
      (id) => id !== commentId.toString(),
    ); // 从选中评论数组中移除
    console.log('selectedComments' + selectedComments.value);
  }
};
// 添加用于批量删除评论的方法
const deleteMultipleComments = async () => {
  if (selectedComments.value.length === 0) {
    ElMessageBox.alert('请至少选择一个评论进行删除。', '提示');
    return;
  }
  try {
    const response = await $API.post.removeComment({
      idList: selectedComments.value,
    });
    if (response && response.data && response.data.success) {
      ElMessageBox.alert('删除成功。', '成功');
      // 保持已有逻辑，使用filter更新notifications
      const remaining = notifications.value.filter(
        (note) => !selectedComments.value.includes(note.id.toString()),
      );
      notifications.value = [...remaining]; // 重新赋值以确保是响应式的

      selectedComments.value = []; // 清空已选择的评论ID
    } else {
      ElMessageBox.alert('删除失败。', '错误');
    }
  } catch (error) {
    console.error('删除评论时发生错误:', error);
    ElMessageBox.alert('删除评论时发生错误。', '错误');
  }
};
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
.notification-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1; /* 让notification-info使用可用空间 */
}

.notification-time {
  align-self: flex-end; /* 时间对齐到右边 */
  color: #999; /* 可以根据需要调整这个颜色来降低时间的突出度 */
  font-size: 0.8em; /* 可以根据需要调整字体大小 */
}
/* 大小 */
.el-checkbox__inner {
  width: 20px;
  height: 20px;
}
.large-checkbox {
  zoom: 150%;
}
/* 省略其他样式 */
</style>
