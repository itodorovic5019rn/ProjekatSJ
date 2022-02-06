<template>
  <div>
    <b-table
      id="tvShowsPosts-table"
      hover
      fixed
      :items="posts"
      :fields="fields"
      small
      :per-page="perPage"
      :current-page="currentPage"
      @row-clicked="rowClicked"
    >
      <template #cell(isHighlight)="data">
        <b-icon v-if="data.value" icon="check-square" variant="success" scale="2"></b-icon>
        <b-icon v-else icon="x-circle" variant="danger" scale="2"></b-icon>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="posts.length"
      :per-page="perPage"
      aria-controls="tvShowsPosts-table"
    ></b-pagination>
  </div>
</template>

<script>

  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'TvShowsPostsList',

    data() {
      return {
        fields: ['userId', 'ocena', 'komentar', 'preporuka', 'lajk', 'serija.naziv'],
        items: [],
        posts: [],
        currentPage: 1,
        perPage: 20
      }
    },

    computed: {
      ...mapState([
        'tvShowsPosts'
      ])
    },

    watch: {
      items(nVal){
        this.posts = [];

        for(let i of nVal){
          if(i.preporuka == true){
            i.preporuka = "da";
          }else{
            i.preporuka = "ne";
          }
          this.posts.push(i);
        }
      }
    },

    mounted() {
      this.fetchTvShowsPosts().then( obj => this.items = obj );       
    },

    methods: {
      ...mapActions([
        'fetchTvShowsPosts'
      ]),

      rowClicked(record) {
        this.$router.push({ name: 'Single', params: { id: record.objectID } });
      }
    }
  }

</script>

<style scoped>
  .pagination {
    justify-content: center;
  }
</style>