<template lang="pug">
  q-layout(ref="homeLayout" view="hHh lpr lfr")
    q-toolbar(slot="header" color="green-8")
      q-btn(flat v-go-back="homeUrl")
        q-icon(name="arrow_back")
      q-toolbar-title {{ $route.meta.title }}
      
      q-btn(flat ref="target2" v-show="!isEditMode")
        q-icon(name="more_vert")
    
        q-popover(ref="popover2" anchor="top right" self="top right")
          q-list(separator link)
            q-item(@click="editProfile(), $refs.popover2.close()") Edit Profile
    profile-view(v-if="!isEditMode")
    profile-edit(v-else)
    
</template>
<script>
import { homePath } from 'js_config'
import ProfileView from './isview'
import ProfileEdit from './isedit'
export default {
  computed: {
    isEditMode () {
      return this.$store.getters.isEditMode
    },
    homeUrl () {
      return homePath
    }
  },
  components: {
    ProfileView,
    ProfileEdit
  },
  methods: {
    editProfile () {
      console.log('edit profile...')
      this.$store.dispatch('setEditMode', true)
    }
  },
  beforeRouteLeave (to, from, next) {
    console.log('before destroying...')
    this.$store.dispatch('setEditMode', false)
    next()
  }
}
</script>
