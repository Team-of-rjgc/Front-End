<template>
  <el-dialog
    v-model="$store.state.LoginRegisterVisible"
    width="600"
    align-center
    center
  >
    <div v-if="loginDialog && !forgetDialog" class="main-view">
      <h2 class="title">登录</h2>
      <el-form :model="login" ref="loginFormRef" :rules="loginRules" class="login-form">
        <el-form-item prop="account">
          <el-input v-model="login.account" placeholder="账号" clearable class="input-box"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="login.pwd" placeholder="密码" type="password" show-password clearable class="input-box" @keyup.enter="toLogin(loginFormRef)"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="veri-code">
          <el-input v-model="login.code" placeholder="验证码" clearable class="input-box" @keyup.enter="toLogin(loginFormRef)"></el-input>
          <img :src="codeUrl" alt="" class="verify-img">
        </el-form-item>
        <span class="change-code-img switch-btn" @click=getCodeImg>换一张</span>
        <el-button type="primary" @click="toLogin(loginFormRef)" class="confirm-btn">确定</el-button>
      </el-form>
      <div class="footer">
        <div class="switch-btn" @click="loginDialog = false; forgetDialog = false">没有账号？去注册</div>
        <div class="switch-btn" @click="forgetDialog = true; loginDialog = false">忘记密码</div>
      </div>
    </div>

    <div v-if="!loginDialog && !forgetDialog" class="main-view">
      <h2 class="title">注册</h2>
      <el-form :model="register" ref="registerFormRef" :rules="registerRules">
        <el-form-item prop="email">
          <el-input v-model="register.email" placeholder="邮箱" clearable class="input-box"></el-input>
        </el-form-item>
        <el-form-item prop="veriCode" style="width: 400px;" class="email">
          <el-input v-model="register.veriCode" placeholder="验证码" clearable class="input-box"></el-input>
          <el-button class="get-verification-btn" @click="getCode('register')" :disabled="codeBtn.disabled">{{ codeBtn.msg }}</el-button>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="register.pwd" placeholder="密码（6-16位的数字或字母）" type="password" show-password clearable class="input-box"></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd">
          <el-input v-model="register.checkPwd" placeholder="确认密码" type="password" show-password clearable class="input-box" @keyup.enter="toRegister(registerFormRef)"></el-input>
        </el-form-item>
        <el-button type="primary" @click="toRegister(registerFormRef)" class="confirm-btn">确定</el-button>
      </el-form>
      <div class="switch-btn" @click="loginDialog = true; forgetDialog = false">已有账号？去登录</div>
    </div>

    <div v-if="!loginDialog && forgetDialog" class="main-view forget-view">
      <div class="align-center go-back" @click="loginDialog = true; forgetDialog = false">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </div>
      <h2 class="title">忘记密码</h2>
      <el-form :model="register" ref="registerFormRef" :rules="registerRules">
        <el-form-item prop="email">
          <el-input v-model="register.email" placeholder="邮箱" clearable class="input-box"></el-input>
        </el-form-item>
        <el-form-item prop="veriCode" style="width: 400px;" class="email">
          <el-input v-model="register.veriCode" placeholder="验证码" clearable class="input-box"></el-input>
          <el-button class="get-verification-btn" @click="getCode('reset')" :disabled="codeBtn.disabled">{{ codeBtn.msg }}</el-button>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="register.pwd" placeholder="密码（6-16位的数字或字母）" type="password" show-password clearable class="input-box"></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd">
          <el-input v-model="register.checkPwd" placeholder="确认密码" type="password" show-password clearable class="input-box" @keyup.enter="forgetPwd(registerFormRef)"></el-input>
        </el-form-item>
        <el-button type="primary" @click="forgetPwd(registerFormRef)" class="confirm-btn">确定</el-button>
      </el-form>
      
    </div>
  </el-dialog>
</template>

<script setup>
import { useStore } from "vuex"
import { reactive, ref, watch, inject } from "vue";
import { ArrowLeft } from '@element-plus/icons-vue'

const $API = inject('$API')
// vuex的store
const store = useStore()

let loginDialog = ref(true)
let forgetDialog = ref(false)
const loginFormRef = ref()
const registerFormRef = ref()

let codeUrl = ref('http://10.21.32.86:8080/api/v1/public/verifyCode')

let login = reactive({
  account: '',
  pwd: '',
  code: 'lostfound'
})
let register = reactive({
  email: '',
  veriCode: '',
  pwd: '',
  checkPwd: ''
})

// 校验
const loginRules = reactive({
  account: [{ validator: (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入账号！'))
    } else {
      callback()
    }
  }, trigger: 'blur' }],
  pwd: [{ validator: (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入密码！'))
    } else {
      callback()
    }
  }, trigger: 'blur' }],
  code: [{ validator: (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入验证码！'))
    } else {
      callback()
    }
  }, trigger: 'blur' }],
})

const registerRules = reactive({
  email: [{ validator: (rule, value, callback) => {
    const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    // const reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})(\.[a-z]{2,})?$/
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
  pwd: [{ validator: (rule, value, callback) => {
    const reg = /^[a-zA-Z0-9]{6,16}$/
    if (value === '') {
      callback(new Error('请输入密码！'))
    } else if (!reg.test(value)) {
      callback(new Error('密码需为6-16位的数字或字母！'))
    } else {
      callback()
    }
  }, trigger: 'blur' }],
  checkPwd: [{ validator: (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码！'))
    } else if (value !== register.pwd) {
      callback(new Error('两次输入的密码不匹配！'))
    }else {
      callback()
    }
  }, trigger: 'blur' }],
})

// 获取验证码按钮相关
let codeBtn = reactive({
  disabled: true,
  msg: '获取验证码'
})

// 获取验证码按钮倒计时
let timer = null

// 登录 图片验证码
function getCodeImg() {
  codeUrl.value = 'http://10.21.32.86:8080/api/v1/public/verifyCode' + '?'
}

// 发送邮箱验证码
function getEmailCode(type) {
  if (type === 'register') {
    $API.user.getRegisterEmailCode({email: register.email})
      .then(({data}) => {
        // console.log(data)
        if (data.code === 1000) {
          ElMessage({
            showClose: true,
            message: '获取成功，请前往邮箱查看。',
            type: 'success',
            duration: 1500
          })
        } else {
          console.log(data.msg)
          ElMessage({
            showClose: true,
            message: data.msg,
            type: 'error',
            duration: 1500
          })
        }
      })
      .catch((err) => {
        console.log('err', err)
        ElMessage({
          showClose: true,
          message: '获取验证码失败。',
          type: 'error',
          duration: 1500
        })
      })
  } else if (type === 'reset') {
    $API.user.getResetEmailCode({email: register.email})
      .then(({data}) => {
        // console.log(data)
        if (data.code === 1000) {
          ElMessage({
            showClose: true,
            message: '获取成功，请前往邮箱查看。',
            type: 'success',
            duration: 1500
          })
        } else {
          console.log(data.msg)
          ElMessage({
            showClose: true,
            message: data.msg,
            type: 'error',
            duration: 1500
          })
        }
      })
      .catch((err) => {
        console.log('err', err)
        ElMessage({
          showClose: true,
          message: '获取验证码失败。',
          type: 'error',
          duration: 1500
        })
      })
  }
}

// 注册/重置密码 邮箱验证码
function getCode(type) {
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
  }, 1500);
  console.log(type)
  
  getEmailCode(type)
}

function toLogin(formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    // 校验成功
    if (valid) {
      $API.user.login({
        email: login.account,
        password: login.pwd,
        code: login.code
      })
        .then(({data}) => {
          // console.log(data)
          if (data.code === 1000) {
            ElMessage({
              showClose: true,
              message: '登录成功！',
              type: 'success',
              duration: 1500
            })
            store.state.LoginRegisterVisible = false
            store.state.isLogin = true
            store.state.userInfo = data.data.user
            // for (let key in data.data.user) {
            //   if (data.data.user[key]) sessionStorage.setItem(key, data.data.user[key])
            // }
          } else {
            console.log(data.msg)
            getCodeImg() // 重新获取验证码
            ElMessage({
              showClose: true,
              message: data.msg,
              type: 'error',
              duration: 1500
            })
          }
        })
        .catch((err) => {
          console.log('err', err)
          ElMessage({
            showClose: true,
            message: '登录失败！',
            type: 'error',
            duration: 1500
          })
        })
    } else {
      return false
    }
  })
}

function toRegister(formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    // 校验成功
    if (valid) {
      $API.user.register({
        email: register.email,
        password: register.checkPwd,
        code: register.veriCode
      })
        .then(({data}) => {
          // console.log(data)
          if (data.code === 1000) {
            ElMessage({
              showClose: true,
              message: '注册成功！正在前往登录页...',
              type: 'success',
              duration: 1500
            })
            loginDialog.value = true
          } else {
            console.log(data.msg)
            ElMessage({
              showClose: true,
              message: data.msg,
              type: 'error',
              duration: 1500
            })
          }
        })
        .catch((err) => {
          console.log('err', err)
          ElMessage({
            showClose: true,
            message: '注册失败！',
            type: 'error',
            duration: 1500
          })
        })
    } else {
      return false
    }
  })
}

function forgetPwd(formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    // 校验成功
    if (valid) {
      $API.user.resetPassword({
        email: register.email,
        newPassword: register.pwd,
        confirmPassword: register.checkPwd,
        code: register.veriCode
      })
        .then(({data}) => {
          // console.log(data)
          if (data.code === 1000) {
            ElMessage({
              showClose: true,
              message: '重置成功！正在前往登录页...',
              type: 'success',
              duration: 1500
            })
            loginDialog.value = true
            forgetDialog.value = false
          } else {
            console.log(data.msg)
            ElMessage({
              showClose: true,
              message: data.msg,
              type: 'error',
              duration: 1500
            })
          }
        })
        .catch((err) => {
          console.log('err', err)
          ElMessage({
            showClose: true,
            message: '重置失败！',
            type: 'error',
            duration: 1500
          })
        })
    } else {
      return false
    }
  })
}

watch(() => store.state.LoginRegisterVisible, (newVal, oldVal) => {
  if (newVal === false && oldVal === true) {
    // 刷新key 实现下次打开页面时重新加载组件
    store.state.LoginRegisterKey++
  }
})

watch(() => loginDialog.value, (val) => {
  // 切换登录/注册页时 清空model数据
  for (const key in register) {
    register[key] = ''
  }
  for (const key in login) {
    login[key] = ''
  }
})

watch(() => forgetDialog.value, () => {
  // 清空model数据
  for (const key in login) {
      login[key] = ''
    }
  for (const key in register) {
    register[key] = ''
  }
  // 清空计时器 重置按钮
  if (timer) clearInterval(timer)
  codeBtn.disabled = false
  codeBtn.msg = "获取验证码"
})
</script>

<style>
.main-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  margin-bottom: 30px;
}

.switch-btn {
  color: var(--el-color-primary-light-5);
  font-size: 11px;
  cursor: pointer;
}

.confirm-btn {
  margin: 10px 0 30px;
  width: 400px;
}

.input-box {
  width: 400px;
}

.email {
  position: relative;
}

.get-verification-btn {
  position: absolute;
  width: 120px;
  right: 0px;
}

.email .input-box {
  width: 275px;
}

.footer {
  display: flex;
  justify-content: space-between;

  padding: 0 80px;
  width: 100%;
}

.forget-view {
  position: relative;
}

.go-back {
  position: absolute;
  top: -18px;
  left: 0;

  font-size: 14px;
  color: rgb(168, 171, 178);
  cursor: pointer;

  transition: all .15s;
}

.go-back:hover {
  color: var(--el-color-primary-light-3);
  transition: all .15s;
}

.change-code-img {
  float: right;
  display: block;
}

.login-form {
  width: 400px;
}

.verify-img {
  height: 60px;
}

.veri-code .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 400px;
}

.veri-code .input-box {
  margin-right: 10px;
  width: 230px;
}
</style>
