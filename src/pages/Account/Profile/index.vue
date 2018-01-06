<template lang="pug">
  q-layout(ref="homeLayout" view="hHh lpr lfr")
    q-toolbar(slot="header" color="green-8")
      q-btn(flat @click="$router.go(-1)")
        q-icon(name="arrow_back")
      q-toolbar-title {{ $route.meta.title }}
    profile-view(v-if="!isEditMode")
    profile-edit(v-else)
    
</template>
<script>
import ProfileView from './isview'
import ProfileEdit from './isedit'
export default {
  computed: {
    isEditMode () {
      return this.$store.getters.isEditMode
    }
  },
  components: {
    ProfileView,
    ProfileEdit
  },
  beforeRouteLeave (to, from, next) {
    console.log('before destroying...')
    this.$store.dispatch('setEditMode', false)
    next()
  }
}
</script>
