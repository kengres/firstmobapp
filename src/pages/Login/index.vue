<template>
  <q-layout class="layout-padding centering bg-lime-4">
    <div class="fixed-top fixed-top__center">
      <img src="../../assets/squarelogo2.png" class="" alt="">
    </div>
    <q-card flat class="absolute-center centering__card bg-white">
      <q-card-title>
        <span class="text-lime-6">Fill the Form to SignIn</span>
      </q-card-title>
      <q-card-main color="lime-6">
        <q-field
            color="lime-6"
            error-label="We need a valid email"
          >
            <q-input v-model="loginForm.email"
                color="lime-6"
                float-label="E-mail"
                type="email" />
          </q-field>
        <q-field
            error-label="We need a valid pass"
          >
            <q-input type="password" 
              float-label="Password"
              v-model="loginForm.password"/>
          </q-field>

      </q-card-main>
      <q-card-actions>
        <q-btn outline color="lime-8" @click="login">Login</q-btn>
        <q-btn outline color="lime-8" @click="$router.replace(registerUrl)">register</q-btn>
      </q-card-actions>
    </q-card>

    
  </q-layout>
</template>
<script>
import { registerPath, homePath } from '../../config'
import { Toast } from 'quasar'
export default {
  data () {
    return {
      registerUrl: registerPath,
      loginForm: {
        email: '',
        password: ''
      }
    }
  },
  mounted () {
    this.welcomeMessage()
  },
  computed: {
    queryMsg () {
      return this.$route.query ? (this.$route.query.msg ? this.$route.query.msg : null) : null
    }
  },
  methods: {
    welcomeMessage () {
      if (this.queryMsg === 'noToken') {
        Toast.create.negative({
          html: 'Please login first!',
          timeout: 4000
        })
      }
      else if (this.queryMsg === 'goodbye') {
        Toast.create.info('See you next time.')
      }
    },
    login () {
      console.log('login...')
      const email = this.loginForm.email
      const password = this.loginForm.password
      this.$store.dispatch('signUserIn', {email, password})
        .then(resp => {
          console.log('promise login user: ', resp)
          this.$router.push({
            path: homePath,
            query: {
              msg: 'success'
            }
          })
        })
        .catch(error => {
          console.log('promise login error: ', error)
        })
      const user = null
      if (user) {
        this.$router.replace('/account')
      }
    }
  }
}
</script>
<style lang="scss">
  .centering {
    max-height: 100vh;
    overflow: hidden;

    &__card {
      width: 90%;
    }
  }
  .fixed-top {
    padding-top: 20px;
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
</style>


