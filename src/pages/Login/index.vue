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

    <router-link :to="registerUrl">Register</router-link>
  </q-layout>
</template>
<script>
import { registerPath } from '../../config'
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
  methods: {
    login () {
      console.log('login...')
      const email = this.loginForm.email
      const password = this.loginForm.password
      this.$store.dispatch('signUserIn', {email, password})
      const user = null
      if (user) {
        this.$router.replace('/account')
      }
    }
  }
}
</script>

