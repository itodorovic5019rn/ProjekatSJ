<template>
  <div>
    <b-pagination
      v-model="currentPage"
      :total-rows="moviesArr.length"
      :per-page="perPage"
      aria-controls="movies-table"
    ></b-pagination>
    <b-table
      id="movies-table"
      hover
      fixed
      :items="moviesArr"
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
      :total-rows="moviesArr.length"
      :per-page="perPage"
      aria-controls="movies-table"
    ></b-pagination>
  </div>
</template>

<script>

  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'MoviesList',

    data() {
      return {
        fields: ['naziv', 'prosecnaOcena', 'reziser', 'trajanje', 'godina'],
        items: [],
        moviesArr: [],
        currentPage: 1,
        perPage: 20
      }
    },

    computed: {
      ...mapState([
        'movies'
      ])
    },

    watch: {
      items(nVal){
        this.moviesArr = [];

        for(let i of nVal){
          this.moviesArr.push(i);
        }
      }
    },

    mounted() {
      this.fetchMovies().then( obj => this.items = obj );     
    },

    methods: {
      ...mapActions([
        'fetchMovies'
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