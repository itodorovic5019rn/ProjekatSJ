<template>
  <div id="app">
    <Header title="Log In"/>

    <b-form @submit="onSubmit" class="forma">
      <b-form-group label="User Name:" label-for="username" class="grp">
        <b-form-input id="username" v-model="form.username" placeholder="Enter username" required></b-form-input>
      </b-form-group>

      <b-form-group label="Password:" label-for="password" class="grp">
        <b-form-input id="password" v-model="form.password" type="password" required></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>

  import Header from '@/components/Header.vue';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'Login',
    
    components: {
      Header
    },

    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },

    computed: {
      ...mapState([
        'role'
      ])
    },

    methods: {
      ...mapActions([
        'login'
      ]),

      onSubmit(e) {
        e.preventDefault();

        if(this.form.username != "admin" && this.form.password != "admin"){
            if(this.form.username.length < 3){
                this.$alert("Invalid username!");
                return;
            }else if(this.form.password.length < 6){
                this.$alert("Invalid password!");
                return;
            }
        }

        this.login(this.form);
        // this.$router.push({ name: 'Home' }); // ovo radim u index.js-u jer ne znam da li je korisnik uneo dobre kredencijale
      }
    }
  }
</script>

<style scoped>
    .forma{
        width: 300px;
        margin-left: 465px;
    }

    .grp{
        padding: 10px;
        margin-top: 20px;
    }
</style>
