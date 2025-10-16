<script setup>
import { ref, onMounted } from 'vue';
// 引入 markdown-it 和 highlight.js
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
// 引入 highlight.js 样式
import 'highlight.js/styles/default.min.css';
// 引入 github-markdown 样式
import 'github-markdown-css/github-markdown.css';
// 引入 KaTeX 样式（必须，否则公式无法正常显示）
import 'katex/dist/katex.min.css';
// 引入 github-markdown 所需插件
import checkbox from 'markdown-it-task-lists'; // 任务列表（- [x]）
import abbr from 'markdown-it-abbr'; // 缩写
import deflist from 'markdown-it-deflist'; // 定义列表
import footnote from 'markdown-it-footnote'; // 脚注
import ins from 'markdown-it-ins'; // 下划线（++内容++）
import mark from 'markdown-it-mark'; // 标记（==内容==）
import sub from 'markdown-it-sub'; // 下标（H~2~O）
import sup from 'markdown-it-sup'; // 上标（2^10^）
import anchor from 'markdown-it-anchor'; // 标题id生成
import mk from 'markdown-it-katex'; // 数学公式

// 动态菜单配置
const menuList = ref([
  { index: '1', name: '简介', mdPath: './markdown/test.md' },
  { index: '2', name: '内容', mdPath: './markdown/test2.md' },
  { index: '3', name: '注意事项', mdPath: './markdown/notice.md' }
]);

// 当前激活的菜单索引
const activeIndex = ref(menuList.value[0].index);

// 初始化 markdown-it
const md = markdownit({
  // 代码高亮
  highlight: function (str, lang) {
    return hljs.highlight(str, { language: lang }).value;
  },
  html: true,       // 允许 HTML
  breaks: true,     // 换行符转为 <br>
  linkify: true,    // 自动识别链接
  typographer: true // 优化排版
})
.use(checkbox)
.use(abbr)
.use(deflist)
.use(footnote)
.use(ins)
.use(mark)
.use(sub)
.use(sup)
.use(anchor)
.use(mk);

// 封装Markdown加载方法：接收文件路径，渲染到容器
const loadMarkdown = (path) => {
  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`文件加载失败：${response.statusText}`);
      return response.text();
    })
    .then(markdownContent => {
      // 使用 markdown-it 解析Markdown为HTML
      const html = md.render(markdownContent);
      // 渲染到指定容器
      const container = document.getElementById('markdown-container');
      if (container) {
        container.innerHTML = html;
      } else {
        console.error('未找到id为 "markdown-container" 的容器');
      }
    })
    .catch(err => console.error('加载错误：', err));
};

// 菜单切换事件：当菜单被选中时触发
const handleMenuSelect = (index) => {
  activeIndex.value = index;
  // 找到当前选中菜单对应的md路径
  const currentMenu = menuList.value.find(item => item.index === index);
  if (currentMenu) {
    loadMarkdown(currentMenu.mdPath);
  }
};

// 组件挂载时加载默认菜单的Markdown
onMounted(() => {
  loadMarkdown(menuList.value[0].mdPath);
});
</script>

<template>
  <div class="page-body">
    <el-menu
      class="aside"
      :default-active="activeIndex"
      @select="handleMenuSelect"
    >
      <!-- 动态渲染菜单项 -->
      <el-menu-item 
        v-for="menu in menuList" 
        :key="menu.index" 
        :index="menu.index"
      >
        <div>{{ menu.name }}</div>
      </el-menu-item>
    </el-menu>
      <div id="markdown-container" class="markdown-body">

    </div>
  </div>
</template>

<style scoped>
    .aside {
        flex: 1;
        width: 10vw;
        height: 100%;
        overflow: auto; 
    }
    .page-body {
        flex: 1; 
        display: flex;
        height: calc(100vh - var(--header-height));
    }
    .markdown-body {
        flex: 9;
        height: 100%;
        overflow: auto; 
        padding: 20px;
        box-sizing: border-box
    }
</style>