<template>
    <div id="info-layout">
      <h2>基本信息</h2>
      <el-container class="info-box">
        <el-main class="main justfy-align-center">
          <el-form :model="form" ref="uploadForm" style="width: 400px;">
            <el-form-item label="头像：" ref="uploadEle">
              <el-upload class="avatar-uploader"
                :show-file-list="false"
                :before-upload="handleUpload"
                :on-success="handleAvatarSuccess"
                :headers="avatarHeader"
                action="/api/user/upload/avatar"
                >
                <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" prop="imgUrl" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus /><i>(图片格式为JPG/JPEG/PNG)</i>
                </el-icon>
              </el-upload>
              </el-form-item>
          </el-form>
          <div class="other-info">
            <div class="name">
              用户名：
              <span v-if="info.isEdit">{{ info.name }}</span>
              <el-input v-else v-model="newName" placeholder="用户名" style="width: 150px; height: 30px;"/>
              <el-button class="changeBtn" v-if="info.isEdit" @click="info.isEdit = !info.isEdit" type="primary" plain>修改</el-button>
              <el-button class="changeBtn" v-if="!info.isEdit" @click="checkEdit" type="success" plain>完成</el-button>
              <el-button class="changeBtn lastBtn" v-if="!info.isEdit" @click="info.isEdit = !info.isEdit" type="info" plain>取消</el-button>
            </div>
            <div class="email">
              邮&nbsp;&nbsp;&nbsp;箱：
              <span class="email-detail">{{ info.email }}</span>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import router from '../../router'
import { useStore } from "vuex"
const store = useStore()

if (!store.state.isLogin) {
  router.push('/Lost')
  store.state.LoginRegisterVisible = true
}

// 获取表单DOM元素
const uploadForm = ref()

// 表单绑定的信息-头像
const form = reactive({
  imageUrl: ''
})

const info = reactive({
  name: '我是傻逼我是傻逼我是傻逼我是傻逼',
  email: '',
  isEdit: true
})

const newName = ref(info.name)

const avatarHeader = reactive({
  Authorization: window.sessionStorage.getItem('token')
})

// 头像上传相关
const handleAvatarSuccess = (response, uploadFile) => {
  if (response.code === 200) {
    form.imageUrl = response.data
    // // 更新本地存的信息
    // const obj = JSON.parse(sessionStorage.getItem('userInfo'))
    // obj.avatar = response.data
    // sessionStorage.setItem('userInfo', JSON.stringify(obj))
  } else {
    // ElMessage({
    //   showClose: true,
    //   message: response.msg,
    //   type: 'error',
    //   duration: 800
    // })
  }
}

// 运行效果上传
const handleUpload = (uploadFile) => {
  if (uploadFile.type !== 'image/jpeg' && uploadFile.type !== 'image/png') {
    Message('error', '头像格式必须是JPG/JPEG/PNG格式！')
    return false
  } else if (uploadFile.size / 1024 / 1024 > 4) {
    Message('error', '头像大小不能超过4MB！')
    return false
  }
  return true
}

// 验证修改的用户名+修改用户名
function checkEdit () {
  const reg = /^.{1,16}$/
  if (newName.value === '') {
    newName.value = info.name
    ElMessage({
      showClose: true,
      message: '用户名不能为空！',
      type: 'error',
      duration: 800
    })
  } else if(newName.value === info.name) {
    info.isEdit = !info.isEdit
  } else if (reg.test(newName.value)) {
    // $api.user.updateUsername({ username: newName.value })
    //   .then((res: AxiosResponse) => {
    //     // console.log(res)
    //     if (res.data.code === 200) {
    //       successMsg.value.$el.click()
          info.name = newName.value
    //       // 更新本地存的信息
    //       const obj = JSON.parse(sessionStorage.getItem('userInfo')!)
    //       obj.username = newName.value
    //       sessionStorage.setItem('userInfo', JSON.stringify(obj))
    //     } else {
    //       // 修改提示文字内容
    //       warningText = res.data.msg
    //       warningMsg.value.$el.click()
    //     }
    //   })
    //   .catch((err: AxiosError) => {
    //     warningText = '请求出错'
    //     warningMsg.value.$el.click()
    //     console.log(err.message)
    //   })
    info.isEdit = !info.isEdit
  } else {
    ElMessage({
      showClose: true,
      message: '用户名必须为6-16位任意字符！',
      type: 'error',
      duration: 800
    })
  }
}

// 读取用户信息
// if (sessionStorage.getItem('userInfo') !== null) {
//   const obj = JSON.parse(sessionStorage.getItem('userInfo')!)
//   newName.value = obj.username
//   info.name = obj.username
//   info.email = obj.email
//   form.imageUrl = obj.avatar
// }
</script>

<style scoped>
  #info-layout {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }

  h2 {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;

    color: rgb(86, 86, 86);
  }

  .info-box {
    color: rgb(96, 98, 102);
  }

  .other-info {
    width: 400px;

    color: rgb(96, 98, 102);
    font-size: 15px;
    letter-spacing: 1px;
  }

    /* 表单整体 */
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0 auto;
    padding: 30px 45px 30px 10px;
    width: 600px;

    border-radius: 5px;
  }

  .form h2 {
    color: rgb(37, 41, 51);
  }

  .avatar-uploader {
    border: 1px dashed #d4d4d4;
    transition: all .2s ease-out;
  }

  .avatar-uploader:hover {
    border-color: #8ac2fb;
    transition: all .2s ease-out;
  }

  .avatar-uploader:hover i {
    color: #80c0ff;
    transition: all .2s ease-out;
  }

  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }

  i {
    font-size: 12px;
    color: #8c939d;
    transition: all .2s ease-out;
  }

  /* 头像上传框 */
  .avatar-uploader-icon {
    flex-direction: column;
  }

  /* 上传头像按钮 */
  .submitBtn {
    margin-top: -20px;
  }

  .main {
    letter-spacing: 1px;
  }

  /* 修改按钮 */
  .changeBtn {
    margin-left: 20px;

    width: 45px;
    height: 25px;

    font-size: 13px;
  }

  .name {
    display: flex;
    align-items: center;

    margin-top: 20px;
    height: 40px;
    width: 100%;
  }

  .email {
    margin-top: 40px;
    width: 100%;
  }

  .lastBtn {
    margin-left: 10px;
  }
</style>
