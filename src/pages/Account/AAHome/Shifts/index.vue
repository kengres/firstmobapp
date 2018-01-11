<template lang="pug">
  q-list
    q-list-header
      h5 All shifts
      h6 Comming soon...
      h6 device ready: {{deviceReady}}
    q-item
      p cordova Info: {{ cordovaI }}
</template>
<script>
export default {
  data () {
    return {
      cordovaI: ''
    }
  },
  created () {
    setTimeout(() => {
      this.cordovaInfo()
    }, 5000)
  },
  computed: {
    deviceReady () {
      return this.$store.getters.deviceReady
    }
  },
  methods: {
    cordovaInfo () {
      console.clear()
      console.log(this)
      // console.log(JSON.stringify(this))
      // return JSON.stringify(this)
    }
  }
}
</script>
