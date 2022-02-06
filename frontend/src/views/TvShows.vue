<template>
    <div id="app">
        <Header title="Tv Shows"/>
        <TvShowsList />
    </div>
</template>

<script>
  import Header from '@/components/Header.vue';
  import TvShowsList from '@/components/TvShowsList.vue';
  import { mapActions } from 'vuex';

  export default {
    name: 'TvShows',
    
    components: {
      Header,
      TvShowsList
    },

    data() {
        return{
          
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