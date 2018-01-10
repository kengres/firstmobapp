<template lang="pug">
  q-layout(view="hHh lpr lFr")
    .mask
    q-toolbar(slot="header" :color="color + '-8'")
      q-btn( flat icon="account_circle")
      q-toolbar-title Create Account
    q-card.absolute-center
      q-card-title Fill the Form Below
      q-card-main
        q-field(error-label="We need a valid name")
          q-input(v-model="userForm.first_name" :color="color"
              float-label="First Name")
        q-field(error-label="We need a valid name")
          q-input(v-model="userForm.last_name" :color="color"
              float-label="Last Name")
        q-field(error-label="We need a valid email")
          q-input(v-model="userForm.email" :color="color"
                float-label="E-mail"
                type="email")
        q-field(error-label="We need a valid email")
          q-input(type="password" :color="color"
              float-label="Password"
              v-model="userForm.password")
        q-field(error-label="Password don't match!")
          q-input(type="password" :color="color"
              float-label="Confirm Password"
              v-model="userForm.password2")

      q-card-actions
        q-btn(big :color="color + -6" @click="saveUser") register
    
    q-toolbar(slot="footer" :color="color + -6")
      q-toolbar-title(@click="$router.replace(loginUrl)") Login to your account
      q-btn(round :color="color + -9" icon="keyboard_arrow_right"
            @click="saveUser")
</template>
<script>
import { loginPath, homePath } from '../../config'
import { Toast } from 'quasar'
export default {
  data () {
    return {
      color: 'green',
      loginUrl: loginPath,
      userForm: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: ''
      }
    }
  },
  watch: {
    user (value) {
      console.log('user value changed: ', value)
      if (value) {
        this.$router.push({
          path: homePath,
          query: {
            msg: 'success'
          }
        })
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    saveUser () {
      console.log('saving user...')
      const data = this.userForm
      for (const formInput in data) {
        if (data.hasOwnProperty(formInput)) {
          const element = data[formInput]
          if (element === '') {
            this.notifyError(`${formInput} is required!`)
            return
          }
        }
      }
      const patt = /^\w+([.-]? w+)*@\w+([.-]? w+)*(\.\w{2,3})+$/
      if (!patt.test(data.email)) {
        this.notifyError('You have an invalid email!')
        return
      }
      if (data.password !== data.password2) {
        this.notifyError('Password don\'t match!')
        return
      }
      console.log('form: ', this.userForm)
      this.$store.dispatch('signUserUp', data)
    },
    notifyError (msg) {
      Toast.create.negative(msg)
    }
  }
}
</script>

<style lang="scss" scoped>
  .layout {
    background: white url('../../assets/bg-3.jpeg') no-repeat fixed center;
    position: relative;
  }
  .mask {
    position: absolute;
    right: 0; left: 0; top: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .q-card {
    background-color: rgba(255, 255, 255, 0.938);
    width: 90%;
    margin-right: auto;
    margin-left: auto;
  }
</style>