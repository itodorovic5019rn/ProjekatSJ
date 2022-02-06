import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Movies from '../views/Movies.vue'
import TvShows from '../views/TvShows.vue'
import MoviePosts from '../views/MoviePosts.vue'
import TvShowsPosts from '../views/TvShowsPosts.vue'
import MyPosts from '../views/MyPosts.vue'
import Single from '../views/Single.vue'
import Single2 from '../views/Single2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies
  },
  {
    path: '/tvShows',
    name: 'TvShows',
    component: TvShows
  },
  {
    path: '/moviePosts',
    name: 'MoviePosts',
    component: MoviePosts
  },
  {
    path: '/tvShowsPosts',
    name: 'TvShowsPosts',
    component: TvShowsPosts
  },
  {
    path: '/myPosts',
    name: 'MyPosts',
    component: MyPosts
  },
  {
    path: '/single/:id',
    name: 'Single',
    component: Single
  },
  {
    path: '/single2/:id',
    name: 'Single2',
    component: Single2
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;
