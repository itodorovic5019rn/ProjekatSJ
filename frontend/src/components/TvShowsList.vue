<template>
  <div>
    <b-pagination
      v-model="currentPage"
      :total-rows="shows.length"
      :per-page="perPage"
      aria-controls="tvShows-table"
    ></b-pagination>
    <b-table
      id="tvShows-table"
      hover
      fixed
      :items="shows"
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
      :total-rows="shows.length"
      :per-page="perPage"
      aria-controls="tvShows-table"
    ></b-pagination>
  </div>
</template>

<script>

  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'TvShowsList',

    data() {
      return {
        fields: ['naziv', 'prosecnaOcena', 'reziser', 'sezone', 'godina'],
        items: [],
        shows: [],
        currentPage: 1,
        perPage: 20
      }
    },

    computed: {
      ...mapState([
        'tvShows'
      ])
    },

    watch: {
      items(nVal){
        this.shows = [];

        for(let i of nVal){
          this.shows.push(i);
        }
      }
    },

    mounted() {
      this.fetchTvShows().then( obj => this.items = obj );       
    },

    methods: {
      ...mapActions([
        'fetchTvShows'
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