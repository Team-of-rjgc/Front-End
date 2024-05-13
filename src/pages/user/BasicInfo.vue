<template>
    <div id="info-layout">
      <h2>基本信息</h2>
      <el-container class="info-box">
        <el-main class="main justify-align-center">
          <el-form :model="form" ref="uploadForm" style="width: 400px;">
            <el-form-item label="头像：" ref="uploadEle">
              <el-upload class="avatar-uploader"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                accept=".jpg, .jpeg, .png"
                :on-change="uploadAvatar"
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
import { reactive, ref, inject } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import router from '../../router'
import { useStore } from "vuex"
const store = useStore()
const $API = inject('$API')
const $Tools = inject('$Tools')

if (!store.state.isLogin) {
  router.push('/Lost')
  store.state.LoginRegisterVisible = true
}

// 获取表单DOM元素
const uploadForm = ref()

// 表单绑定的信息-头像
let form = reactive({
  imageUrl: ''
})

let info = reactive({
  name: store.state.userInfo.nickName,
  email: store.state.userInfo.email,
  isEdit: true
})

let newName = ref(info.name)

// 读取用户信息
if (JSON.stringify(store.state.userInfo) !== '{}') {
  newName.value = store.state.userInfo.nickName
  info.name = store.state.userInfo.nickName
  info.email = store.state.userInfo.email
  form.imageUrl = store.state.avatar
}

function uploadAvatar(file) {
  console.log(file);
  const fd = new FormData()
  fd.append('image', file.raw)
  $API.user.setIcon(fd)
    .then(({data}) => {
      if (data.code === 1000) {
        form.imageUrl = URL.createObjectURL(file.raw)
        store.state.avatar = form.imageUrl
        $Tools.showMessage('上传成功', 'success')
      } else {
        console.log(data.msg);
        $Tools.showMessage(data.msg, 'error')
      }
    })
    .catch(err => {
      console.log('err', err)
      $Tools.showMessage('上传头像失败！', 'error')
    })
}

// 验证修改的用户名+修改用户名
function checkEdit () {
  const reg = /^.{1,16}$/
  if (newName.value === '') {
    newName.value = info.name
    showMessage('用户名不能为空！', 'error')
  } else if(newName.value === info.name) {
    info.isEdit = !info.isEdit
  } else if (reg.test(newName.value)) {
    $API.user.setNickName({nickName: newName.value})
      .then(({data}) => {
        if (data.code === 1000) {
          store.state.userInfo.nickName = newName.value
          info.name = newName.value
        } else {
          console.log(data.msg);
          $Tools.showMessage(data.msg, 'error', 1500)
        }
      })
      .catch(err => {
        console.log('err', err)
      })
    info.isEdit = !info.isEdit
  } else {
    showMessage('用户名必须为6-16位任意字符！','error')
  }
}


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
