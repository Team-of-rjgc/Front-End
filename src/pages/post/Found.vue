<template>
  <div class="bg">
    <div v-if="!ifEmpty">
      <el-table
        :data="postList"
        style="width: 100%"
        @row-click="goToPostDetail"
        :row-style="{height: '120px'}"
      >
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="content" label="内容">
          <template v-slot="scope">
            <p class="showOverTooltip">{{scope.row.content}}</p>
          </template>
        </el-table-column>
        <el-table-column label="图片">
          <template v-slot="scope">
            <el-image
              fit="cover"
              style="width: 100px; height: 100px"
              :src="scope.row.imgUrl"
              v-if="scope.row.imgUrl"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者">
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
              <el-avatar :src="scope.row.iconUrl"></el-avatar>
              <span class="author">{{ scope.row.realName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPosts"
      />
    </div>
    <div class="justify-align-center" v-else>
      <el-empty description="暂无帖子" />
    </div>
  </div>
  <el-backtop :right="100" :bottom="100" />
</template>
<script setup>
import { reactive, computed, ref, onMounted, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const $API = inject('$API');
const router = useRouter();
const store = useStore();

let fit = ref('fill');
let pageSize = ref(10);
let currentPage = ref(1);
let totalPosts = ref(0);
let postList = reactive([]);
totalPosts.value = postList.length;

const paginatedPostList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return postList.slice(start, end);
});

const ifEmpty = computed(() => {
  return postList.length === 0;
}); // 新增了ifEmpty变量

const fetchPosts = async () => {
  try {
    const res = await $API.post.postPage({
      kind: 1,
      category: '',
      keyword: '',
      username: '',
      pageNum: currentPage.value-1, // 注意这里需要将页码传递给API
      pageSize: pageSize.value, // 和页数大小
    });
    // console.log(res.data.data.page.list);
    totalPosts.value = res.data.data.page.total; // 设置总帖子数的值

    const newPostList = res.data.data.page.list.map((post) => ({
      ...post,
      content: post.about, // 使用 about 属性作为帖子的内容
      imgUrl: post.images[0] ? `http://10.21.32.86:8080/api/v1/public/downloadImage?fileName=${post.images[0]}` : '', // 使用 images 数组的第一个 URL 作为帖子图片的 URL
      iconUrl: `http://10.21.32.86:8080/api/v1/public/downloadImage?fileName=${post.icon}`,
    }));

    postList.splice(0, postList.length, ...newPostList); // 替换当前的帖子列表
  } catch (error) {
    console.error('获取帖子列表时发生错误:', error);
  }
};
onMounted(async () => {
  fetchPosts();
}); // 这里'/api/posts'应该是你的后端接口地址postList = reactive(response.data); // 使用接口返回的数据totalPosts.value = postList.length;});
const handleSizeChange = async (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 修改页数大小后应返回到第一页
  await fetchPosts();
};

const handleCurrentChange = async (newCurrent) => {
  currentPage.value = newCurrent;
  await fetchPosts();
};
// let goToPostDetail = (post) => {
//   router.push({ name: 'foundDetail', params: { postId: post.id } });
// };
let goToPostDetail = (post) => {
  router.push({ name: 'foundDetail', query: { id: post.id } });
};

watch(
  () => store.state.isLogin,
  (val) => {
    if (val) {
      fetchPosts()
    }
  },
  { immediate: true }
)
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.post-box:hover {
  background-color: var(--el-color-primary-light-9);
  cursor: pointer;

  transition: all 0.2s;
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
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info .time {
  margin-left: 15px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.showOverTooltip{
  display:-webkit-box;
  text-overflow:ellipsis;
  overflow:hidden;
    /*这里是3行*/
  -webkit-line-clamp: 3;
  -webkit-box-orient:vertical;
}
</style>
