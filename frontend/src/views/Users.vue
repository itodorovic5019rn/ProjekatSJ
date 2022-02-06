<template>
    <div id="app">
        <Header title="Users"/>
        <UsersList />
    </div>
</template>

<script>
  import Header from '@/components/Header.vue';
  import UsersList from '@/components/UsersList.vue';
  import { mapActions } from 'vuex';

  export default {
    name: 'Users',
    
    components: {
      Header,
      UsersList
    },

    data() {
        return {
            depID: null
        }
    },

    watch: {
      $route() {
        this.subtitle = this.$route.params.name;
        this.depID = this.$route.params.id;

        // this.fetchIDsByDepartment(this.depID);
      }
    },

    mounted() {
        this.subtitle = this.$route.params.name;
        this.depID = this.$route.params.id;

        // this.fetchIDsByDepartment(this.depID);
    },

    methods: {
      ...mapActions([
        'fetchIDsByDepartment'
      ])
    }
  }
</script>

<style scoped>

</style>
