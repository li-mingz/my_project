<script setup>
import markdownit from 'markdown-it';
import 'github-markdown-css/github-markdown.css';
import '@mdit/plugin-spoiler/style';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  path: {
    type: String,
    required: true
  }
});

// 状态管理
const markdownContent = ref('');
const menuItems = ref([]);
const tempMenuData = ref([]);
const isParsingMenu = ref(false);

// 初始化 markdown-it（保留基础配置）
const md = markdownit({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
});

// 列表开始：不重置tempMenuData（避免子列表清空父数据）
md.renderer.rules.bullet_list_open = function () {
  isParsingMenu.value = true;
  return '';
};

// 列表项处理：提取文本和链接
md.renderer.rules.list_item_open = function (tokens, idx) {
  if (!isParsingMenu.value) return '';

  const token = tokens[idx];
  const level = token.level;
  let text = '';
  let href = '';

  // 找到inline Token
  let inlineToken = null;
  for (let i = idx + 1; i < tokens.length; i++) {
    if (tokens[i].type === 'inline') {
      inlineToken = tokens[i];
      break;
    }
    if (tokens[i].type === 'list_item_close') {
      break;
    }
  }

  // 提取内容
  if (inlineToken) {
    inlineToken.children?.forEach(child => {
      if (child.type === 'text') text += child.content;
      if (child.type === 'link_open') href = child.attrGet('href') || '';
    });
  }

  tempMenuData.value.push({
    level,
    text: text.trim(),
    href: href.trim(),
    index: `${level}-${Date.now()}-${idx}`
  });

  return '';
};

// 列表结束：构建层级菜单
md.renderer.rules.bullet_list_close = function () {
  if (!isParsingMenu.value) return '';

  const levelMap = new Map();
  const rootMenu = [];
  
  tempMenuData.value.forEach(item => {
    // 计算路由路径
    const routePath = item.href 
      ? item.href.replace('./', '/').replace('.md', '') 
      : `#${item.index}`;
    
    const currentItem = { 
      ...item, 
      children: [],
      routePath: routePath
    };
    
    // 找到最近的有效父级
    let parentLevel = item.level - 1;
    while (parentLevel > 0 && !levelMap.has(parentLevel)) {
      parentLevel--;
    }

    if (parentLevel === 0) {
      rootMenu.push(currentItem);
    } else {
      const parentItem = levelMap.get(parentLevel);
      if (parentItem) parentItem.children.push(currentItem);
    }

    levelMap.set(item.level, currentItem);
  });

  menuItems.value = rootMenu;
  isParsingMenu.value = false;
  console.log('最终菜单数据:', menuItems.value);
  return '';
};

// 屏蔽不需要的渲染
md.renderer.rules.paragraph_open = md.renderer.rules.paragraph_close = () => '';
md.renderer.rules.heading_open = md.renderer.rules.heading_close = () => '';

// 加载Markdown
const loadMarkdown = (path) => {
  path = import.meta.env.BASE_URL + path;
  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`文件加载失败：${response.statusText}`);
      return response.text();
    })
    .then(content => {
      markdownContent.value = content;
      md.render(content);
    })
    .catch(err => console.error('加载错误：', err));
};

// 菜单选择处理
const handleMenuSelect = (index) => {
  router.push(index);
};

// 挂载时加载
onMounted(() => {
  loadMarkdown(props.path || "./SUMMARY.md");
});
</script>

<template>
  <el-menu
    default-active="$route.path"
    class="el-menu-vertical-demo"
    router  
    background-color="#fafafa"
    text-color="#333"
    active-text-color="#409eff"
    @select="handleMenuSelect"
  >
    <!-- 递归渲染菜单：直接用组件自引用，无需额外定义MenuNode -->
    <template v-for="item in menuItems" :key="item.index">
      <!-- 有子菜单：el-submenu -->
      <el-sub-menu v-if="item.children.length" :index="item.routePath">
        <template #title>{{ item.text }}</template>
        <!-- 递归：直接循环item.children，复用当前模板结构 -->
        <template v-for="child in item.children" :key="child.index">
          <el-sub-menu v-if="child.children.length" :index="child.routePath">
            <template #title>{{ child.text }}</template>
            <!-- 第三级及以上：继续递归 -->
            <el-menu-item 
              v-for="grandchild in child.children" 
              :key="grandchild.index" 
              :index="grandchild.routePath"
            >
              {{ grandchild.text }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="child.routePath">
            {{ child.text }}
          </el-menu-item>
        </template>
      </el-sub-menu>

      <!-- 无子菜单：el-menu-item -->
      <el-menu-item v-else :index="item.routePath">
        {{ item.text }}
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped>
.el-menu-vertical-demo {
  border-right: none;
  height: 100%;
  overflow-y: auto;
}

/* 调整多级菜单缩进 */
::v-deep .el-submenu__title {
  padding-left: 20px !important;
}
::v-deep .el-submenu .el-menu-item {
  padding-left: 40px !important;
}
::v-deep .el-submenu .el-submenu .el-menu-item {
  padding-left: 60px !important;
}
</style>