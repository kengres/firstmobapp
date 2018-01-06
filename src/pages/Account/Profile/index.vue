<template lang="pug">
  div
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
