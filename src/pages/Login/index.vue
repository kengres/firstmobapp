<template lang="pug">
  q-layout(view="hhh lpr lfr")
    q-toolbar(slot="header" color="lime-6")
      q-toolbar-title SignIn
    q-card(flat)
      q-card-title
        span.text-lime-6 Fill the Form to SignIn
      q-card-main(color="lime-6")
        q-field(
            color="lime-6"
            error-label="We need a valid email")
          q-input(v-model="loginForm.email"
                color="lime-6"
                float-label="E-mail"
                type="email")
        q-field(error-label="We need a valid pass" color="lime-6")
          q-input(type="password" 
              float-label="Password"
              color="lime-6"
              v-model="loginForm.password")
      q-card-actions
        q-btn.on-right(flat big color="lime-8" @click="login") Login

    q-toolbar(slot="footer" color="green-5")
      q-toolbar-title create an account
      q-btn(round color="green-6" icon="keyboard_arrow_right"
            @click="$router.replace(registerUrl)")
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
<style lang="scss" scoped>
  
</style>


