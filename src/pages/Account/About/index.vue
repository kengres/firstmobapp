<template lang="pug">
  q-layout
    q-toolbar(slot="header" color="green-7")
      q-btn(flat v-go-back="homeUrl")
        q-icon(name="arrow_back")
      q-toolbar-title {{ $route.meta.title }}
    q-list(no-border)
      q-list-header
        h5 About Work Time Manager
      q-item
        q-item-side
          q-item-tile(icon="description")
        q-item-main
          q-item-tile App Version
          q-item-tile 1.1.34
      q-item
        q-item-side(icon="code")
        q-item-main
          q-item-tile Developed by
          q-item-tile G. Bakevya Lab
    q-list(no-border)
      q-item
        q-item-side(icon="star")
        q-item-main Rate us
      q-item
        q-item-side(icon="mail")
        q-item-main Contact developer
    q-card(flat)
      q-card-main.text-center
        q-icon(name="access_time" color="faded" size="150px")
</template>
<script>
import { homePath } from 'js_config'

export default {
  data () {
    return {
      homeUrl: homePath
    }
  }
}
</script>

