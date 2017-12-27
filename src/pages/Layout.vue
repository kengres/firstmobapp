<template lang="pug">
  q-layout(ref="layout", view="lHh Lpr fFf", :left-class="{'bg-grey-2': true}")
    q-toolbar(slot="header" color="green-8")
      q-btn(flat @click="$router.go(-1)" v-if="!isHome")
        q-icon(name="arrow_back")

      q-toolbar-title {{ viewTitle }}
      q-btn(flat v-if="false")
        q-icon(name="person")
      q-btn(flat v-if="false")
        q-icon(name="add_alert")
      q-btn(flat ref="target" v-if="isAddActivity")
        q-icon(name="more_vert")

        q-popover(ref="popover1")
          q-list(separator link)
            q-item(@click="addCategory(), $refs.popover1.close()") Add Category
            q-item(@click="$router.push({path: categoriesUrl}), $refs.popover1.close()") View Categories
    
    q-tabs(slot="navigation" color="green-8" class="shadow-2" v-if="isHome")
      q-route-tab(slot="title" :to="categoriesUrl" icon="event_note" name="tab1")
      q-route-tab(slot="title" to="/account" icon="home")
      q-route-tab(slot="title" :to="profileUrl" icon="person")

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
      pageTitle: 'Time Spent App',
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

<style lang="scss">
  .maxwidth {
    min-height: 100px;
    padding: 20px;
    position: relative;

    .for-icon {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    
    img {
      max-width: 100%;
      width: 100%;
      height: auto;
      border-radius: 50%;
    }

    .labels {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 2;
      padding-left: 10px;
      font-size: 24px;

      &__title {
        font-size: .75em;
      }
      &__subtitle {
        font-size: .65em;
      }
    }
  }
</style>
