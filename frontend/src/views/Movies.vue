<template>
    <div id="app">
        <Header title="Movies"/>
        <MoviesList />
    </div>
</template>

<script>
  import Header from '@/components/Header.vue';
  import MoviesList from '@/components/MoviesList.vue';
  import { mapActions } from 'vuex';

  export default {
    name: 'Movies',
    
    components: {
      Header,
      MoviesList
    },

    data() {
        return {
            depID: null
        }
    },

    watch: {
      $route() {
        
      }
    },

    mounted() {
        

    },

    methods: {
      ...mapActions([
        
      ])
    }
  }
</script>

<style scoped>

</style>