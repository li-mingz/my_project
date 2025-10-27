<script setup>
import markdownit from 'markdown-it';
import 'github-markdown-css/github-markdown.css';
import '@mdit/plugin-spoiler/style';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid'

const router = useRouter();
const route = useRoute()

// 当前激活的菜单路径
const activePath = ref("");
// 最终生成的层级菜单数据
const menuItems = ref([]);
// 解析Markdown时的临时列表数据
const tempMenuData = ref([]);
// 跟踪列表嵌套层级，用来决定是否处理临时列表数据
let listLevel = 0;

// 初始化markdown-it
const md = markdownit({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
});

// 提取菜单数据
// 列表项开始, 提取单个列表项的层级、文本、链接
md.renderer.rules.list_item_open = function (tokens, idx) {

  const token = tokens[idx];       // 当前列表项Token（包含层级信息）
  const level = token.level;       // 列表项层级（由缩进决定：1=一级，2=二级，...）
  let text = '';                   // 列表项文本（如“简介”）
  let href = '';                   // 列表项链接（如“./about.md”）

  // 使用循环定位inline Token位置
  let inlineToken = null;
  for (let i = idx + 1; i < tokens.length; i++) {
    // 找到inline Token（存储列表项的实际内容）
    if (tokens[i].type === 'inline') {
      inlineToken = tokens[i];
      break;
    }
    // 遇到列表项结束，停止遍历，避免越界
    if (tokens[i].type === 'list_item_close') {
      break;
    }
  }

  // 从inline Token中提取文本和链接
  if (inlineToken) {
    // 遍历inline Token的子节点：text=文本，link_open=链接
    inlineToken.children?.forEach(child => {
      if (child.type === 'text') { // 文本节点：提取菜单文本
        text += child.content;
      }
      if (child.type === 'link_open') { // 链接节点：提取href属性
        href = child.attrGet('href') || ''; // 无链接时设为空字符串
      }
    });
  }

  // 将提取的列表项存入临时数据
  tempMenuData.value.push({
    level: level,
    text: text.trim(),       // 去除文本前后空格（避免Markdown中的缩进/换行干扰）
    href: href.trim(),       // 去除链接前后空格（避免格式错误）
    index: `${uuidv4()}` // 唯一标识
  });
  return ''; // 不使用解析后的html，返回什么无所谓
};

// 列表开始时，层级+1
md.renderer.rules.bullet_list_open = function () {
  listLevel++;
  return ''; // 不使用解析后的html，返回什么无所谓
};

// 列表结束, 将临时列表数据转为层级菜单结构
// 列表结束时，仅最外层关闭才处理数据
md.renderer.rules.bullet_list_close = function () {
  
  listLevel--; // 层级-1
  // 仅当最外层列表关闭（层级归0）时，才构建菜单
  if (listLevel === 0) {

    // 用Map存储各层级的最新菜单项，快速匹配父级
    const levelMap = new Map(); // key=层级（如1），value=该层级的菜单项（含children）
    const rootMenu = [];        // 根菜单（一级菜单，最终赋值给menuItems）

    // 遍历临时列表数据，构建层级结构
    tempMenuData.value.forEach((item, listIndex) => {
      // 路由路径
      const routePath = item.href 

      // 构建当前菜单项：包含层级、文本、链接、路由路径、子菜单容器
      const currentItem = { 
        ...item,                // 继承原始属性（level, text, href, index）
        children: [],           // 子菜单容器（初始为空）
        routePath: convertPath(routePath) // 路由路径（用于Element UI菜单跳转）
      };

      // 关键：找到当前菜单项的父级（兼容层级跳跃，如1→3时找最近的父级）
      let parentLevel = item.level - 1; // 理论父级层级（如level=2的父级是1）
      // 循环降级找父级：如果理论父级不存在，逐级向下找（避免层级丢失）
      while (parentLevel > 0 && !levelMap.has(parentLevel)) {
        parentLevel--;
      }

      // 父级处理：根菜单（parentLevel=0）或子菜单（parentLevel>0）
      if (parentLevel === 0) {
        // 一级菜单：直接加入根菜单
        rootMenu.push(currentItem);
      } else {
        // 子菜单：加入父级的children数组
        const parentItem = levelMap.get(parentLevel);
        if (parentItem) { // 确保父级存在（避免异常）
          parentItem.children.push(currentItem);
        }
      }

      // 更新层级Map：将当前菜单项存入对应层级，供子菜单查找父级
      levelMap.set(item.level, currentItem);
    });

    // 最终菜单数据赋值（响应式更新，模板自动渲染）
    menuItems.value = rootMenu;
  }

  return ''; // 不使用解析后的html，返回什么无所谓
};


const loadMarkdown = (path) => {
  // 拼接完整路径：BASE_URL（项目根路径）+ 传入路径（如./SUMMARY.md）
  
  const fullPath = import.meta.env.BASE_URL + path;
  console.log('加载Markdown文件路径：', fullPath);

  // 发送请求获取Markdown文件（纯文本）
  fetch(fullPath)
    .then(response => {
      // 处理请求错误（如404文件不存在）
      if (!response.ok) {
        throw new Error(`文件加载失败：${response.statusText}，路径：${fullPath}`);
      }
      return response.text();
    })
    .then(content => {
      // 解析Markdown, 生成菜单数据
      md.render(content)
    })
    .catch(err => {
      // 捕获加载错误（如网络问题、路径错误）
      console.error('Markdown加载错误：', err);
    });
};

// 转换md文件路径为跳转路径
const convertPath = (path) => {
  path = path.replace(/^(\.\/|\/)/, ''); // 匹配开头的./或/并移除
  // 去除扩展名
  const lastDotIndex = path.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    path = path.slice(0, lastDotIndex);
  }
  // 以 当前激活菜单路径/ 开头
  path = `${route.meta.activeMenu}/${path}`;
  return path;
}
// 递归查找第一个可点击的菜单项路径（优先叶子节点）
const getFirstValidPath = (items) => {
  if (!items || items.length === 0) return null;
  const firstItem = items[0];
  // 若有子菜单，递归查找子菜单的第一个有效项
  if (firstItem.children && firstItem.children.length > 0) {
    return getFirstValidPath(firstItem.children);
  } else {
    // 无子菜单，直接返回当前项的路由路径
    return firstItem.routePath;
  }
};
// 跳转路径到菜单第一项
const jumpToFirstValidPath = () => {
  if (menuItems.value.length > 0) {
    const firstPath = getFirstValidPath(menuItems.value);
    // 避免重复跳转
    if (firstPath && firstPath !== router.currentRoute.value.path) {
      // 跳转路径到菜单第一项
      router.push(firstPath);
    }
  }
}

onMounted(() => {
  loadMarkdown("./SUMMARY.md");
});

// 监听路径变化
watch(
  () => router.currentRoute.value.path,
  (path) => {
    // 在主页面下时
    if(path == route.meta.activeMenu){
      console.log(activePath);
      jumpToFirstValidPath();
    }
    else
    {
      // 更改高亮选项
      activePath.value = path;
    }
  },
  { immediate: true } // 初始加载时立即执行一次
)
// 监听菜单数据变化
watch(
  () => menuItems.value,
  () => {
    var path = router.currentRoute.value.path;
    // 在主页面下时
    if(path == route.meta.activeMenu){
      jumpToFirstValidPath();
    }else{
      // 更改高亮选项
      activePath.value = path;
    }
  },
  { deep: true, immediate: true } // 深度监听，初始加载时执行
);

</script>

<template>
  <el-menu
    :default-active="activePath"
    class="el-menu-vertical-demo"
    router  
    background-color="#fafafa"
    text-color="#333"
    active-text-color="#409eff"
  >
    <!-- 
      一级菜单循环：遍历menuItems（根菜单）
      核心逻辑：根据是否有children，显示el-submenu（有子菜单）或el-menu-item（无子菜单）
      :key：用唯一index，避免Vue列表渲染警告
    -->
    <template v-for="item in menuItems" :key="item.index">
      <!-- 有子菜单：显示折叠菜单（el-submenu） -->
      <el-sub-menu v-if="item.children.length" :index="item.index">
        <!-- 菜单标题：显示一级菜单文本 -->
        <template #title>{{ item.text }}</template>
        
        <!-- 
          二级菜单循环：遍历一级菜单的children
          逻辑与一级菜单一致：判断是否有children，显示对应组件
        -->
        <template v-for="child in item.children" :key="child.index">
          <!-- 二级菜单有子菜单（三级菜单）：继续用el-submenu -->
          <el-sub-menu v-if="child.children.length" :index="child.routePath">
            <template #title>{{ child.text }}</template>
            
            <!-- 
              三级及以上菜单循环：遍历二级菜单的children
              如需支持更多层级，继续嵌套相同逻辑即可（模板递归）
            -->
            <el-menu-item 
              v-for="grandchild in child.children" 
              :key="grandchild.index" 
              :index="grandchild.routePath"
            >
              {{ grandchild.text }}
            </el-menu-item>
          </el-sub-menu>

          <!-- 二级菜单无子菜单：直接显示菜单项 -->
          <el-menu-item v-else :index="child.routePath">
            {{ child.text }}
          </el-menu-item>
        </template>
      </el-sub-menu>

      <!-- 无子菜单：直接显示菜单项（el-menu-item） -->
      <el-menu-item v-else :index="item.routePath">
        {{ item.text }}
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped>
/* 菜单容器样式：适应侧边栏高度，超出滚动 */
.el-menu-vertical-demo {
  border-right: none; /* 移除右侧边框，适配侧边栏风格 */
  height: 100%;       /* 占满父容器高度 */
  overflow-y: auto;   /* 垂直方向超出时滚动（避免菜单过长） */
}

</style>