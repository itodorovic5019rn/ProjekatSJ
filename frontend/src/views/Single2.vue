<template>
    <div id="app">
        <Header title="Recenzija serije"/>
        <h3 style="font-weight: bold" v-text="tvShowName"></h3>

        <b-form @submit="onSubmit" class="forma">
            <b-form-group label="Ocena(0-10):" label-for="ocena" class="grp">
            <b-form-input id="ocena" v-model="form.ocena" required></b-form-input>
            </b-form-group>

            <b-form-group label="Komentar:" label-for="komentar" class="grp">
            <b-form-input id="komentar" v-model="form.komentar" required></b-form-input>
            </b-form-group>

            <b-form-group label="Poeni(0-100):" label-for="lajk" class="grp">
            <b-form-input id="lajk" v-model="form.lajk" required></b-form-input>
            </b-form-group>

            <b-form-checkbox id="preporuka" v-model="form.preporuka" :value="true" :unchecked-value="false">Preporuka</b-form-checkbox>
          
            <br>
            <b-button type="submit" variant="primary">Izmeni</b-button>
            <br><br>
            <b-button v-on:click="obrisi" variant="danger">Obrisi</b-button>
        </b-form>

    </div>
</template>

<script>

    import Header from '../components/Header.vue'
    import {mapActions} from 'vuex';

    export default {
        name:'Single2',

        data(){
            return{
                form: {
                    userId:'',
                    ocena: '',
                    komentar: '',
                    lajk: '',
                    serijaId: '',
                    preporuka: false
                },
                tvShowName:''
            }
        },

        components:{
            Header
        },

        watch: {
            
        },

        methods: {
            ...mapActions([
                'fetchTvShowPost',
                'updateTvShowPost',
                'deleteTvShowPost'
            ]),

            onSubmit(e) {
                e.preventDefault();

                this.updateTvShowPost(this.form);
                this.$router.push({name:'MyPosts'});
            },

            obrisi(e){
                e.preventDefault();

                this.deleteTvShowPost(this.form.id);
                this.$router.push({name:'MyPosts'});
            }
        },

        mounted(){
            this.fetchTvShowPost(this.$route.params.id).then(res => {
                this.form = res;
                this.tvShowName = res.serija.naziv;
            });
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