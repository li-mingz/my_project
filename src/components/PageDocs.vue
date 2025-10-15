<script setup>
import { ref, onMounted, inject } from 'vue';
import { marked } from 'marked';

// 动态菜单配置
const menuList = ref([
  { index: '1', name: '简介', mdPath: 'src/markdown/test.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '3', name: '注意事项', mdPath: '/markdown/notice.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' },
  { index: '2', name: '内容', mdPath: '/markdown/content.md' }
]);

// 当前激活的菜单索引
const activeIndex = ref(menuList.value[0].index);

const headerElement = inject('headerElement');
// 封装Markdown加载方法：接收文件路径，渲染到容器
const loadMarkdown = (path) => {
  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error('文件加载失败');
      return response.text();
    })
    .then(markdown => {
      const html = marked.parse(markdown); // 转换为HTML
      document.getElementById('markdown-container').innerHTML = html;
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
    <div class="markdown-content-container">
        <div id="markdown-container" class="markdown-content">
    </div>

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
    .markdown-content {
        flex: 1;
        padding: 20px;
        height: 100%;
        overflow: auto; 
        box-sizing: border-box;
    }
    .markdown-content-container {
        flex: 9;
        display: flex;
        height: 100%;
        overflow: auto; 
    }
</style>