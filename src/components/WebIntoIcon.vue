
<script setup>
import Lottie from 'lottie-web';
import { onMounted, ref } from 'vue';
// 动画阶段
const stage = ref(0);
// 确保DOM挂载后再加载动画
onMounted(() => {
  Lottie.loadAnimation({
    container: document.getElementById("container_box"),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: './src/assets/lottie/WebIntoIcon.json'
  });
  // 开始动画序列
  stage.value = 1; // 第一阶段
  setTimeout(() => {
    stage.value = 2; // 第二阶段
  }, 3000);
});
</script>

<template>
  <div id="container">
    <div id="container_box"
      :class="{ 'container_box_stage_2': stage >= 2 }">
    </div>
  </div>
</template>

<style scoped>
  #container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }
  #container_box {
    position: absolute;
    top: 50%;
    left: 50%;
    /* 居中偏移 */
    transform: translate(-50%, -50%);
    width: 30rem;
    height: 30rem;
    transition: all 1s ease-in-out;
  }
  #container_box.container_box_stage_2 {
    /* 定位到左上角 */
    top: 0;
    left: 0;
    transform: translate(0, 0);
    background-color: bisque;
    width: 10rem;
    height: 10rem;
  }

</style>