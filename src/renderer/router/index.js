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
      redirect: '/card',
      children: [
        {
          path: '/card',
          name: 'Card',
          component: () => import('../views/Show/Card.vue')
        }
      ]
    }
  ]
})
