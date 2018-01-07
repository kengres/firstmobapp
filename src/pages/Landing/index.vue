<template lang="pug">
  q-layout
    q-modal(ref="carModal" maximized)
      q-carousel.full-height(dots @slide="handleSlide"
        :class="{'bg-slide2' : isSlide2, 'bg-slide3' : isSlide3 }")
        .carousel_slide(slot="slide" v-for="(slide, i) in slides" :key="i")
          .carousel_slide--inner
            .text-center.carousel_title
              h5 {{ slide.title }}
              p {{ slide.subtitle }}
            .component
              .component_inner
                component(:is="slide.comp")
            .carousel_actionBtn(v-if="showButtons")
              .carousel_actionBtn--inner.row.now-wrap.justify-between
                q-btn(outline color="white" big 
                    @click="landingSeen(); $router.push({path: loginUrl})") SignIn
                q-btn(outline color="white" big 
                    @click="landingSeen(); $router.push({path: registerUrl})") SignUp
        
      
</template>
<script>
import { loginPath, registerPath } from 'js_config'
import { LocalStorage } from 'quasar'
import SlideOne from './slide1'
import SlideTwo from './slide2'
import SlideThree from './slide3'

const key = 'WRKTMSPNT:LNDNGSN:WKRNMSPNT'
const value = 'Yes'

export default {
  data () {
    return {
      showButtons: false,
      isSlide2: false,
      isSlide3: false,
      slides: [
        {
          title: 'Welcome to Work Time Spent App',
          subtitle: 'Simple. Light. Easy to use.',
          comp: 'SlideOne'
        },
        {
          title: 'Manage your time to be more productive.',
          subtitle: 'Know what you have been up to lately!',
          comp: 'SlideTwo'
        },
        {
          title: 'To get started, please login.',
          subtitle: 'Or create an account.',
          comp: 'SlideThree'
        }
      ],
      loginUrl: loginPath,
      registerUrl: registerPath
    }
  },
  components: {
    SlideOne,
    SlideTwo,
    SlideThree
  },
  created () {
    console.log('landing is created, get user please...', this.user)
    if (this.user) {
      this.pushToAccount()
    }
    else if (this.seenLanding) {
      this.$router.push({
        path: this.loginUrl
      })
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
    },
    seenLanding () {
      return LocalStorage.get.item(key)
    }
  },
  methods: {
    handleSlide (i, dir) {
      // console.log('just swipe: ', i)
      if (i === 1) {
        this.isSlide2 = true
        this.isSlide3 = false
        this.showButtons = false
      }
      else if (i === 2) {
        this.isSlide2 = false
        this.isSlide3 = true
        this.showButtons = true
      }
      else {
        this.showButtons = false
        this.isSlide2 = this.isSlide3 = false
      }
    },
    pushToAccount () {
      this.$router.push({
        path: '/account'})
    },
    landingSeen () {
      console.log('landing seen...')
      LocalStorage.set(key, value)
    }
  }
}
</script>
<style lang="scss" scoped>
  .q-carousel {
    background-color: rgb(173, 82, 29);
    transition: background-color .3s ease-in-out;

    &.bg-slide2 {
      background-color: rgb(223, 174, 16);
    }
    &.bg-slide3 {
      background-color: #11a124;
    }
  }
  .carousel {
    &_slide {
      padding: 0;

      &--inner {
        width: 100%;
        height: 100%;
        padding: 0 1em;
        position: relative;
      }
    }
    &_title {
      position: absolute;
      color: rgba(255, 255, 255, 0.836);
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      padding-top: 20px;
    }
    &_actionBtn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;

      &--inner {
        width: 50%;
        min-width: 200px;
        margin: 0 auto;
      }
    }
  }
  .component {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -70%);
    min-width: 200px;
    width: 90%;
    max-width: 100vw;
    height: 200px;
    // background-color: rgb(41, 212, 93);
  }
</style>

