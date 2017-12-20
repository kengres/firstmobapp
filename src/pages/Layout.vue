<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fFf"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header" color="green-8">
      <q-btn
        flat
        @click="toggleLeftSide"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        Time Spent App
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->
      <my-side-bar />
      
    </div>

     <router-view />

    <q-toolbar slot="footer" color="faded">
      <q-toolbar-title>
        This is footer
      </q-toolbar-title>
    </q-toolbar>
  </q-layout>
</template>

<script>
import { nav } from '../config'
import {
  QLayout,
  QRouteTab,
  QTab,
  QTabs,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain
} from 'quasar'

import MySideBar from '#/sidebar.vue'
export default {
  name: 'index',
  data () {
    return {
      homeUrl: nav.homeUrl,
      addLogUrl: nav.addLogUrl,
      accountUrl: nav.accountUrl
    }
  },
  components: {
    QLayout,
    QRouteTab,
    QTab,
    QTabs,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    MySideBar
  },
  computed: {
    getName () {
      return this.name
    }
  },
  methods: {
    toggleLeftSide () {
      this.$refs.layout.toggleLeft()
      this.$store.dispatch('setHideLeft', false)
    }
  }
}
</script>

<style lang="stylus">
</style>
