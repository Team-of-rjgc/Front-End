<template>
  <div class="bg">
    <div class="post-detail">
      <el-card class="box-card">
        <div slot="header" class="clearfix post-header">
          <div class="post-info">
            <div class="post-info-top">
              <div class="avatar-and-name">
                <el-avatar class="post-avatar" :src="post.icon"></el-avatar>
                <span class="header-author">由 {{ post.realName || post.userName || post.email }} 发布</span>
              </div>
              <el-tag>{{ post.kind == 0 ? '寻物启示' : '失物招领' }}</el-tag>
            </div>
            <span class="info-time">{{ post.time }}</span>
          </div>
          <el-divider />
          <span class="header-title">{{ post.title }}</span>
        </div>
        <div v-if="post.imgUrls.length > 0" class="image-container">
          <el-image
            v-for="(imgUrl, index) in post.imgUrls"
            :key="index"
            :src="imgUrl"
            style="width: 250px; height: 250px"
            :alt="`Post Image ${index + 1}`"
            class="image"
            fit="cover"
          />
        </div>
        <div class="content-container">
          <p>{{ post.about }}</p>
          <!-- 可以用<p>标签包裹内容 -->
        </div>

        <div class="description-box">
          <div v-if="post.location" class="description-item">
            <span><el-icon class="icon"><Position /></el-icon>丢失/拾到地点：</span>
            <span>{{ post.location }}</span>
          </div>
          <div class="description-item">
            <span><el-icon class="icon"><CollectionTag /></el-icon>类型：</span>
            <span><el-tag>{{ post.category }}</el-tag></span>
          </div>
        </div>

         <el-popconfirm 
          width="200"
          title="确定删除这篇帖子吗?" 
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="deletePost"
         >
          <template #reference>
            <div class="delete-btn" v-if="post.isSelf"><el-icon class="delete-icon"><Delete /></el-icon>删除</div>
          </template>
        </el-popconfirm>
      </el-card>

      <el-divider></el-divider>

      <div class="comments-section">
        <div class="noResize">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            style="resize: none"
            placeholder="写下你的评论..."
            v-model="newComment"
            resize="none"
            class="comment-input"
            maxlength="128"
            show-word-limit
          ></el-input>
        </div>
        <el-button type="primary" @click="submitComment">发布评论</el-button>

        <el-divider></el-divider>

        <div class="comment" v-for="(comment, index) in comments" :key="index">
          <div class="comment-header">
            <el-avatar :src="comment.avatar" class="comment-avatar"></el-avatar>
            <div class="comment-author-info">
              <div class="comment-author">{{ comment.author }}</div>
            </div>
            <div class="comment-time">{{ comment.time }}</div>
          </div>
          <div class="comment-body">{{ comment.content }}</div>
        </div>
      </div>
    </div>
    <!-- 评论部分保持不变 -->
    <!-- ... -->
  </div>
  <el-backtop :right="100" :bottom="100" />
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router'
import { Position, CollectionTag, Delete } from '@element-plus/icons-vue'
import { useStore } from 'vuex';

const $API = inject('$API');
const $Tools = inject('$Tools');
const route = useRoute();
const store = useStore();

const post = ref({
  imgUrls: [], // 确保imgUrls被初始化为一个空数组
}); // 使用 Reactive Reference

const comments = ref([
  {
    author: '用户A',
    content: '这是一个评论示例。',
    avatar: 'https://example.com/default-avatar.jpg',
  },
  // 更多评论对象...
]);

const newComment = ref('');
const submitComment = async () => {
  if (store.state.isLogin === false) {
    store.state.LoginRegisterVisible = true
    return
  }
  const postId = route.query.id; // 使用查询参数获取postId
  if (newComment.value.trim() === '') {
    ElMessage.warning('请填写评论内容');
    return;
  }
  // 构造将要发送的评论数据
  const commentData = {
    targetId: route.query.id,
    content: newComment.value,
    // 其他可能的数据字段...
  };
  // console.log(comment);
  // 发送Ajax请求 (伪代码，假设有一个发送评论的API方法)
  try {
    const response = await $API.post.comment(commentData);
    console.log(response);
    if (response && response.data.code == 1000) {
      // 成功后，你可能需要从响应中获取新评论的数据，或重新获取所有评论

      ElMessage.success('评论发布成功！');
      // 获取评论信息，此处需要你提供API调用方式与返回数据的结构
      const commentsRes = await $API.post.commentDetail({ id: postId });
      console.log(commentsRes.data.data.comments);
      const commentsData = commentsRes.data.data.comments.map((comment) => ({
        author: comment.nickName, // 昵称作为作者名字
        content: comment.content, // 评论内容
        avatar: `http://10.21.32.86:8080/api/v1/public/downloadImage?fileName=${comment.icon}`, // 评论者头像的完整URL
        time: comment.time, // 评论时间
      }));
      comments.value = commentsData;
      // comments.value.push({
      //   // 注意这里改为了 comments.value.push
      //   author: '当前用户',
      //   content: newComment.value,
      //   avatar: 'https://example.com/current-user-avatar.jpg',
      // });
      newComment.value = '';
    } else {
      ElMessage.error('评论发布失败' + response.data.msg);
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('评论发布失败' + error);
  }
};
onMounted(async () => {
  const postId = route.query.id; // 使用查询参数获取postId

  // 获取帖子详情
  const postRes = await $API.post.postDetail({ id: postId });
  const postData = postRes.data.data.item;

  // 设置帖子数据
  post.value = {
    title: postData.title,
    about: postData.about,
    realName: postData.realName, // 添加作者名字字段
    icon: `http://10.21.32.86:8080/api/v1/public/downloadImage?fileName=${postData.icon}`, // 添加作者头像字段并构造完整的URL路径
    imgUrls: postData.images.map(
      (imageName) =>
        `http://10.21.32.86:8080/api/v1/public/downloadImage?fileName=${imageName}`,
    ), // 为图片 URL 拼接上完整路径
    userName: postData.userName,
    location: postData.location,
    isSelf: postData.isSelf,
    kind: postData.kind,
    category: postData.category,
    email: postData.email,
    time: postData.time,
    id: postData.id,
  };

  // 获取评论信息，此处需要你提供API调用方式与返回数据的结构
  const commentsRes = await $API.post.commentDetail({ id: postId });
  console.log(commentsRes.data.data.comments);
  const commentsData = commentsRes.data.data.comments.map((comment) => ({
    author: comment.nickName, // 昵称作为作者名字
    content: comment.content, // 评论内容
    avatar: `http://10.21.32.86:8080/api/v1/public/downloadImage?fileName=${comment.icon}`, // 评论者头像的完整URL
    time: comment.time, // 评论时间
  }));
  comments.value = commentsData;
});

// 删除自己的帖子
function deletePost() {
  if (store.state.isLogin === false) {
    store.state.LoginRegisterVisible = true
    return
  }
  $API.post.removeLost({idList: [post.value.id]})
    .then(({data}) => {
      console.log(data)
      if (data.code === 1000) {
        $Tools.showMessage('删除帖子成功！', 'success')
        if (post.kind == 0) router.replace('/Lost')
        else router.replace('/Found')
      } else {
        console.log(data.msg);
        $Tools.showMessage(data.msg, 'error')
      }
    })
    .catch(err => {
      console.log('err', err)
      $Tools.showMessage('删除帖子失败！', 'error')
    })
}
</script>

<style scoped>
.bg {
  padding-top: 3.75rem; /* 预留导航栏空间 */
}
.post-detail {
  padding: 1.25rem; /* 可以加一些内边距让页面看起来更舒适 */
}

.post-header {
  display: flex;
  flex-direction: column; /* 更改为列布局 */
  align-items: start; /* 对齐到开始位置 */
}

.post-info {
  width: 100%;
}

.post-info-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem; /* 为标题和作者信息之间添加间距 */
  width: 100%;
}

.post-avatar {
  margin-right: 0.75rem;
}

.header-author {
  font-size: 18px;
  color: #666;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
}

/* 设置图片固定大小，并保持比例 */
.image-container img {
  width: 200px; /* 设置图片宽度 */
  height: 200px; /* 设置图片高度 */
  object-fit: cover; /* 保持图片比例 */
  margin-bottom: 1rem; /* 与下一个元素的间距 */
}

/* 优化内容区容器 */
.content-container {
  background-color: #f7f7f7; /* 内容背景颜色 */
  padding: 15px; /* 内部填充 */
  border-radius: 4px; /* 轻微圆角 */
  margin-top: 1rem; /* 与图片的间距 */
}
.noResize .el-textarea__inner {
  resize: none !important;
}
.comments-section .comment {
  display: flex;
  flex-direction: column; /* 用列布局代替行布局 */
  align-items: start;
  margin-top: 1.25rem; /* 评论之间的留白 */
  border-bottom: 1px solid #eee; /* 如果需要，可以添加分隔线 */
  padding-bottom: 1.25rem; /* 如果需要，可以在分隔线下方添加间距 */
}

.comments-section .comment .comment-header {
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center;
  width: 100%; /* 撑满容器宽度 */
  margin-bottom: 0.625rem; /* 与评论内容之间的间距 */
}

.comments-section .comment .comment-author-info {
  display: flex;
  align-items: center;
}

.comments-section .comment .comment-author {
  margin-left: 0.625rem; /* 头像和名字之间的间距 */
}

.comments-section .comment .comment-time {
  margin-left: auto; /* 将时间推到右边 */
}

.comments-section .comment .comment-body {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #333;
}

.comment-input {
  margin-bottom: 10px;
}

.description-box {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.description-item {
  margin-top: 10px;

  font-size: .9rem;
  color: rgb(48, 49, 51);
}

.avatar-and-name {
  display: flex;
  align-items: center;
}

.icon {
  color: var(--el-color-info-light-5);
  font-size: 1rem;
}

.info-time {
  margin-left: 3.5rem;
  color: var(--el-color-info-light-3);
}

.delete-icon {
  font-size: 1.2rem;
}

.delete-btn {
  display: flex;
  align-items: center;

  margin-top: 20px;
  width: 70px;

  color: var(--el-color-info-light-3);
  font-size: 1rem;

  cursor: pointer;
  transition: all .1s;
}

.delete-btn:hover {
  color: var(--el-color-primary);
  transition: all .1s;
}
</style>
