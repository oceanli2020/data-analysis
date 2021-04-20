import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/show',
      name: 'Show',
      component: () => import('../views/Show.vue'),
      redirect: '/extractData',
      children: [
        {
          path: '/extractData',
          name: 'ExtractData',
          component: () => import('../views/Show/ExtractData.vue')
        },
        {
          path: '/analysisData',
          name: 'AnalysisData',
          component: () => import('../views/Show/AnalysisData.vue')
        },
        {
          path: '/showData',
          name: 'ShowData',
          component: () => import('../views/Show/ShowData.vue')
        },
        {
          path: '/extractProcess',
          name: 'ExtractProcess',
          component: () => import('../views/Show/components/ExtractProcess.vue')
        }
      ]
    }
  ]
})
