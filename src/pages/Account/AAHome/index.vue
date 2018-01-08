<template lang="pug">
  q-layout(ref="homeLayout" view="hHh lpr lfr")
    q-toolbar(slot="header" color="green-8")
      q-btn(flat)
        q-icon(name="access_time")
      q-toolbar-title {{ $route.meta.title }}
      q-btn(flat @click="$router.push({path: profileUrl})")
        q-icon(name="person")
      q-btn(flat ref="target1")
        q-icon(name="more_vert")
        q-popover(ref="popover1" anchor="top right" self="top right")
          q-list(separator link)
            q-item(@click="$refs.popover1.close()") Settings
            q-item(
              @click="$router.push({path: aboutUrl}); $refs.popover1.close()") About
            q-item(@click="$refs.popover1.close()") Rate
            q-item(@click="logout(), $refs.popover1.close()") Logout

    q-tabs.shadow-2(slot="navigation" color="green-8"
          v-model="selectedTab")
      q-tab(slot="title" name="tab-shifts" icon="format_list_bulleted")
      q-tab(slot="title" name="tab-home" icon="home")
      q-tab(slot="title" name="tab-statistics" icon="pie_chart")

    template(v-if="!loading")
      template(v-if="selectedTab === 'tab-home'")
        template(v-if="displayedActivities && displayedActivities.length > 0")
          q-list(separator)
            q-list-header(inset)
              h5 {{currentMonth}}
            q-item(v-for="item in displayedActivities" :key="item.id")
              q-item-side
                q-item-tile(color="green" icon="work")
              q-item-main
                q-item-tile(label) {{item.date | formattedDate}}
                //- q-item-tile(sublabel) {{item.duration | hourMinFormat}}
              q-item-side(right)
                q-item-tile(stamp) {{item.start | formattedTime}} - {{item.end | formattedTime}}
                q-item-tile(stamp) {{item.duration | hourMinFormat}}
              q-item-side(right :ref="`target${item.id}`")
                q-item-tile(icon="more_vert")

                  q-popover(:ref="`popover${item.id}`" anchor="top right" self="top right")
                    q-list(separator)
                      q-item(@click="editActivity(item), $refs[`popover${item.id}`][0].close()")
                        q-icon(name="edit")
                        q-item-tile Edit
                      q-item(@click="deleteActivity(item), $refs[`popover${item.id}`][0].close()")
                        q-icon(name="delete")
                        q-item-tile Delete
        q-list(no-border v-else)
          q-list-header
            h5 Please add new work logs.
          q-item
            q-item-main
              q-item-tile
                p To do so, click at the plus button below.

      template(v-else-if="selectedTab === 'tab-statistics'")
        home-statistics

      template(v-else-if="selectedTab === 'tab-shifts'")
        home-shifts


      //- <q-modal ref="minimizedModal" minimized v-model="open" 
      //-   :content-css="{padding: '20px'}" v-if="logInView">
      //-   <h4>Saturday</h4>
      //-   <h5>{{logInView.date | formattedDate}}</h5>
      //-   <h5>{{logInView.duration}}</h5>
      //-   <p>Start: {{logInView.start | formattedTime}}</p>
      //-   <p>End: {{logInView.end | formattedTime}}</p>
      //-   <q-btn color="faded" icon="close" round
      //-         @click="$refs.minimizedModal.close()"></q-btn>
      //- </q-modal>
      
      q-fixed-position(corner="bottom-right" :offset="[20, 10]")
        q-btn(round color="positive" @click="addNewOpen = true" icon="add")

      q-fixed-position(corner="bottom-left" :offset="[20, 20]" v-if="!isProduction")
        q-btn(round color="positive" icon="check" @click="testActi")
      
      //- footers
      q-toolbar(slot="footer" color="green-10" v-if="selectedTab === 'tab-shifts'")
        shifts-footer
      
      q-modal(ref="minimizedModal" v-model="addNewOpen" position="left")
        add-activity(@created="addNewOpen = false")

      q-modal(ref="minimizedModal" v-model="editOpen" position="left" 
              v-if="loadedActivity" @close="annulateAct")
        single-activity(:activity="loadedActivity" @updated="editOpen = false")
    template(v-else)
      div.fixed-center Loading ...

</template>
<script>
import AddActivity from '../Activity/addActivity'
import SingleActivity from '../Activity/singleActivity'
import HomeStatistics from './Statistics'
import HomeShifts from './Shifts'
import ShiftsFooter from './Shifts/footer'

import { loginPath, addZero, isProd, profilePath, aboutPath } from 'js_config'
import { ActionSheet, Toast, Dialog, QTabs, QTab } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      addNewOpen: false,
      search: '',
      logInView: null,
      editOpen: false,
      loadedActivity: null,
      selectedTab: 'tab-home',
      profileUrl: profilePath,
      aboutUrl: aboutPath
    }
  },
  components: {
    AddActivity,
    SingleActivity,
    HomeStatistics,
    HomeShifts,
    ShiftsFooter,
    QTabs,
    QTab
  },
  created () {
    console.log('home is created..', this.user)
    // Loading.show({
    //   delay: 0
    // })
    if (this.user) {
      this.fetchData()
    }
    this.welcomeMessage()
  },
  watch: {
    user (value) {
      console.log('user value changed in Home. logout??? ', value)
      if (!value) {
        this.$refs.mainLayout.hideCurrentSide(() => {
          this.$router.push({
            path: loginPath,
            query: {
              msg: 'goodbye'
            }
          })
        })
      }
      else {
        this.fetchData()
      }
    }
    // loading (value) {
    //   value ? Loading.show() : Loading.hide()
    // }
  },
  computed: {
    ...mapGetters(['user', 'loading', 'activities', 'singleActivity']),
    queryMsg () {
      return this.$route.query ? (this.$route.query.msg ? this.$route.query.msg : null) : null
    },
    currentMonth () {
      return this.months[(new Date()).getMonth()]
    },
    reverseAct () {
      return this.activities ? (this.activities).reverse() : null
    },
    displayedActivities () {
      return this.activities
    },
    isProduction () {
      return isProd()
    }
  },
  methods: {
    logout () {
      this.$auth.logUserOut()
        .then(() => {
          this.$router.push(loginPath)
        })
    },
    testActi () {
      console.log('testing activities...')
      this.$store.dispatch('loadActivities')
    },
    deleteActivity (act) {
      console.log('deleting ...: ', act)
      const vm = this
      Dialog.create({
        title: 'Warning',
        message: 'You are about to delete a log.',
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler () {
              console.log('from handler')
              vm.$store.dispatch('deleteActivity', act)
                .then(positive => {
                  Toast.create.positive({
                    html: 'Delete succeded!'
                  })
                })
                .catch(error => {
                  Toast.create.warning({
                    html: 'Delete failed!'
                  })
                  console.log(error)
                })
            }
          }
        ]
      })
    },
    editActivity (act) {
      console.log('updating ...: ', act)
      this.loadedActivity = act
      this.editOpen = true
    },
    annulateAct () {
      this.loadedActivity = null
    },
    fetchData () {
      console.log('fetching activities...')
      this.$store.dispatch('loadActivities')
    },
    welcomeMessage () {
      if (this.queryMsg === 'success') {
        Toast.create.positive({
          html: 'Welcome to using our App!',
          timeout: 4000
        })
      }
      setTimeout(() => {
        this.$router.replace(this.$route.path)
      }, 1000)
    },
    openActionSheet () {
      ActionSheet.create({
        title: 'First Action',
        actions: [
          {
            label: 'share',
            icon: 'share',
            handler: () => console.log('Share')
          },
          {
            label: 'delete',
            icon: 'delete',
            handler: () => console.log('Delete')
          }
        ],
        dismiss: {
          label: 'Cancel',
          icon: 'cancel',
          classes: 'text-primary',
          handler: () => console.log('cancel')
        }
      })
    },
    openLog (log) {
      console.log('clicked log: ', log)
      if (log) {
        this.logInView = log
        this.open = true
      }
      else {
        this.open = false
      }
    }
  },
  filters: {
    formattedDate (value) {
      const d = new Date(value)
      const day = addZero(d.getDate())
      const month = addZero(d.getMonth() + 1)
      const year = d.getFullYear()
      return `${day}.${month}.${year}`
    },
    formattedTime (value) {
      const t = new Date(value)
      const min = addZero(t.getMinutes())
      const h = addZero(t.getHours())
      return `${h}:${min}`
    },
    latestDates (value) {
      const newVal = value.split('-').reverse().join('-')
      const a = new Date(newVal)
      const day = addZero(a.getDate())
      const month = addZero(a.getMonth() + 1)
      const year = a.getFullYear()
      const d = a.toLocaleDateString()
      const b = new Date()
      const t = b.toLocaleDateString()
      const c = new Date()
      const oneday = (c.getDate() - 1)
      c.setDate(oneday)
      const y = c.toLocaleDateString()
      switch (d) {
        case t:
          return 'Today'
        case y:
          return 'Yesterday'
        default:
          return `${day}.${month}.${year}`
      }
    },
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
    },
    toTitleCase (val) {
      const a = (val.toLowerCase()).split('')
      a[0] = a[0].toUpperCase()
      const b = a.join('')
      return b
    }
  }
}
</script>
<style lang="scss" scoped>
  .q-tabs.fixed {
    z-index: 100;
  }
</style>
