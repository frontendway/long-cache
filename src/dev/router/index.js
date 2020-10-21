import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Detail from '../views/Detail'
import Nav1 from '../views/Nav1'
import Nav2 from '../views/Nav2'
import Nav3 from '../views/Nav3'
import Login from '../views/Login'
import Search from '../views/Search'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/nav1',
    children: [
      {
        path: 'nav1',
        name: 'nav1',
        component: Nav1
      },
      {
        path: 'nav2',
        name: 'nav2',
        component: Nav2
      },
      {
        path: 'nav3',
        name: 'nav3',
        component: Nav3
      }
    ]
  },
  {
    path: '/detail',
    name: 'detail',
    component: Detail
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  window.localStorage.setItem('afterLink', from.name)
  next()
})

export default router
