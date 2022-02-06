<template>
  <div id="app">
    <Header title="Create account"/>

    <b-form @submit="onSubmit" class="forma">
      <b-form-group label="First Name:" label-for="firstName" class="grp">
        <b-form-input id="firstName" v-model="form.firstname" placeholder="Enter first name" required></b-form-input>
      </b-form-group>

      <b-form-group label="Last Name:" label-for="lastName" class="grp">
        <b-form-input id="lastName" v-model="form.lastname" placeholder="Enter last name" required></b-form-input>
      </b-form-group>

      <b-form-group label="Email:" label-for="email" class="grp">
        <b-form-input id="email" v-model="form.email" type="email" placeholder="Enter email" required></b-form-input>
      </b-form-group>

      <b-form-group label="Username:" label-for="username" class="grp">
        <b-form-input id="username" v-model="form.username" placeholder="Enter username" required></b-form-input>
      </b-form-group>

      <b-form-group label="Password:" label-for="password" class="grp">
        <b-form-input id="password" v-model="form.password" type="password" required></b-form-input>
      </b-form-group>

      <b-form-checkbox id="moderator" v-model="form.role" :value="true" :unchecked-value="false">Moderator</b-form-checkbox>
      
      <br>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>

  import Header from '@/components/Header.vue';
  import { mapActions } from 'vuex';

  export default {
    name: 'Register',
    
    components: {
      Header
    },

    data() {
      return {
        form: {
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            password: '',
            role: false
        }
      }
    },

    methods: {
      ...mapActions([
        'register'
      ]),

      onSubmit(e) {
        e.preventDefault();

        if(this.form.firstname.length < 2){
            this.$alert("First name must be longer!");
            return;
        }else if(this.form.lastname.length < 2){
            this.$alert("Last name must be longer!");
            return;
        }else if(this.form.username.length < 3){
            this.$alert("Username must be longer!");
            return;
        }else if(this.form.password.length < 6){
            this.$alert("Password must be longer!");
            return;
        }

        this.register(this.form);
        this.$router.push({ name: 'Home' });
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
        margin-top: 10px;
    }
</style>
