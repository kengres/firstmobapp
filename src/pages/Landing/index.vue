<template lang="pug">
  q-layout
    q-modal(ref="carModal" maximized)
      q-carousel.text-white.full-height(dots @slide="handleSlide")
        div.centered(slot="slide" v-for="(slide, i) in slides" :key="i"
          :class="`bg-item-${i+1}`")
          .slide-mask
          q-card(:class="`customCard text-${slide.color}`")
            q-card-title {{slide.text}}
              
    q-fixed-position(corner="bottom-left" :offset="[70, 50]" v-show="showButtons")
      q-btn.text-dark(color="white" raised big @click="$router.push({path: loginUrl})") SignIn

    q-fixed-position(corner="bottom-right" :offset="[70, 50]" v-show="showButtons")
      q-btn.text-dark(color="white" raised big @click="$router.push({path: registerUrl})") SignUp
        
      
</template>
<script>
import { loginPath, registerPath } from '../../config'
export default {
  data () {
    return {
      showButtons: false,
      slides: [
        { bg: 'faded', color: 'white', text: 'Welcome! Thank you for choosing Time spent App!' },
        { bg: 'light', color: 'white', text: 'Manage your time to be more productive. Know what you have been up to lately!' },
        { bg: 'white', color: 'white', text: 'To get started, please login to your account, or sign up, if you don\'t already have one!' }
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
    background-color: rgba(0, 0, 0, 0.9);
    background-position: center;
    background-size: contain;
    position: relative;
  }
  .slide-mask {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background-color: rgba(0, 0, 0, 0.7);
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

