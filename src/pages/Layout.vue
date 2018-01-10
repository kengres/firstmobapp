<template lang="pug">
  router-view
</template>
<script>
import { Loading } from 'quasar'
export default {
  created () {
    if (this.loading) {
      Loading.show({
        delay: 0
      })
    }
    else {
      Loading.hide()
    }
  },
  watch: {
    loading (val) {
      console.log('loading from layout: ', val)
      if (val) {
        Loading.show()
      }
      else {
        Loading.hide()
      }
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>
