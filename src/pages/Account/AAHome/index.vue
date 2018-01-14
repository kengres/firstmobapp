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
              h5(v-for="(month, i) in $t('app.months')")
                span(v-if="i == currentMonth") {{ month }}
             
            q-item(v-for="item in displayedActivities" :key="item.id")
              q-item-side
                q-item-tile(color="green" icon="work")
              q-item-main(@click="viewSingleShift(item)")
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


      q-modal(ref="singleLogModal" minimized v-model="singleOpen" 
        :content-css="{padding: '20px'}" v-if="shiftInView")

        .bg-green.relative-position
          q-btn.absolute-top-right(small color="red-10" icon="close" round
          @click="$refs.singleLogModal.close()")
        q-list(no-border)
          q-list-header
            h5 {{ shiftInView.date | formattedDate }}
          q-item
            q-item-side Start:
            q-item-main
              q-item-tile {{ shiftInView.start | formattedTime }}
          q-item
            q-item-side End:
            q-item-main
              q-item-tile {{ shiftInView.end | formattedTime }}
          q-item
            q-item-side Pause:
            q-item-main
              q-item-tile {{ shiftInView.pause | hourMinFormat }}
          q-item
            q-item-side Duration:
            q-item-main
              q-item-tile {{ shiftInView.duration | hourMinFormat }}
        
      
      q-fixed-position(corner="bottom-right" :offset="[20, 10]")
        q-btn(round color="primary" @click="addNewOpen = true" icon="add")

      q-fixed-position(corner="bottom-left" :offset="[20, 20]")
        q-btn(round color="primary" icon="fiber_new" @click="createDb")

      q-fixed-position(corner="bottom-left" :offset="[80, 20]")
        q-btn(round color="primary" @click="readTable" icon="chrome_reader_mode")

      q-fixed-position(corner="bottom-left" :offset="[150, 20]")
        q-btn(round color="primary" @click="addData" icon="face")

      
      //- footers
      q-toolbar(slot="footer" color="green-10" v-if="selectedTab === 'tab-shifts'")
        shifts-footer
      
      q-modal(ref="addNewModal" v-model="addNewOpen" position="left")
        add-activity(@created="addNewOpen = false" @cancel="addNewOpen = false")
      
      template(v-if="loadedActivity && editOpen")
        q-modal(ref="editLogModal" v-model="editOpen" position="right" 
                @close="annulateAct")
          single-activity(:activity="loadedActivity" 
              v-on:editComplete="closeEditModal" v-on:cancel="closeEditModal")
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
      addNewOpen: false,
      search: '',
      shiftInView: null,
      editOpen: false,
      loadedActivity: null,
      selectedTab: 'tab-home',
      profileUrl: profilePath,
      aboutUrl: aboutPath,
      singleOpen: false
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
    console.log('home is created..')
    this.welcomeMessage()
  },
  watch: {
    user (value) {
      console.log('user value changed in Home. logout??? ', value)
      if (!value) {
        this.$router.push({
          path: loginPath,
          query: {
            msg: 'goodbye'
          }
        })
      }
      else {
        this.fetchData()
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'loading', 'activities', 'singleActivity', 'netWorkConnection']),
    queryMsg () {
      return this.$route.query ? (this.$route.query.msg ? this.$route.query.msg : null) : null
    },
    currentMonth () {
      return (new Date()).getMonth()
    },
    displayedActivities () {
      if (this.activities) {
        return this.activities.sort((a, b) => {
          return a.date > b.date ? -1 : (a.date < b.date ? 1 : 0)
        })
      }
      else {
        return null
      }
    },
    isProduction () {
      return isProd()
    }
  },
  methods: {
    createDb () {
      const openReq = window.indexedDB.open('newdemo', 1)
      openReq.onupgradeneeded = function (event) {
        const db = event.target.result
        db.createObjectStore('activities', {autoIncrement: true})
      }
      openReq.onsuccess = function (event) {
        const db = event.target.result,
          activity = {
            start: '10:00',
            end: '19:00',
            date: new Date(),
            pause: 40
          }
        this.addData(activity)
      }
      openReq.onerror = function (event) {
        console.log('Operation failed')
      }
    },
    readTable () {
      console.log('reading table')
    },
    addData (activity) {
      console.log('adding some data')
      const addReq = db.transaction('activities', 'readwrite').objectStore('activities').add(activity)
        addReq.onsuccess = function (event) {
          console.log('Operation completed successfully')
        }
        addReq.onerror = function (event) {
          console.log('Operation failed')
        }
    },
    closeEditModal (payload) {
      console.log('closing edit modal...: ', payload)
      console.log('loaded acti...: ', this.loadedActivity)
      this.editOpen = !payload
    },
    isupdating (payload) {
      console.log('is updating...: ', payload)
    },
    viewSingleShift (shift) {
      console.log('clicked shift...', shift)
      if (shift) {
        this.shiftInView = shift
        this.singleOpen = true
      }
      else {
        this.singleOpen = false
      }
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
              vm.$store.dispatch('deleteActivity', act)
            }
          }
        ]
      })
    },
    editActivity (act) {
      this.loadedActivity = act
      this.editOpen = true
    },
    annulateAct () {
      this.loadedActivity = null
    },
    fetchData () {
      console.log('fetching activities from home... user: ', this.user)
      this.$store.dispatch('loadActivities')
    },
    welcomeMessage () {
      if (this.queryMsg === 'success') {
        Toast.create.info({
          html: 'Thank you for choosing Work Time Manager App! We hope you enjoy it!',
          timeout: 6000
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
