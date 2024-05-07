<template>
  <div class="bg">
    <div class="all-post" v-if="!ifEmpty">
      <li class="post-box" v-for="post in postList">
        <div class="post-left-part">
          <div class="post-main">
            <h3 class="post-title">{{ post.title }}</h3>
            <span class="post-content">{{ post.content }}</span>
          </div>
          <div class="info">
            <span class="author">{{ post.author }}</span>
            <span class="time">{{ post.time }}</span>
          </div>
        </div>
        <div class="post-right-part">
          <img class="post-img" v-if="post.imgUrl" :src="post.imgUrl">
        </div>
      </li>
    </div>
    
    <div class="justify-align-center" v-else>
      <el-empty description="暂无搜索结果" />
    </div>
  </div>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup>
import { reactive } from 'vue';

// 是否有帖子
let ifEmpty = false

let postList = reactive([
  {
    title: '123',
    content: '丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱',
    author: '作者名作者名作者名作者名作者名',
    time: '2024-5-6 00:00',
    imgUrl: 'https://img2.imgtp.com/2024/05/06/5NfmuCD7.jpg'
  },
  {
    title: '2345',
    content: '丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱丢了100块钱',
    author: '作者名不知道',
    time: '2024-5-6 00:00',
    imgUrl: 'https://img2.imgtp.com/2024/05/06/v3FUgkBW.png'
  },
])
</script>

<style>
.all-post {
  width: 100%;
}

.post-box {
  display: flex;
  justify-content: space-between;

  padding: 10px 20px;
  height: 120px;
  border-bottom: 1px solid rgba(0, 0, 0, .1);

  transition: all .2s;
}

.post-box:hover {
  background-color: var(--el-color-primary-light-9);
  cursor: pointer;

  transition: all .2s;
}

.post-left-part {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80%;

  color: var(--el-color-info);
  font-size: 14px;
}

.post-title {
  margin-bottom: 10px;
  color: rgb(37, 41, 51);
}

.post-content {
  display: block;
  margin-bottom: 5px;
  width: 100%;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.post-img {
  width: 120px;
  height: 100px;
}

.info {
  /* margin-top: 10px; */
  display: flex;
  height: 20px;
}

.info .author {
  display: block;
  width: 120px;

  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}

.info .time {
  margin-left: 15px;

  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
