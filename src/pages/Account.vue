<template>
  <q-layout class="layout-padding">
    <q-card>
      <q-card-media>
        <img :src="avatar">
      </q-card-media>
      <q-card-title>
        Kenguruka Grevisse
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        Frontend Web Developer
        <br />
        <br />
        <q-btn round icon="add" color="green"
          @click="modalOpen = true"></q-btn>

      </q-card-main>
    </q-card>
    <q-modal v-model="modalOpen" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn flat @click="modalOpen = false">
            <q-icon name="keyboard_arrow_left" />
          </q-btn>
          <q-toolbar-title>
            Create account
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding" @keyup.enter="saveUser">
          <h5>Fill the Form Below</h5>
          
          <q-field
              error-label="We need a valid name"
            >
              <q-input v-model="userForm.name"
                float-label="Name" />
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

        </div>

         <q-toolbar slot="footer">
          <q-toolbar-title>
            <q-btn round icon="close" color="yellow"
                  @click="modalOpen = false"></q-btn>
            </q-toolbar-title>
        </q-toolbar>
        
      </q-modal-layout>

    </q-modal>
  </q-layout>  
</template>
<script>
import Avatar from 'assets/boy-avatar.jpg'
import {
  Toast,
  QLayout,
  QInput,
  QField,
  QToolbar,
  QToolbarTitle,
  QModal,
  QModalLayout,
  QBtn,
  QIcon,
  QCard,
  QCardTitle,
  QCardMedia,
  QCardSeparator,
  QCardMain
} from 'quasar'
export default {
  data () {
    return {
      avatar: Avatar,
      modalOpen: false,
      userForm: {
        name: '',
        email: '',
        password: '',
        password2: ''
      }
    }
  },
  components: {
    QBtn,
    QIcon,
    QLayout,
    QInput,
    QField,
    QToolbar,
    QToolbarTitle,
    QModal,
    QModalLayout,
    QCard,
    QCardTitle,
    QCardMedia,
    QCardSeparator,
    QCardMain
  },
  methods: {
    saveUser () {
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

