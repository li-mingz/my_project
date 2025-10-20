<script setup>
    // 组件卸载时，
    onUnmounted(() => {
    window.isOldComponentUnmounted = true
    })
</script>

<template>
    <p>芝士首页</p>
</template>

<style scoped>

</style>