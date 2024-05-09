<template>
  
  <div class="wrapper">
    <h2 class="title">重置密码</h2>
    <el-main class="justify-align-center">
      <el-form :model="form" label-width="100px" ref="ruleFormRef" :rules="rules" class="justify-align-center">
        <el-form-item label="邮箱：" prop="email" autocomplete="off">
          <el-input v-model="form.email" placeholder="输入邮箱" style="width: 220px;" @keyup.enter="onSubmit"/>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPwd" autocomplete="off">
          <el-input v-model="form.newPwd" type="password" placeholder="输入6-16位任意数字或字母" show-password style="width: 220px;" @keyup.enter="onSubmit"/>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPwd" autocomplete="off">
          <el-input
            v-model="form.checkPwd"
            type="password"
            autocomplete="off"
            placeholder="再次输入密码"
            show-password
            style="width: 220px;"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-button @click="onSubmit" style="width: 150px; margin-top: 40px;">确认</el-button>
      </el-form>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import router from '../../router'
import { useStore } from "vuex"
const store = useStore()

if (!store.state.isLogin) {
  router.push('/Lost')
  store.state.LoginRegisterVisible = true
}

// 获取表单元素
const ruleFormRef = ref()

const form = reactive({
  email: '',
  newPwd: '',
  checkPwd: ''
})

const rules = reactive({
  email: [{ validator: (rule, value, callback) => {
        const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        if (value === '') {
          callback(new Error('请输入邮箱！'))
        } else if (!reg.test(value)) {
          callback(new Error('邮箱格式有误！'))
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

const onSubmit = () => {
  ruleFormRef.value.validate((valid) => {
    // 校验成功
    if (valid) {
      

      ElMessage({
        showClose: true,
        message: '重置成功！',
        type: 'success',
        duration: 800
      })
    } else {
      return false
    }
  })
}
</script>

<style>
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
</style>
