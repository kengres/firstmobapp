<template>
  <q-layout class="layout-padding">
    <q-modal
        ref="carModal"
        maximized>
      <q-carousel 
        class="text-white full-height"
        dots>
        <div slot="slide"
          class="centerFlex"
          v-for="(slide, i) in slides" :key="i"
          :class="`bg-${slide.bg}`">
            {{slide.text}}
        </div>

        <q-fixed-position corner="bottom-left" :offset="[80, 50]">
          <q-btn color="info" @click="$router.push({path: loginUrl})" >
            Login
          </q-btn>
        </q-fixed-position>

        <q-fixed-position corner="bottom-right" :offset="[100, 50]">
          <q-btn color="info" @click="$router.push({path: registerUrl})" >
            Register
          </q-btn>
        </q-fixed-position>

      </q-carousel>
    </q-modal>
  </q-layout>
</template>
<script>
import { loginPath, registerPath } from '../../config'
export default {
  data () {
    return {
      slides: [
        { bg: 'primary', text: 'hello welcome!' },
        { bg: 'info', text: 'hello 2!' },
        { bg: 'tertiary', text: 'hello again!' }
      ],
      loginUrl: loginPath,
      registerUrl: registerPath
    }
  },
  created () {
    console.log('landing is created, get user please...', this.user)
    if (this.user) {
      this.pushToAccount()
    }
  },
  watch: {
    user (value) {
      if (value) {
        console.log('user changed: pushing to account')
        this.pushToAccount()
      }
    }
  },
  mounted () {
    console.log('landing is mounted...')
    this.$refs.carModal.open()
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    pushToAccount () {
      this.$router.push({
        path: '/account'})
    },
    alert () {
      console.log('alert...')
    }
  }
}
</script>
<style>
  .centerFlex {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

