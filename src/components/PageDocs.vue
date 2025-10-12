<script setup>
import { ref } from 'vue';

// 当前活动选项
const activeIndex = ref('1')
</script>

<template>
    <div>
        <el-menu
            class="leftMenu"
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
    .leftMenu {
        width: 10vw;
        height: 100vh;
        background-image: url(./src/assets/png/left_menu_bg.jpg);
    }
</style>