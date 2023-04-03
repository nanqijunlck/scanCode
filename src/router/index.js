import { createRouter, createWebHistory } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router Modules */
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/plan-sheet/index',
    children: [
    
    ]
  },
  {
    path: '/user-manger',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/user'),
        name: 'userManger',
        meta: {
          title: '用户管理',
          icon: 'icon',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/plan-sheet',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/planSheet/index.vue'),
        name: 'planSheet',
        meta: {
          title: '计划单管理',
          icon: 'icon',
          roles: ['admin']
        }
      }
    ]
  },
    {
    path: '/qr-code',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/qrCode/index.vue'),
        name: 'qrCode',
        meta: {
          title: '二维码管理',
          icon: 'icon',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/quality-testing-record',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/qualityTestingRecord/index.vue'),
        name: 'qualityTestingRecord',
        meta: {
          title: '质检记录管理',
          icon: 'icon',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/quality-testing-question',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/qualityTestingRecord/question.vue'),
        name: 'qualityTestingQuestion',
        meta: {
          title: '质检故障管理',
          icon: 'icon',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    meta:{
      title:'数据统计'
    },
    children: [
      {
        path: 'pass-rate',
        component: () => import('@/views/statistics/passRate.vue'),
        name: 'passRate',
        meta: {
          title: '合格率',
          icon: 'icon',
          roles: ['admin']
        }
      },
      {
        path: 'hitch',
        component: () => import('@/views/statistics/hitch.vue'),
        name: 'hitch',
        meta: {
          title: '故障率',
          icon: 'icon',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '/:pathchMatch(.*)', redirect: '/404' }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 重置路由为静态路由
export const resetRouter = () => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && asyncRoutes.find((item) => item.name === name)) {
      router.removeRoute(name)
    }
  })
}


export default router
