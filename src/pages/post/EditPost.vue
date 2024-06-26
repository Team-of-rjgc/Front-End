<template>
  <div class="bg justify-align-center">
    <h2 class="title">发布帖子</h2>
    <el-form :model="post" ref="postFormRef" :rules="postRules" class="edit-post-form">
      <el-form-item label="帖子类型" prop="applyKind">
        <el-radio-group v-model="post.applyKind" class="input-box">
          <el-radio value="0">失物发布</el-radio>
          <el-radio value="1">认领发布</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="title" label="标题">
        <el-input v-model="post.title" placeholder="标题" clearable class="input-box"></el-input>
      </el-form-item>

      <el-form-item label="物品类型" prop="categoryName">
        <el-select v-model="post.categoryName" placeholder="请选择物品类型" class="input-box">
          <el-option :label="item" :value="item" v-for="item in allCategory" />
        </el-select>
      </el-form-item>

      <el-form-item prop="location" label="地点">
        <el-input v-model="post.location" placeholder="丢失/拾到地点" clearable class="input-box"></el-input>
      </el-form-item>

      <!-- <el-form-item prop="contact" label="联系方式">
        <el-input v-model="post.contact" placeholder="联系方式" clearable class="input-box"></el-input>
      </el-form-item> -->

      <el-form-item prop="images" label="图片" class="item-img">
        <el-upload
          v-model:file-list="fileList"
          action=""
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          accept=".jpg, .png"
          :auto-upload="false"
          :limit="3"
          :class="{hide: hideUploadEdit}"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>

      <el-form-item prop="about" label="详情">
        <el-input v-model="post.about" placeholder="物品描述" clearable class="input-box" type="textarea"></el-input>
      </el-form-item>
    <el-button type="primary" @click="sendPost(postFormRef)" class="confirm-btn" :disabled="submitBtn.disabled">{{ submitBtn.msg }}</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, inject } from "vue";
import { Plus } from '@element-plus/icons-vue'
import router from '../../router'

const $API = inject('$API')
const $Tools = inject('$Tools')

const postFormRef = ref()

let allCategory = reactive([])

let post = reactive({
  title: '',
  about: '',
  images: [],
  categoryName: '',
  location: '',
  // contact: '',
  applyKind: '', // 0:失物发布 1:认领发布
})

const fileList = ref([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

let submitBtn = reactive({
  disabled: false,
  msg: '提交'
})
let hideUploadEdit = ref(false)

const postRules = reactive({
  title: [{ validator: (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入标题！'))
    } else {
      callback()
    }
  }, trigger: 'blur', required: true }],
  about: [{ validator: (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入详情！'))
    } else {
      callback()
    }
  }, trigger: 'blur', required: true  }],
  categoryName: [{
    required: true,
    message: '请选择物品类型！',
    trigger: 'change',
  }],
  applyKind: [{
    required: true,
    message: '请选择帖子类型！',
    trigger: 'change',
  }],
})

// 获取物品分类列表
$API.post.getCategory()
  .then(({data}) => {
    if (data.code === 1000) {
      data.data.list.forEach(ele => {
        allCategory.push(ele.name)
      })
    } else {
      console.log(data.msg);
      $Tools.showMessage(data.msg, 'error')
    }
  })
  .catch(err => {
    console.log('err', err)
    $Tools.showMessage('获取物品分类列表失败！', 'error')
  })

async function sendPost(formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    // 校验成功
    if (valid) {
      // 处理图片 转成base64格式
      if (fileList.value.length) {
        let promiseArr = []
        fileList.value.forEach((file) => {
          promiseArr.push(getBase64(file.raw))
        });
        // 等所有promise执行完毕后再发请求
        Promise.all(promiseArr)
          .then(res => {
            // res:所有promise resolve后的结果数组
            post.images = res
            sendPublishRequest()
          })
          .catch(err => {
            console.log('err', err)
            $Tools.showMessage('图片处理失败！', 'error', 2000)
            fileList.value = []
            post.images = []
          })
      } else {
        sendPublishRequest()
      }
    } else {
      return false
    }
  })
}

function sendPublishRequest() {
  submitBtn.msg = '正在发布...'
  submitBtn.disabled = true
  $API.post.publish({
    applyKind: post.applyKind,
    categoryName: post.categoryName,
    title: post.title,
    about: post.about,
    images: post.images,
    location: post.location
  })
    .then(({data}) => {
      if (data.code === 1000) {
        $Tools.showMessage('发布成功！', 'success')
        if (post.applyKind == 1) {
          router.push('/Found')
        }
        else {
          router.push('/Lost')
        }
      } else {
        console.log(data.msg);
        $Tools.showMessage(data.msg, 'error')
      }
    })
    .catch(err => {
      console.log('err', err)
      $Tools.showMessage('发布文章失败！', 'error')
    })
}

function handleRemove (uploadFile, uploadFiles) {
  console.log(uploadFile, uploadFiles)
}

function handlePictureCardPreview (uploadFile) {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

function handleChange() {
//  fileList.value.length是实际长度-1
  hideUploadEdit.value = fileList.value.length == 2 ? true : false
}

// 转换过程（“FileReader不能return 所以用promise封装”）
function getBase64(raw) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    let imgResult = ''
    reader.readAsDataURL(raw)
    reader.onload = function () {
      imgResult = reader.result
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.onloadend = function () {
      resolve(imgResult)
    }
  })
}
</script>

<style scoped>
:deep(.el-form .el-form-item__label) {
  width: 80px;
  text-align: justify;
  text-align-last: justify;
  display: block;
  word-break: break-all;
  text-justify: distribute;
  position: relative;
  padding-right: 10px;
}

:deep(.el-form .el-form-item__label:after) {
  content:'：';
  position: absolute;
  right: -10px;
}

.input-box {
  padding-left: 20px;
}

.edit-post-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.item-img {
  width: 480px;
}

.title {
  margin-bottom: 20px;
}
</style>

<style>
.edit-post-form .el-form-item__error {
  left: 20px;
}

.item-img .el-form-item__label {
  margin-right: 20px;
}

/* 隐藏上传按钮 */
.hide .el-upload--picture-card {
  display: none;
}
</style>