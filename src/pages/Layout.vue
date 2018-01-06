<template lang="pug">
  //- q-layout(ref="layout" :header-class="{'no-shadows': isHome}")
  //-   q-toolbar(slot="header" color="green-8")
  //-     q-btn(flat v-show="isHome")
  //-       q-icon(name="access_time")

  //-     q-btn(flat @click="$router.go(-1)" v-show="!isHome")
  //-       q-icon(name="arrow_back")

  //-     q-toolbar-title {{ viewTitle }}
  //-     //- for the profile
  //-     q-btn(flat v-show="isHome" @click="$router.push({path: profileUrl})")
  //-       q-icon(name="person")

      //- q-btn(flat ref="target1" v-show="isHome")
      //-   q-icon(name="more_vert")

      //-   q-popover(ref="popover1" anchor="top right" self="top right")
      //-     q-list(separator link)
      //-       q-item(@click="$refs.popover1.close()") Settings
      //-       q-item(@click="$refs.popover1.close()") About
      //-       q-item(@click="$refs.popover1.close()") Rate
      //-       q-item(@click="logout(), $refs.popover1.close()") Logout

      //- q-btn(flat ref="target2" v-show="isProfile && !isEditMode")
      //-   q-icon(name="more_vert")
    
      //-   q-popover(ref="popover2" anchor="top right" self="top right")
      //-     q-list(separator link)
      //-       q-item(@click="editProfile(), $refs.popover2.close()") Edit Profile
        
  div
    router-view
    
</template>

<script>
import { homePath, loginPath, categoriesPath, profilePath } from 'js_config'
import { QSideLink, QSearch, QTabs, QRouteTab, Alert } from 'quasar'
import { mapGetters } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      homeUrl: homePath,
      categoriesUrl: categoriesPath,
      profileUrl: profilePath,
      pageTitle: 'Work Time Spent',
      search: ''
    }
  },
  components: {
    QSideLink,
    QSearch,
    QRouteTab,
    QTabs
  },
  computed: {
    ...mapGetters(['user', 'isEditMode']),
    viewTitle () {
      return this.$route.meta.title
    },
    isHome () {
      return this.$route.path === homePath
    },
    isProfile () {
      return this.$route.path === profilePath
    }
  },
  methods: {
    logout () {
      this.$auth.logUserOut()
        .then(() => {
          this.$router.push(loginPath)
        })
    },
    addCategory () {
      console.log('add cat...')
    },
    editProfile () {
      console.log('edit profile...')
      this.$store.dispatch('setEditMode', true)
    },
    notify () {
      Alert.create({
        html: 'Coming Soon!',
        icon: 'face',
        color: 'positive'
      })
    }
  }
}
</script>