<template>
    <div id="app">
        <Header title="Tv Shows Posts"/>

         <b-form v-if="token" @submit="onSubmit" class="forma">
          <b-form-group label="Ocena(0-10):" label-for="ocena" class="grp">
            <b-form-input id="ocena" v-model="form.ocena" placeholder="Unesite ocenu" required></b-form-input>
          </b-form-group>

          <b-form-group label="Komentar:" label-for="komentar" class="grp">
            <b-form-textarea id="komentar" rows="3" v-model="form.komentar" placeholder="Unesite komentar" required></b-form-textarea>
          </b-form-group>

          <b-form-group label="Poeni(0-100):" label-for="lajk" class="grp">
            <b-form-input id="lajk" v-model="form.lajk" placeholder="Unesite poene" required></b-form-input>
          </b-form-group>

          <b-form-select
          id="inline-form-custom-select-pref"
          class="mb-2 mr-sm-2 mb-sm-0"
          v-model="selected"
          :options="options"
          ></b-form-select>

          <b-form-checkbox id="preporuka" v-model="form.preporuka" :value="true" :unchecked-value="false">Preporuka</b-form-checkbox>
          
          <br>
          <b-button type="submit" variant="primary">Oceni</b-button>
        </b-form>

        <TvShowsPostsList />
    </div>
</template>

<script>
  import Header from '@/components/Header.vue';
  import TvShowsPostsList from '@/components/TvShowsPostsList.vue';
  import { mapActions } from 'vuex';

  export default {
    name: 'TvShowsPosts',
    
    components: {
      Header,
      TvShowsPostsList
    },

    data() {
        return {
          form: {
            userId:'',
            ocena: '',
            komentar: '',
            lajk: '',
            serijaId: '',
            preporuka: false
        },
        token: localStorage.token,
        serije: [],
        options: [],
        selected: null
      }
    },

    watch: {
      serije(nVal){
        this.options = [];
        this.options.push({value:null, text:"Serije"});

        for(let f of nVal){
          this.options.push({value:f.id, text:f.naziv});
        }
      }
    },

    mounted() {
        this.fetchTvShows().then(obj => this.serije = obj);
    },

    methods: {
      ...mapActions([
        'fetchTvShows',
        'addTvShowPost'
      ]),

      onSubmit(e) {
        e.preventDefault();
        this.form.userId = localStorage.userId;
        this.form.serijaId = this.selected;

        this.addTvShowPost(this.form);
        window.location.reload();
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