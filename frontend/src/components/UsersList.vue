<template>
  <div>
    <b-pagination
      v-model="currentPage"
      :total-rows="users.length"
      :per-page="perPage"
      aria-controls="users-table"
    ></b-pagination>
    <b-table
      id="users-table"
      hover
      fixed
      :items="users"
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
      :total-rows="users.length"
      :per-page="perPage"
      aria-controls="users-table"
    ></b-pagination>
  </div>
</template>

<script>

  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'UsersList',

    data() {
      return {
        fields: ['username', 'firstname', 'lastname', 'email', { key: 'role', tdClass: 'align-middle' }],
        items: [],
        users: [],
        currentPage: 1,
        perPage: 20
      }
    },

    computed: {
      ...mapState([
        'items'
      ])
    },

    watch: {
      items(nVal){
        this.users = [];

        for(let i of nVal){
          this.users.push(i);
        }
      }
    },

    mounted() {
      this.fetchUsers().then( obj => this.items = obj );       
    },

    methods: {
      ...mapActions([
        'fetchUsers'
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