<template>
  <q-layout class="layout-padding">
    <q-card>
      <q-card-title>
        Fill the Form to login
      </q-card-title>
      <q-card-main>
          <q-field
              error-label="We need a valid email"
            >
              <q-input v-model="loginForm.email" 
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

            <q-field>
              <q-btn color="green" @click="login">Login</q-btn>
            </q-field>

      </q-card-main>
    </q-card>

    <q-fixed-position corner="bottom-right" :offset="[20, 250]">
      <q-btn big color="positive" @click="$router.replace(registerUrl)">
        register
      </q-btn>
    </q-fixed-position>
    
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

