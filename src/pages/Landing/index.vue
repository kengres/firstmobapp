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
  mounted () {
    this.$refs.carModal.open()
  },
  methods: {
    someMethod () {
      console.log('clicked')
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

