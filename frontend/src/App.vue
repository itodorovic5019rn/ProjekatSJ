<template>
  <div id="app">

    <div>
      <b-navbar type="dark" variant="dark">
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item v-if="token" to="/movies">Movies</b-nav-item>
          <b-nav-item v-if="token" to="/tvShows">TvShows</b-nav-item>
          <b-nav-item to="/moviePosts">Movie Posts</b-nav-item>
          <b-nav-item to="/tvShowsPosts">TvShows Posts</b-nav-item>
          <b-nav-item v-if="token" to="/myPosts">My Posts</b-nav-item>
          <b-nav-item v-if="!token" to="/register">Register</b-nav-item>
          <b-nav-item v-if="!token" to="/login">Log In</b-nav-item>
          <b-nav-item v-else @click="logout()">Log Out</b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </div>

    <router-view class="stranica"/>
  </div>
</template>

<script>

  import { mapActions, mapState, mapMutations } from 'vuex';

  export default {
    name: 'App',

    data() {
      return {
        items: []
      }
    },

    computed: {
      ...mapState([
        'token',
        'role'
      ])
    },

    mounted() {
      if (localStorage.token) {
        this.setToken(localStorage.token, localStorage.role);
      }
    },

    methods: {
      ...mapActions([
        
      ]),

      ...mapMutations([
        'removeToken',
        'removeUserId',
        'setToken'
      ]),

      logout(){
        this.removeToken();
        this.removeUserId();
        window.location.href = '/';
      },

      funk(){
        console.log(localStorage.role);
      }
    }
  }
</script>


<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding-bottom: 10px;
  }

  .stranica {
    width: 80%;
    margin-left: 10%;
  }
</style>
