<template lang="pug">
  q-list
    q-list-header
      h5 Statistics 
      h6 {{ len }} activities, {{ total | hourMinFormat }}
      h6 Average: {{ average | hourMinFormat }}
    q-item(v-for="(item, i) in activities" :key="i")
      q-item-side activity {{i + 1}}
      q-item-main duration: {{ item.duration | hourMinFormat }}
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['activities']),
    total () {
      let t = 0
      for (const item of this.activities) {
        t += item.duration
      }
      return t
    },
    len () {
      return this.activities.length
    },
    average () {
      return this.total / this.len
    }
  },
  filters: {
    hourMinFormat (value) {
      const h = Math.floor(value / 60)
      const m = value % 60
      if (h === 0) {
        return `${m}min`
      }
      else if (m === 0) {
        return `${h}h`
      }
      return `${h}h ${m}min`
    }
  }
}
</script>
