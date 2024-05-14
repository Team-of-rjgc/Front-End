<template>
  
  <div class="wrapper">
    <h2 class="title">重置密码</h2>
    <el-main class="justify-align-center">
      <el-form :model="form" label-width="100px" ref="ruleFormRef" :rules="rules" class="justify-align-center">
        <el-form-item label="邮箱" prop="email" autocomplete="off">
          <el-input v-model="form.email" placeholder="输入邮箱" @keyup.enter="onSubmit"
           class="input-box"/>
        </el-form-item>
        <el-form-item  label="验证码" prop="veriCode" class="email">
          <el-input v-model="form.veriCode" placeholder="验证码" clearable class="input-box"></el-input>
          <el-button class="get-verification-btn" @click="getCode" :disabled="codeBtn.disabled">{{ codeBtn.msg }}</el-button>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd" autocomplete="off">
          <el-input v-model="form.newPwd" type="password" placeholder="输入6-16位任意数字或字母" show-password @keyup.enter="onSubmit"
           class="input-box"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd" autocomplete="off">
          <el-input
            v-model="form.checkPwd"
            type="password"
            autocomplete="off"
            placeholder="再次输入密码"
            show-password
            @keyup.enter="onSubmit"
             class="input-box"
          />
        </el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)" style="width: 150px; margin-top: 40px;">确认</el-button>
      </el-form>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, ref, inject } from 'vue'
import router from '../../router'
import { useStore } from "vuex"

const store = useStore()
const $API = inject('$API')
const $Tools = inject('$Tools')

if (!store.state.isLogin) {
  router.replace('/Lost')
  store.state.LoginRegisterVisible = true
}

// 获取表单元素
const ruleFormRef = ref()

const form = reactive({
  email: '',
  veriCode: '',
  newPwd: '',
  checkPwd: ''
})

// 获取验证码按钮相关
let codeBtn = reactive({
  disabled: true,
  msg: '获取验证码'
})

// 获取验证码按钮倒计时
let timer = null

const rules = reactive({
  email: [{ validator: (rule, value, callback) => {
    const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (value === '') {
      callback(new Error('请输入邮箱！'))
    } else if (!reg.test(value)) {
      // 获取验证码按钮禁用
      codeBtn.disabled = true
      callback(new Error('邮箱格式有误！'))
    } else {
      // 获取验证码按钮启用
      codeBtn.disabled = false
      callback()
    }
  }, trigger: 'change' }],
  veriCode:  [{ validator: (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入验证码！'))
    } else {
      callback()
    }
  }, trigger: 'blur' }],
  newPwd: [{ validator: (rule, value, callback) => {
    const reg = /^[a-zA-Z0-9]{6,16}$/
    if (value === '') {
      callback(new Error('请输入新密码！'))
    } else if (!reg.test(value)) {
      callback(new Error('请输入6-16位的数字或字母！'))
    } else {
      if (form.checkPwd !== '') {
      if (ruleFormRef.value === '') return
      ruleFormRef.value.validateField('checkPass', () => null)
      }
      callback()
    }
  }, trigger: 'blur' }],
  checkPwd: [{ validator: (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码！'))
    } else if (value !== form.newPwd) {
      callback(new Error('两次输入的密码不匹配！'))
    } else {
      callback()
    }
  }, trigger: 'blur' }]
})

function onSubmit (formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    // 校验成功
    if (valid) {
      $API.user.resetPassword({
        email: form.email,
        newPassword: form.newPwd,
        confirmPassword: form.checkPwd,
        code: form.veriCode
      })
        .then(({data}) => {
          // console.log(data)
          if (data.code === 1000) {
            $Tools.showMessage('重置成功！', 'success')
          } else {
            console.log(data.msg)
            $Tools.showMessage(data.msg, 'error')
          }
        })
        .catch((err) => {
          console.log('err', err)
          $Tools.showMessage('重置失败！', 'error')
        })
    } else {
      return false
    }
  })
}

function getCode() {
  // 倒计时
  if (timer) clearInterval(timer)
  let countDown = 60
  timer = setInterval(() => {
    codeBtn.disabled = true
    codeBtn.msg = "重新发送(" + countDown + "s)"
    if (countDown == 0) {
      codeBtn.disabled = false
      codeBtn.msg = "获取验证码"
      clearInterval(timer)
      timer = null
      countDown = 60
    }
    countDown-- 
  }, 1000);

  if (store.state.userInfo.email !== form.email) {
    $Tools.showMessage('该账号绑定的邮箱与输入的邮箱不符！', 'error')
    if (timer) clearInterval(timer)
    codeBtn.disabled = false
    codeBtn.msg = "获取验证码"
    return
  }

  $API.user.getResetEmailCode({email: form.email})
    .then(({data}) => {
      // console.log(data)
      if (data.code === 1000) {
        $Tools.showMessage('获取成功，请前往邮箱查看。', 'success')
      } else {
        console.log(data.msg)
        $Tools.showMessage(data.msg, 'error')
      }
    })
    .catch((err) => {
      console.log('err', err)
      $Tools.showMessage('获取验证码失败。', 'error')
    })
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  height: 100%;
}

.title {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  color: rgb(86, 86, 86);
}

.email {
  position: relative;
}

.get-verification-btn {
  position: absolute;
  width: 100px;
  right: -4px;
  scale: .9;
}

:deep(.el-form .el-form-item__label) {
  margin-right: 20px;
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
  width: 250px;
}

.email .input-box {
  width: 250px;
}
</style>
