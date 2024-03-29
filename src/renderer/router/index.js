import Vue from 'vue'
import Router from 'vue-router'

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
  if (key === './index.js') return
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/dashBoard',
      name: 'DashBoard',
      component: () => import('../views/DashBoard.vue'),
      redirect: '/extractData',
      children: [
        {
          path: '/extractData',
          name: 'ExtractData',
          component: () => import('../views/ExtractData.vue'),
          children: modules['extract']
        },
        {
          path: '/analysisData',
          name: 'AnalysisData',
          component: () => import('../views/AnalysisData.vue')
        },
        {
          path: '/showData',
          name: 'ShowData',
          component: () => import('../views/ShowData.vue'),
          children: modules['show']
        }
      ]
    }
  ]
})
