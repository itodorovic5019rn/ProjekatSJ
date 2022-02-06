<template>
  <div class="home">
    <Header title="My Posts"/>

    <h4>Movie Posts</h4>

    <b-table
      id="myPostsM"
      hover
      fixed
      :items="myPostsM"
      :fields="fieldsM"
      @row-clicked="myFunc"
      small
    >
      <template #cell(isHighlight)="data">
        <b-icon v-if="data.value" icon="check-square" variant="success" scale="2"></b-icon>
        <b-icon v-else icon="x-circle" variant="danger" scale="2"></b-icon>
      </template>
    </b-table>

    <h4>Tv Shows Posts</h4>

    <b-table
      id="myPostsTv"
      hover
      fixed
      :items="myPostsTv"
      :fields="fieldsTv"
      @row-clicked="myFunc2"
      small
    >
      <template #cell(isHighlight)="data">
        <b-icon v-if="data.value" icon="check-square" variant="success" scale="2"></b-icon>
        <b-icon v-else icon="x-circle" variant="danger" scale="2"></b-icon>
      </template>
    </b-table>

  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { mapActions } from 'vuex';

export default {
  name: 'MyPosts',

  components: {
    Header
  },

  data(){
    return{
      fieldsM: ['user.username', 'ocena', 'komentar', 'preporuka', 'lajk', 'film.naziv'],
      fieldsTv: ['user.username', 'ocena', 'komentar', 'preporuka', 'lajk', 'serija.naziv'],
      movies: [],
      tvShows: [],
      myPostsM: [],
      myPostsTv: []
    }
  },

  computed:{
    
  },

  watch:{
    movies(nVal){
      this.myPostsM = [];

      for(let i of nVal){
        if(localStorage.userId == i.userId){
          if(i.preporuka == true){
            i.preporuka = "da";
          }else{
            i.preporuka = "ne";
          }
          this.myPostsM.push(i);
        }
      }
    },

    tvShows(nVal){
      this.myPostsTv = [];

      for(let i of nVal){
        if(localStorage.userId == i.userId){
          if(i.preporuka == true){
            i.preporuka = "da";
          }else{
            i.preporuka = "ne";
          }
          this.myPostsTv.push(i);
        }
      }
    }
  },

  mounted(){
      this.fetchMoviePosts().then(obj => this.movies = obj);
      this.fetchTvShowsPosts().then(obj => this.tvShows = obj);
  },

  methods:{
    ...mapActions([
      'fetchMoviePosts',
      'fetchTvShowsPosts'
    ]),

    myFunc(obj){ 
      this.$router.push({name:'Single', params:{id:obj.id}});
    },

    myFunc2(obj){ 
      this.$router.push({name:'Single2', params:{id:obj.id}});
    }

  },

}
</script>

<style scoped>
  .forma{
      width: 300px;
      margin-left: 465px;
      
  }

  .grp{
      padding: 10px;
      margin-top: 10px;
  }
</style>