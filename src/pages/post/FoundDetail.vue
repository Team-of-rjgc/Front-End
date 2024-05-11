<template>
  <div class="bg">
    <div class="post-detail">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ post.title }}</span>
        </div>
        <div v-if="post.imgUrls.length" class="image-container">
          <img
            v-for="(imgUrl, index) in post.imgUrls"
            :src="imgUrl"
            :alt="`Post Image ${index + 1}`"
            :key="index"
            class="post-img"
          />
        </div>
        <div class="content-container">
          {{ post.content }}
        </div>
      </el-card>

      <el-divider></el-divider>

      <div class="comments-section">
        <el-input
          type="textarea"
          placeholder="写下你的评论..."
          v-model="newComment"
          :rows="2"
          class="comment-input"
        ></el-input>
        <el-button type="primary" @click="submitComment">发布评论</el-button>

        <el-divider></el-divider>

        <div class="comment" v-for="(comment, index) in comments" :key="index">
          <el-avatar :src="comment.avatar"></el-avatar>
          <div class="comment-content">
            <div class="comment-author">{{ comment.author }}</div>
            <div>{{ comment.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-backtop :right="100" :bottom="100" />
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router'; // 添加这行
const $API = inject('$API');
const route = useRoute();
const post = ref({
  title: '示例帖子标题',
  content: '这是帖子的详细内容，这里可以是一段长文。',
  imgUrls: [
    'https://img2.imgtp.com/2024/05/06/5NfmuCD7.jpg',
    'https://img2.imgtp.com/2024/05/06/5NfmuCD7.jpg',
  ],
});

const comments = ref([
  {
    author: '用户A',
    content: '这是一个评论示例。',
    avatar: 'https://example.com/default-avatar.jpg',
  },
  // 更多评论对象...
]);

const newComment = ref('');

const submitComment = () => {
  if (newComment.value.trim() === '') {
    alert('请填写评论内容');
    return;
  }
  // 这里你可以进行 ajax 请求来提交新评论
  // 演示时我们仅将新评论添加到本地数组
  comments.value.push({
    author: '新评论用户',
    content: newComment.value,
    avatar: 'https://img2.imgtp.com/2024/05/06/5NfmuCD7.jpg',
  });
  // 清空输入
  newComment.value = '';
};
onMounted(async () => {
  // Let's assume the fetchData function is where you make your API calls.
  // const postData = await $API.post.postDetail(
  //   route.params.postId, // 修改这里
  // );
  // const commentsData = await $API.post.commentDetail({
  //   id: route.params.postId, // 修改这里
  // });
  // const comment = await $API.post.comment({
  //   targetId: '5f228c9e183a43398db8f8e7ad730736',
  //   content: '这是评论评论',
  // });
  const comment = await $API.post.setNickName({
    nickName: '这是昵称',
  });

  post.value = {
    title: postData.title,
    content: postData.content,
    imgUrls: postData.imgUrls,
  };
  comments.value = commentsData;
});
</script>

<style scoped>
.bg {
  padding-top: 3.75rem; /* 预留导航栏空间 */
}
.post-detail {
  margin-top: 3.75rem; /* 为导航栏预留空间 */
  padding: 1.25rem; /* 可以加一些内边距让页面看起来更舒适 */
}

.image-container img {
  width: 100%;
  max-height: 25rem;
  object-fit: cover;
}

.comments-section .comment {
  display: flex;
  align-items: center;
  margin-top: 1.25rem; /* 评论之间的留白 */
}

.comments-section .comment .comment-content {
  margin-left: 1.25rem;
}

.comments-section .comment-input {
  margin-bottom: 0.625rem;
}
</style>
