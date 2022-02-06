import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [],
    departments: [],
    imageIDs: [],
    token: '',
    userId: '',
    movies: [],
    moviePosts: [],
    tvShows: [],
    tvShowsPosts: []
  },

  mutations: {
    setUserId(state, id){
      state.userId = id;
      localStorage.userId = id;
    },

    addItem(state, item) {
      state.items.push(item);
    },

    addMovie(state, movie){
      state.movies.push(movie);
    },

    addMoviePosts(state, post){
      state.moviePosts.push(post);
    },

    addTvShow(state, tvShow){
      state.tvShows.push(tvShow);
    },

    addTvShowPost(state, tvShowPost){
      state.tvShowsPosts.push(tvShowPost);
    },

    addDepartments(state, deps) {
      state.departments = deps;
    },

    setImageIDs(state, ids) {
      state.imageIDs = ids;
    },

    addIDsToDepartment(state, obj) {
      const department = state.departments.filter( dep => dep.departmentId == obj.id )[0];
      department['imageIDs'] = obj.imageIDs;
    },

    setToken(state, token) {
      state.token = token;
      localStorage.token = token;
    },

    removeToken(state) {
      state.token = '';
      localStorage.token = '';
    },

    removeUserId(state) {
      state.userId = '';
      localStorage.userId = '';
    },

    addComment(state, obj) {
      const image = state.items.filter( item => item.objectID == obj.artId )[0];
      if (image) {
        image.comments.push(obj.comment);
      }
    }
  },

  actions: {
    fetchUsers({commit}){
      return new Promise( (resolve) => {
        fetch('http://localhost:10000/api/users',{
          headers: {
            'Authorization': `Bearer ${localStorage.token}`
          }
        })
          .then( obj => obj.json() )
          .then( data => {
            this.state.items = []; // ne zelim da imam duple item-e
            data.forEach( el => {
                commit('addItem', el);
            });
            resolve(data);
        });
      });
    },

    fetchMovies({commit}){
      return new Promise( (resolve) => {
        fetch('http://localhost:10000/api/films',{
          headers: {
            'Authorization': `Bearer ${localStorage.token}`
          }
        })
          .then( obj => obj.json() )
          .then( data => {
            this.state.movies = [];
            data.forEach( el => {
                commit('addMovie', el);
            });
            resolve(data);
        });
      });
    },

    fetchTvShows({commit}){
      return new Promise( (resolve) => {
        fetch('http://localhost:10000/api/tvShows',{
          headers: {
            'Authorization': `Bearer ${localStorage.token}`
          }
        })
          .then( obj => obj.json() )
          .then( data => {
            this.state.tvShows = []; 
            data.forEach( el => {
                commit('addTvShow', el);
            });
            resolve(data);
        });
      });
    },

    fetchMoviePosts({commit}){
      return new Promise( (resolve) => {
        fetch('http://localhost:10000/api/moviesPosts',{
          
        })
          .then( obj => obj.json() )
          .then( data => {
            this.state.moviePosts = []; 
            data.forEach( el => {
                commit('addMoviePosts', el);
            });
            resolve(data);
        });
      });
    },

    fetchTvShowsPosts({commit}){
      return new Promise( (resolve) => {
        fetch('http://localhost:10000/api/tvShowsPosts',{
          headers: {
            
          }
        })
          .then( obj => obj.json() )
          .then( data => {
            this.state.tvShowsPosts = []; 
            data.forEach( el => {
                commit('addTvShowPost', el);
            });
            resolve(data);
        });
      });
    },

    addMoviePost({ commit }, obj){
      fetch('http://localhost:10000/api/moviesPosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.token}` },
        body: JSON.stringify(obj)
      }).then( res =>{ 
        res.json() 
        commit;
      });
    },

    addTvShowPost({ commit }, obj){
      fetch('http://localhost:10000/api/tvShowsPosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.token}` },
        body: JSON.stringify(obj)
      }).then( res =>{ 
        res.json() 
        commit;
      });
    },

    fetchMoviePost({commit, state}, id){
      return new Promise( (resolve) => {
        const post = state.moviePosts.filter( post => post.id == id)[0];

        if(post){
          resolve(post);
        }else{
          fetch(`http://localhost:10000/api/moviesPosts/${id}`, {
            headers: {'Authorization': `Bearer ${localStorage.token}`}
          })
          .then(obj => obj.json())
          .then(res => {
            commit('addMoviePosts', res);
            resolve(res);
          });
        }
      });
    },

    updateMoviePost({ commit }, obj){
      fetch('http://localhost:10000/api/moviesPosts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.token}` },
        body: JSON.stringify(obj)
      }).then( res =>{ 
        res.json() 
        commit;
      });
    },

    deleteMoviePost({ commit }, id){
      const data = {id:id};
      fetch('http://localhost:10000/api/moviesPosts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.token}` },
        body: JSON.stringify(data)
      }).then( res =>{ 
        res.json() 
        commit;
      });
    },

    fetchTvShowPost({commit, state}, id){
      return new Promise( (resolve) => {
        const post = state.tvShowsPosts.filter( post => post.id == id)[0];

        if(post){
          resolve(post);
        }else{
          fetch(`http://localhost:10000/api/tvShowsPosts/${id}`, {
            headers: {'Authorization': `Bearer ${localStorage.token}`}
          })
          .then(obj => obj.json())
          .then(res => {
            commit('addTvShowPost', res);
            resolve(res);
          });
        }
      });
    },

    updateTvShowPost({ commit }, obj){
      fetch('http://localhost:10000/api/tvShowsPosts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.token}` },
        body: JSON.stringify(obj)
      }).then( res =>{ 
        res.json() 
        commit;
      });
    },

    deleteTvShowPost({ commit }, id){
      const data = {id:id};
      fetch('http://localhost:10000/api/tvShowsPosts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.token}` },
        body: JSON.stringify(data)
      }).then( res =>{ 
        res.json() 
        commit;
      });
    },

    register({ commit }, obj) {
      fetch('http://localhost:9000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      }).then( res => res.json() )
        .then( tkn => {
          commit('setToken', tkn.token);
          commit('setUserId', tkn.userId);
        });
    },

    login({ commit }, obj) {
      fetch('http://localhost:9000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    }).then( res => res.json() )
      .then( tkn => {
        if (tkn.msg) {
          alert(tkn.msg);
        } else {
          commit('setToken', tkn.token);
          commit('setUserId', tkn.userId);
          window.location.href = `/`;
        }
      });
    },

    socket_comment({ commit }, msg) {
      const comment = JSON.parse(msg);
      commit('addComment', { artId: comment.artId, comment: comment });
    }
  }
})

