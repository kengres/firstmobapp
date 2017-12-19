<template>
  <q-layout class="layout-padding">
    <q-card>
      <q-card-title>
        Fill the Form Below
      </q-card-title>
      <q-card-main>
          <q-field
              error-label="We need a valid name"
            >
              <q-input v-model="userForm.name"
                float-label="Full Name" />
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

            <q-field>
              <q-btn color="green" @click="saveUser">Save</q-btn>
            </q-field>

      </q-card-main>
    </q-card>
    <div>
      already hava account? <router-link :to="loginUrl">Sign in here</router-link>
    </div>
  </q-layout>
</template>
<script>
import { loginPath } from '../../config'
export default {
  data () {
    return {
      loginUrl: loginPath,
      userForm: {
        name: '',
        email: '',
        password: '',
        password2: ''
      }
    }
  },
  methods: {
    saveUser () {
      console.log('saving user...')
    }
  }
}
</script>

