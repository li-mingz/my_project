
<script setup>
import Lottie from 'lottie-web';
import { onMounted } from 'vue';

// 确保DOM挂载后再加载动画
onMounted(() => {
  Lottie.loadAnimation({
    container: document.getElementById("container_box"),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './src/assets/lottie/WebIntoIcon.json'
  });
});
</script>

<template>
  <div id="container">
    <div id="container_box">
    </div>
  </div>
</template>

<style scoped>
  #container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100vw;
    height: 100vh;
  }
  #container_box {
    position: relative;
    width: 50rem;
    background-color: green;
  }

</style>