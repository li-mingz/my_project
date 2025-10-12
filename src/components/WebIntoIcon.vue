
<script setup>
import Lottie from 'lottie-web';
import { onMounted, ref } from 'vue';
// 动画阶段
const stage = ref(0);
// 左上角透明度
const background1 = ref(1)
// 右下角角透明度
const background2 = ref(1)
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
    setTimeout(() => {
      stage.value = 3; // 第三阶段
      startBackgroundChange(background1);
      setTimeout(() => {
        startBackgroundChange(background2);
      }, 1000);
      setTimeout(() => {
        document.getElementById("container_background").remove();
      }, 2000);
    }, 1500);
  }, 3000);
});

const startBackgroundChange = (background) => {
    // 启动定时器
  const timer = setInterval(() => {
    // 每次减0.01（处理浮点数精度问题，用toFixed保留2位小数后转数字）
    background.value = Number((background.value - 0.01).toFixed(2));
    
    // 当值≤0时，停止定时器并执行回调
    if (background.value <= 0) {
      background.value = 0; // 确保最终值为0
      clearInterval(timer);
    }
  // 10ms
  }, 10);
}

</script>

<template>
  
  <el-menu
    id="header"
    mode="horizontal"
    :ellipsis="false"
  >
    <div id="container_background"
      :class="{ 'container_background_stage_3': stage >= 3 }"
      :style="{'--background1': background1, '--background2': background2}"></div>
    <div id="container_box"
      :class="{ 
        'container_box_stage_2': stage >= 2,
        'container_box_stage_3': stage >= 3 
        }">
    </div>
  </el-menu>
</template>

<style scoped>
  #container_background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    /* 线性渐变：从左上角到右下角 */
    /* 第一个颜色：左上角 */
    /* 第二个颜色：右下角 */
    background: linear-gradient(to bottom right, 
      rgba(255, 255, 255, var(--background1)),  /* 起始颜色*/
      rgba(255, 255, 255, var(--background2))   /* 结束颜色*/
    );
    transition: all 1s ease-in-out;
  }
  #container_box {
    position: fixed;
    top: 50%;
    left: 50%;
    /* 居中偏移 */
    transform: translate(-50%, -50%);
    width: 30rem;
    height: 30rem;
    transition: all 1.5s ease-in-out;
    /* 不响应交互 */
    pointer-events: none;
  }
  #container_box.container_box_stage_2 {
    position: fixed;
    /* 定位到左上角 */
    top: 0;
    left: 0;
    transform: translate(0, -20%);
    width: 10rem;
    height: 10rem;
  }
  #container_box.container_box_stage_3 {
    position: absolute;
  }
  #header {
    background-image: url(./src/assets/png/header_bg.png);
  }

</style>