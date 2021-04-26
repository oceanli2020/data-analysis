const routes = [
  {
    path: '',
    name: 'ExtractPrepare',
    component: () => import('../views/Extract/ExtractPrepare.vue')
  },
  {
    path: '/extractProcess',
    name: 'ExtractProcess',
    component: () => import('../views/Extract/ExtractProcess.vue')
  }
]

export default routes
