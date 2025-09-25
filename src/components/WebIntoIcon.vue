<template>
  <div class="animation-container">
    <!-- 动画元素容器 -->
    <div 
      class="center-container"
      :class="{ 
        'center-container-moved-to-corner': stage >= 3 
      }"
    >
      <!-- 上部线条 -->
      <div 
        class="line top-line"
        :class="{ 
          'expanded-horizontal': stage >= 1, 
          'moved-up': stage >= 2,
          'line-moved-to-corner': stage >= 3 
        }"
      ></div>
      
      <!-- 线条之间的文字容器 -->
      <div class="text-clip-container" :class="{ 'active': stage >= 2 }">
        <!-- 线条之间的文字 -->
        <div class="line-text-title"
          :style="{ fontSize: textSize }"
          :class="{ 'slide-in': stage >= 2 }">
          WIKI
        </div>

        <!-- 中间文本的裁剪容器 -->
        <div class="middle-text-clip"
            :class="{'least-hidden': stage >= 3}">
          <div class="line-text-middle"
            :style="{ fontSize: middleTextSize }"
            :class="{ 'slide-up': stage >= 2}">
            SYNTHESIZE INFORMATION
          </div>
        </div>
        <!-- 底部文本 -->
        <div class="line-text-botttom"
          :style="{ fontSize: bottomTextSize }"
          :class="{'least-hidden': stage >= 3}">
          <span 
            v-for="(char, index) in bottomTextChars" 
            :key="index"
            :class="{ 
              'visible': bottomCharIsVisible[index],
              'font-bold': isOSPart(index),
              'space-char': char === ' ' // 为空格
            }"
            class="bottom-text-char"
          >
            {{ char }}
          </span>
        </div>
      </div>
      
      <!-- 下部线条 -->
      <div 
        class="line bottom-line"
        :class="{ 
          'expanded-horizontal': stage >= 1, 
          'moved-down': stage >= 2,
          'line-moved-to-corner': stage >= 3 
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
// 线条的半宽和半高
const lineHalfWidthNum = ref(24);
const lineHalfHightNum = ref(20);
const lineHalfWidth = ref(`${lineHalfWidthNum.value}vw`);
const lineHalfHight = ref(`${lineHalfHightNum.value}vh`);
// 线条的厚度
const lineThickness = ref('3px');

// 底部文本内容
const bottomText = ref("ANALYSYS  OS");
// 将文本拆分为字符数组
const bottomTextChars = ref(bottomText.value.split(''));
// 跟踪每个字符是否可见
const bottomCharIsVisible = ref([]);

// 判断是否为字符 OS
const isOSPart = (index) => {
  // "ANALYSYS OS"中"OS"位于最后两个位置
  return index === bottomTextChars.value.length - 2 || 
         index === bottomTextChars.value.length - 1;
};


// 计算文字大小为线段长度的1/4
const textSize = computed(() => {
  // 线段长度是lineHalfWidth的2倍
  const lineLength = lineHalfWidthNum.value * 2;
  // 返回线段长度1/4的尺寸
  return `${lineLength / 4.0}vw`;
});
const middleTextSize = computed(() => {
  // 线段长度是lineHalfWidth的2倍
  const lineLength = lineHalfWidthNum.value * 2;
  // 返回线段长度1/25的尺寸
  return `${lineLength / 25.0}vw`;
});
const bottomTextSize = computed(() => {
  // 线段长度是lineHalfWidth的2倍
  const lineLength = lineHalfWidthNum.value * 2;
  // 返回线段长度1/15的尺寸
  return `${lineLength / 15.0}vw`;
});
// 计算裁剪框的宽度
const textClipContainerWidth = computed(() => {
  return `${lineHalfWidthNum.value * 1.2}vw`
})


// 动画阶段：0-初始点状态，1-水平展开，2-垂直分离，3-移动到角落并缩小
const stage = ref(0);

// 随机显示字符的函数
const revealRandomChars = () => {
  // 找到所有还不可见的字符索引
  const invisibleIndices = [];
  bottomCharIsVisible.value.forEach((visible, index) => {
    if (!visible) {
      invisibleIndices.push(index);
    }
  });
  
  // 如果还有不可见的字符，随机显示一个
  if (invisibleIndices.length > 0) {
    const randomIndex = Math.floor(Math.random() * invisibleIndices.length);
    const charToReveal = invisibleIndices[randomIndex];
    bottomCharIsVisible.value[charToReveal] = true;
    
    // 继续随机显示，直到所有字符都可见
    setTimeout(revealRandomChars, 40); // 控制字符显示速度
  }
};

// 监听stage变化，当进入阶段2时开始字符显示动画
watch(stage, (newStage) => {
  if (newStage == 2) {
    // 初始化所有字符为不可见
    bottomCharIsVisible.value = bottomTextChars.value.map(() => false);
    // 延迟一点时间后开始显示字符
    setTimeout(revealRandomChars, 500);
  }
});

onMounted(() => {
  // 开始动画序列
  setTimeout(() => {
    stage.value = 1; // 开始水平展开
    setTimeout(() => {
      stage.value = 2; // 开始垂直分离
      setTimeout(() => {
        stage.value = 3; // 移动到角落并缩小
      }, 2000); // 等待垂直分离动画完成
    }, 1000); // 等待水平展开动画完成
  }, 500);
});
</script>

<style scoped>
.animation-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  overflow: hidden;
  position: relative;
}

/* 页面中心容器 */
.center-container {
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  transition: all 1s ease-in-out;
}

/* 页面中心容器移动到角落并缩小的状态 */
.center-container-moved-to-corner {
  top: calc(0.2 * v-bind(lineHalfHight) + 15px);
  left: calc(0.1 * v-bind(lineHalfWidth) + 15px);
  transform: translate(0, 0) scale(0.2);
}
.line-moved-to-corner {
  opacity: 0;
}

/* 线条基础样式 */
.line {
  position: absolute;
  height: v-bind(lineThickness);
  background-color: #000;
  width: 0;
  left: 0;
  transform-origin: center;
  transition: 
    width 1s ease, 
    transform 2s cubic-bezier(.5,0,0,1),
    opacity 1s ease-in-out;
  border-radius: 1px;
  z-index: 2; /* 确保线条在文字上方 */
}

/* 线条居中 */
.top-line, .bottom-line {
  transform: translateX(-50%);
}

/* 水平展开状态 */
.expanded-horizontal {
  width: v-bind(lineHalfWidth);
}

/* 垂直分离状态 - 顶部线条 */
.moved-up {
  transform: translateX(-50%) translateY(calc(-1 * v-bind(lineHalfHight)));
}

/* 垂直分离状态 - 底部线条 */
.moved-down {
  transform: translateX(-50%) translateY(v-bind(lineHalfHight));
}

/* 文字裁剪容器 - 控制文字显示范围 */
.text-clip-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: v-bind(textClipContainerWidth);
  height: 0; /* 初始高度为0，完全隐藏 */
  overflow: hidden;
  /* overflow: visible; */
  transition: height 2s cubic-bezier(.5,0,0,1);
  display: flex;
  flex-direction: column; /* 垂直排列 */
  justify-content: flex-end; /* 从容器的末尾边缘开始排列，缩小上方空间 */
  align-items: center;
}

/* 激活状态 - 随线段分离扩大高度，排除线段本身 */
.text-clip-container.active {
  height: calc(2 * v-bind(lineHalfHight) - 2 * v-bind(lineThickness));
}

/* 文字样式 */
.line-text-title {
  position: relative;
  transform: translateX(-100%) translateY(5%); /* 初始位置在左侧外部 往下移一点 */
  transition: 1.5s ease-in-out;
  font-weight: 500;
}

/* 文字滑入效果 */
.line-text-title.slide-in {
  transform: translateX(0) translateY(5%); /* 滑到正常位置 */
}


/* 中间文本容器 */
.middle-text-clip {
  position: absolute;
  height: v-bind(middleTextSize);
  overflow: hidden;
  width: 100%;
  transform: translateY(-220%); /* 向上偏移*/
  text-align: center; /* 文本居中 */
}

/* 中间文本样式 */
.line-text-middle {
  position: relative;
  transform: translateY(100%); /* 初始在下方隐藏 */
  transition: transform 0.75s ease-in-out 1s;
}

.line-text-middle.slide-up {
  transform: translateY(-20%); /* 滑动到可见区域 */
}

/* 底部文本样式 */
.line-text-bottom {
  position: relative;
  height: v-bind(bottomTextSize);
  width: 100%;
}
/* 底部文本字符样式 */
.bottom-text-char {
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.3s ease-in-out;
  display: inline-block; /* 确保每个字符单独处理 */
}

/* 显示字符的样式 */
.bottom-text-char.visible {
  opacity: 1; /* 显示字符 */
}
.bottom-text-char.font-bold {
  font-weight: bold;
}
.bottom-text-char.space-char {
  min-width: v-bind(middleTextSize); /* 空格最小宽度 */
}
.least-hidden {
  transition: opacity 1s ease-in-out,
              display 1s ease-in-out;
  opacity: 0;
}

</style>
