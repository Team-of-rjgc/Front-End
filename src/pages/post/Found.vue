<template>
  <div class="bg">
    <div v-if="!ifEmpty">
      寻物启事
    </div>
    
    <div class="justify-align-center" v-else>
      <el-empty description="暂无帖子" />
    </div>
  </div>

  <el-backtop :right="100" :bottom="100" />
</template>

<script setup>

// 是否有帖子
let ifEmpty = false
</script>

<style>

</style>
