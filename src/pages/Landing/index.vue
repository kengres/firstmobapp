<template>
  <q-layout class="layout-padding">
    <q-modal
        ref="carModal"
        maximized>
      <q-carousel 
        class="text-white full-height"
        dots
        @slide="handleSlide">
        <div slot="slide"
          class="centered"
          v-for="(slide, i) in slides" :key="i"
          :class="`bg-item-${i+1}`">
            <div class="slide-mask"></div>
            <q-card :color="slide.bg" :class="`customCard text-${slide.color}`">
              <q-card-title>
                {{slide.text}}
              </q-card-title>
            </q-card>
        </div>

        <q-fixed-position corner="bottom-left" :offset="[70, 50]" v-show="showButtons">
          <q-btn color="white" raised class="text-dark" big @click="$router.push({path: loginUrl})" >
            SignIn
          </q-btn>
        </q-fixed-position>

        <q-fixed-position corner="bottom-right" :offset="[70, 50]" v-show="showButtons">
          <q-btn color="white" raised class="text-dark" big @click="$router.push({path: registerUrl})" >
            SignUp
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
      showButtons: false,
      slides: [
        { bg: 'faded', color: 'white', text: 'Welcome! Thank you for choosing Time spent App!' },
        { bg: 'light', color: 'black', text: 'Manage your time to be more productive. Know what you have been up to lately!' },
        { bg: 'white', color: 'dark', text: 'To get started, please login to your account, or sign up, if you don\'t already have one!' }
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
    handleSlide (i, dir) {
      if (i === 2) {
        this.showButtons = true
      }
      else {
        this.showButtons = false
      }
    },
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
<style lang="scss">
  .bg-item {
    background-position: center;
    background-size: contain;
    position: relative;
  }
  .slide-mask {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .bg-item-1 {
    background-image: url('../../assets/bg-1.jpeg');
    @extend .bg-item;
  }
  .bg-item-2 {
    background-image: url('../../assets/bg-2.jpeg');
    @extend .bg-item;
  }
  .bg-item-3 {
    background-image: url('../../assets/bg-3.jpeg');
    @extend .bg-item;
  }
  .customCard {
    width: 60vw;
    max-width: 90vw;
    min-width: 200px;
    text-align: center;
    opacity: 0.9;
    z-index: 5;
  }
</style>

