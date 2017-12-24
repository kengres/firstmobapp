<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fFf"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header" color="green-8">
      <q-btn flat @click="$refs.layout.toggleLeft()" v-if="isHome">
        <q-icon name="menu" />
      </q-btn>
      <q-btn flat @click="$router.go(-1)" v-else>
        <q-icon name="arrow_back" />
      </q-btn>

      <q-toolbar-title>
        {{ viewTitle }}
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->
      <div class="maxwidth row">
        <div class="col-4 avatar">
          <q-icon name="face" style="font-size: 70px" />
        </div>
        <div class="col-8 labels">
          <div class="labels__title">{{user? user.first_name: 'Anonymous'}}</div>
          <div class="labels__subtitle">{{user? user.last_name : 'User'}}</div>
        </div>
        <div class="for-icon">
          <q-icon name="settings" style="font-size: 25px" />
        </div>
      </div>
      
      <q-list no-border link inset-delimiter>
      <q-item>
      </q-item>
      <q-item @click="notify">
        <q-item-side icon="help" />
        <q-item-main label="F.A.Q" />
      </q-item>
      <q-item @click="logout">
        <q-item-side icon="exit_to_app" />
        <q-item-main label="Logout" />
      </q-item>
    </q-list>
      
    </div>

     <router-view />

    
  </q-layout>
</template>

<script>
import { homePath, loginPath } from '../config'
import { QSideLink, Alert } from 'quasar'

export default {
  name: 'index',
  data () {
    return {
      homeUrl: homePath,
      pageTitle: 'Time Spent App'
    }
  },
  components: {
    QSideLink
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
