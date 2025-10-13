<script setup>
import { ref } from 'vue';

// 当前活动选项
const activeIndex = ref('1')
</script>

<template>
    <div class="aside-body">
        <el-menu
            class="aside"
            :default-active="activeIndex"
        >
            <el-menu-item index="1">
            <div>简介</div>
            </el-menu-item>
            <el-menu-item index="2">
            <div>内容</div>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style scoped>
    .aside {
        width: 10vw;
        height: 100%;
    }
    .aside-body {
        height: 100%;
        display: flex;  /* 内部横向排列 */
    }
</style>