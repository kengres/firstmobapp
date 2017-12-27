<template>
  <q-layout class="layout-padding centering bg-lime-3">
    <div class="fixed-top fixed-top__center">
      <img src="../../assets/logo-sm.png" class="" alt="">
    </div>
    <q-card class="absolute-center centering__card bg-white">
      <q-card-title>
        Fill the Form Below
      </q-card-title>
      <q-card-main>
        <q-field
            error-label="We need a valid name"
          >
            <q-input v-model="userForm.first_name"
              float-label="First Name" />
          </q-field>

          <q-field
            error-label="We need a valid name"
          >
            <q-input v-model="userForm.last_name"
              float-label="Last Name" />
          </q-field>

        <q-field
            error-label="We need a valid email"
          >
            <q-input v-model="userForm.email" 
                float-label="E-mail"
                type="email" />
          </q-field>
        <q-field
            error-label="We need a valid email"
          >
            <q-input type="password" 
              float-label="Password"
              v-model="userForm.password"/>
          </q-field>
        <q-field
            error-label="Password don't match!"
          >
            <q-input type="password" 
              float-label="Confirm Password"
              v-model="userForm.password2" />
          </q-field>

      </q-card-main>
      <q-card-actions>
        <q-btn outline color="lime-9" @click="saveUser">register</q-btn>
        <q-btn outline color="lime-9" @click="$router.replace(loginUrl)">Sign</q-btn>
      </q-card-actions>
    </q-card>
  </q-layout>
</template>
<script>
import { loginPath, homePath } from '../../config'
import { Toast } from 'quasar'
export default {
  data () {
    return {
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
            this.notifyError(`${formInput} must not be empty!`)
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
      Toast.create(msg)
    }
  }
}
</script>

