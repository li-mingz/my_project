
<script setup>
import Lottie from 'lottie-web';
import { onMounted, provide, ref } from 'vue';
import PageDocs from './PageDocs.vue';
// 动画阶段
const stage = ref(0);
// 左上角透明度
const background1 = ref(1)
// 右下角透明度
const background2 = ref(1)
// 当前活动Header选项
const activeIndex = ref('1')
const headerElement = ref(null)
// 传入当前活动项
provide("activeIndex", activeIndex)
// 确保DOM挂载后再加载动画
onMounted(() => {
  if (headerElement.value) {
    document.documentElement.style.setProperty('--header-height', `${headerElement.value.$el.offsetHeight}px`);
  }
  Lottie.loadAnimation({
    container: document.getElementById("container_box"),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: './lottie/IntoAnimation.json'
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
});

const headerSelectItem = (key, keyPath) => {
  activeIndex.value = key;
}
</script>

<template>
  <div class="main">
    <el-menu
      id="header"
      ref="headerElement"
      mode="horizontal"
      :ellipsis="false"
      :default-active="activeIndex"
      @select="headerSelectItem"
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
      <el-menu-item index="1">
        <div>首页</div>
      </el-menu-item>
      <el-menu-item index="2">
        <div>文档</div>
      </el-menu-item>
      <div class="menu-links">
        <a href="https://github.com/li-mingz/limingz/tree/master"  target="_blank">
        <svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true">
          <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
        </svg>
        </a>
      </div>
    </el-menu>
    <!-- 内容区域：根据activeIndex切换显示 -->
    <div class="body">
      <div v-show="activeIndex === '1'">
        <h2>这是页面1的内容</h2>
      </div>
      <div v-show="activeIndex === '2'">
        <PageDocs/>
      </div>
    </div>
  </div>
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
    z-index: 999;
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
    z-index: 999;
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
    background-image: url(@/assets/png/header_bg.png);
  }
  .el-menu--horizontal > .el-menu-item:nth-of-type(1) {
    margin-left: auto;
  }
  .el-menu--horizontal > .el-menu-item > div {
    font-family: 'SourceHanSansSC-Bold';
    margin: 3rem;
  }
  .menu-links {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 3rem;
    margin-right: 3rem;
  }
  .main {
    display: flex;
    flex-direction: column; /* 垂直排列Header和主体 */
    min-height: 100vh; /* 容器占满视口高度 */
  }
  .body {
    flex: 1; /* 占据Header下方的全部剩余高度 */
    display: flex;
  }
  .body > div {
    flex: 1;
    display: flex;
  }
</style>