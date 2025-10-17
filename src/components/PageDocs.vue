<script setup>
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid'
// 导入复制插件
import Clipboard from 'clipboard'
// 引入 markdown-it 和 highlight.js
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
// 引入 highlight.js 样式
import 'highlight.js/styles/default.min.css';
// 引入 github-markdown 样式
import 'github-markdown-css/github-markdown.css';
// 引入 KaTeX 样式（必须，否则公式无法正常显示）
import 'katex/dist/katex.min.css';
// 导入GFM警告样式
import '@mdit/plugin-alert/style';
// 导入 隐藏内容样式
import '@mdit/plugin-spoiler/style';
// 导入自定义容器样式
import '@/assets/mk-container.css'
// 导入自定义代码块样式
import '@/assets/mk-codebox.css'
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
import mkContainer from 'markdown-it-container'; // 自定义容器
import { alert } from "@mdit/plugin-alert";  // GFM 警告插件
import { spoiler } from "@mdit/plugin-spoiler"; // 隐藏内容 (!!要隐藏的内容!!)


const copy_btn_checkmark = ref(null); // 对勾路径DOM引用
const copy_btn_pathLength = ref(0); // 路径总长度

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
.use(mk)
.use(spoiler);
// 配置 alert 插件
md.use(alert, {
  // 自定义标题渲染函数
  titleRender: (tokens, idx) => {
    // 获取当前警告的名称（如 'warning'、'note' 等）
    const alertName = tokens[idx].content
    // 定义名称映射关系（原始名称 -> 自定义名称）
    const nameMap = {
      note: "注",
      tip: "提示",
      important: "重要",
      warning: "注意",
      caution: "警告",
    };
    
    // 若未匹配到映射，则使用原始名称
    const displayName = nameMap[alertName] || alertName;
    
    // 返回渲染后的标题 HTML（可根据需要调整样式类名）
    return `<div class="alert-title">${displayName}</div>`;
  },
});

// 自定义代码块渲染规则
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]  // 获取代码块
  const lang = token.info.trim() || 'text' // 获取语言类型
  const codeId = `code-${uuidv4()}` // 生成唯一ID
  const rawCode = token.content // 原始代码文本
  // 调用 highlight 处理代码，得到高亮后的 HTML
  const highlightedCode = hljs.highlight(rawCode, { language: lang }).value
  // 自定义代码块HTML结构
  return `
    <div class="code-box">
      <div class="code-header">
        <span class="code-lang">${lang}</span>
        <svg class="copy-btn" data-clipboard-target="#${codeId}" xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 128 128">
          <path d="M76,0c2.21,0,4,1.79,4,4s1.79,4,4,4,4,1.79,4,4v4c0,2.21-1.79,4-4,4h-40c-2.21,0-4-1.79-4-4v-4c0-2.21,1.79-4,4-4s4-1.79,4-4,1.79-4,4-4h24Z"/>
          <path d="M24,20c0-2.21,1.79-4,4-4h4c2.21,0,4-1.79,4-4s-1.79-4-4-4h-4c-6.63,0-12,5.37-12,12v96c0,6.63,5.37,12,12,12h72c6.63,0,12-5.37,12-12h0V20c0-6.63-5.37-12-12-12h-4c-2.21,0-4,1.79-4,4s1.79,4,4,4h4c2.21,0,4,1.79,4,4v96c0,2.21-1.79,4-4,4H28c-2.21,0-4-1.79-4-4V20Z"/>
          <path
          class="checkmark" 
          ref="copy_btn_checkmark"
          fill="none"
          stroke="#000"
          stroke-width="9"
          d="M47.98,71.98s9.19,9.19,9.19,9.19q2.83,2.83,5.66,0l21.08-21.08"/>
        </svg>
      </div>
      <pre id="${codeId}"><code class="language-${lang}">${highlightedCode}</code></pre>
    </div>
  `
}


/**
 * 注册自定义容器
 * @param {string} type - 容器类型（如 note/warning）
 * @param {string} [marker=':'] - 标记字符（默认 :::）
 */
function registerContainer(type, marker = ':') {
  md.use(mkContainer, type, {
    marker,
    // 验证容器语法：支持 "::: type" 或 "::: type 标题"
    validate: (params) => {
      const trimmed = params.trim();
      // 允许无标题（::: note）或带标题（::: note 标题内容）
      return trimmed === type || trimmed.startsWith(`${type} `);
    },
    // 渲染 HTML
    render: (tokens, idx) => {
      const token = tokens[idx];
      const trimmedInfo = token.info.trim();
      // 提取标题（如果有）："::: note 标题" → "标题"
      const title = trimmedInfo.replace(`${type} `, '');

      if (token.nesting === 1) {
        // 开始标签：带标题则渲染 <h4>，否则只渲染容器
        const titleHtml = title ? `<h4 class="hint-title">${md.utils.escapeHtml(title)}</h4>` : '';
        return `<div class="hint hint-${type}">\n${titleHtml}`;
      } else {
        // 结束标签
        return `</div>\n`;
      }
    }
  });
}

// 注册支持的容器类型（可按需扩展）
const containerTypes = ['note', 'warning', 'tip', 'danger', 'info'];
containerTypes.forEach(type => registerContainer(type));


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

        // 初始化所有对勾路径
        container.querySelectorAll('.copy-btn .checkmark').forEach(c => {
          const len = c.getTotalLength();
          c.style.strokeDasharray = c.style.strokeDashoffset = len;
        });

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
  // 计算路径长度
  if (copy_btn_checkmark.value) {
    copy_btn_pathLength.value = copy_btn_checkmark.value.getTotalLength();
    console.log(copy_btn_pathLength)
  }
  // 绑定复制按钮
  var clipboard = new Clipboard('.copy-btn');
  // 复制成功回调
  clipboard.on('success', e => {
    const copyBtn = e.trigger; // 当前点击的复制按钮
    // 复制成功动画
    const c = copyBtn.querySelector('.copy-btn .checkmark');
    c.style.opacity = 1;
    c.style.strokeDashoffset = 0;
    // 清除当前按钮已有的定时器（避免叠加）
    if (copyBtn.dataset.timeoutId) {
      clearTimeout(copyBtn.dataset.timeoutId);
    }
    // 存储新定时器到当前按钮的自定义属性
    const timeoutId = setTimeout(() => {
      c.style.opacity = 0;
      c.style.strokeDashoffset = c.getTotalLength();
      // 清除定时器标识
      copyBtn.dataset.timeoutId = '';
    }, 2000);
    // 将定时器ID存入按钮的dataset，用于后续清除
    copyBtn.dataset.timeoutId = timeoutId;
    // 取消选择
    e.clearSelection();
  });
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
        box-sizing: border-box;
    }
    .markdown-body {
        flex: 9;
        height: 100%;
        overflow: auto; 
        padding: 20px;
        box-sizing: border-box;
    }
    ::v-deep .katex .katex-mathml {
      position: fixed
    }
</style>