<template lang="pug">
  q-layout(ref="layout", view="lHh Lpr fFf", :left-class="{'bg-grey-2': true}")
    q-toolbar(slot="header" color="green-8")
      q-btn(flat v-if="isHome")
        q-icon(name="access_time")

      q-btn(flat @click="$router.go(-1)" v-if="!isHome")
        q-icon(name="arrow_back")

      q-toolbar-title {{ viewTitle }}
      q-btn(flat v-if="false")
        q-icon(name="person")
      q-btn(flat v-if="false")
        q-icon(name="add_alert")
      q-btn(flat ref="target1" v-if="isHome")
        q-icon(name="more_vert")

        q-popover(ref="popover1")
          q-list(separator link)
            q-item(@click="addCategory(), $refs.popover1.close()") Settings
            q-item(@click="addCategory(), $refs.popover1.close()") About
            q-item(@click="addCategory(), $refs.popover1.close()") Rate

      q-btn(flat ref="target2" v-if="isAddActivity")
        q-icon(name="more_vert")
    
        q-popover(ref="popover2")
          q-list(separator link)
            q-item(@click="addCategory(), $refs.popover2.close()") Add Category
            q-item(@click="$router.push({path: categoriesUrl}), $refs.popover2.close()") View Categories
        
    //- q-tabs(slot="navigation" color="green-8" class="shadow-2" v-if="isHome")
    //-   q-route-tab(slot="title" :to="categoriesUrl" icon="event_note" name="tab1")
    //-   q-route-tab(slot="title" to="/account" icon="home")
    //-   q-route-tab(slot="title" :to="profileUrl" icon="person")

    router-view
    
</template>

<script>
import { homePath, loginPath, addActivityPath, categoriesPath, profilePath } from '../config'
import { QSideLink, QSearch, QTabs, QRouteTab, Alert } from 'quasar'

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
    user () {
      return this.$store.getters.user
    },
    viewTitle () {
      return this.$route.meta.title
    },
    isHome () {
      return this.$route.path === homePath
    },
    isAddActivity () {
      return this.$route.path === addActivityPath
    }
  },
  methods: {
    logout () {
      this.$auth.logUserOut()
        .then(resp => {
          this.$refs.layout.hideCurrentSide(() => {
            this.$router.push(loginPath)
          })
        })
    },
    addCategory () {
      console.log('add cat...')
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