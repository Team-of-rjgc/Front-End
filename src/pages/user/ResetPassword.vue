<template>
  <div class="justfy-align-center wrapper">
    <h2 class="title">重置密码</h2>
    <el-form :model="form" label-width="100px" ref="ruleFormRef" :rules="rules" class="justfy-align-center">
      <el-form-item label="原密码：" prop="oldPwd" autocomplete="off">
        <el-input v-model="form.oldPwd" type="password" placeholder="输入原密码" show-password style="width: 220px;" @keyup.enter="onSubmit"/>
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
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

// 获取表单元素
const ruleFormRef = ref()

const form = reactive({
  oldPwd: '',
  newPwd: '',
  checkPwd: ''
})

const rules = reactive({
  oldPwd: [{ validator: (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入原密码！'))
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
  height: 100%;
}

.title {
  margin-bottom: 60px;
}
</style>
