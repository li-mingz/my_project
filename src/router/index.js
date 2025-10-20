import { createRouter, createWebHistory } from 'vue-router'

// 路由规则
// 懒加载
const routes = [
  {
    path: '/', // 首页路由
    name: 'Home',
    component: () => import('@/components/HomePage.vue')
  },
  {
    path: '/docs:mdPath(.*)', // 文档页路由
    name: 'Docs',
    component: () => import('@/components/PageDocs.vue'),
    meta: { activeMenu: '/docs' } // 主页面菜单激活标识
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory('/my_project/'),
  routes
})

export default router