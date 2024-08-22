<!-- 页脚组件 -->
<script setup>
import { Sunrise } from '@element-plus/icons-vue'
</script>

<template>
    <div class="footer">
      <el-space direction="vertical">
        <!-- <el-text>
          <el-icon><Sunrise /></el-icon>
          Young
        </el-text> -->
        <!-- <el-row>
          <el-rate/>
        </el-row> -->
        <el-text>
          copyright © Young Forum
        </el-text>
      </el-space>
  </div>
</template>

<style scoped>
.footer {
  background-color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

