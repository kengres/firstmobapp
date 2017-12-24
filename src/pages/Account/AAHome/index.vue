<template>
  <q-layout ref="mainLayout" class="layout-padding"
      view="lHh Lpr fFf">
    <template v-if="!loading">
      <template v-if="activities && activities.length > 0">
        <q-list separator>
          <q-list-header inset>
            {{currentMonth}}
          </q-list-header>
          <q-item v-for="item in activities" :key="item.date">
            <q-item-side>
              <q-item-tile :color="item.duration < 600? 'green' : 'yellow'" icon="work" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>{{item.date}}</q-item-tile>
              <q-item-tile sublabel>{{item.start}} - {{item.end}}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-item-tile stamp>{{item.duration | hourMinFormat}}</q-item-tile>
              <q-item-tile stamp v-if="item.pauses && item.pauses.length > 0">
                Pause: {{item.pauses[0].duration}}min
              </q-item-tile>
              <q-item-tile stamp v-else>No Pause</q-item-tile>
            </q-item-side>
            <q-item-side right :ref="`target${item.date}`">
            <q-item-tile icon="more_vert">

              <q-popover :ref="`popover${item.date}`" anchor="top right" self="top right">
                <q-list separator>
                  <q-item @click="deleteActivity(item), $refs[`popover${item.date}`][0].close()">
                    Delete
                  </q-item>
                  <q-item @click="updateActivity(item), $refs[`popover${item.date}`][0].close()">
                    Edit
                  </q-item>
                </q-list>
              </q-popover>

            </q-item-tile>
          </q-item-side>
          </q-item>
        </q-list>
      </template>
      <q-list v-else>
        <q-item>
          Please add activities.
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile>To do so, click at the add button below.</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </template>

    <q-modal ref="minimizedModal" minimized v-model="open" 
      :content-css="{padding: '20px'}" v-if="logInView">
      <h4>Saturday</h4>
      <h5>{{logInView.date | formattedDate}}</h5>
      <h5>{{logInView.duration}}</h5>
      <p>Start: {{logInView.start | formattedTime}}</p>
      <p>End: {{logInView.end | formattedTime}}</p>
      <q-btn color="faded" icon="close" round
            @click="$refs.minimizedModal.close()"></q-btn>
    </q-modal>
    
    <q-fixed-position corner="bottom-right" :offset="[20, 10]">
        <q-btn round color="positive" @click="addNewActivity" icon="add" />
      </q-fixed-position>

    <q-fixed-position corner="bottom-left" :offset="[20, 20]" v-if="false">
      <q-btn round color="positive" icon="close" @click="testActi"/>
    </q-fixed-position>
    
    <q-toolbar slot="footer" color="faded">
      <q-toolbar-title>
        <p class="small">22 weekdays this month. (16 done)</p>
      </q-toolbar-title>
    </q-toolbar>

  </q-layout>
</template>
<script>
import avatar from 'assets/boy-avatar.jpg'
import { addActivityPath, loginPath, addZero } from '../../../config'
import { ActionSheet, Toast, Alert, Loading } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      avatar: avatar,
      logInView: null,
      open: false,
      totalTimeSpent: {
        hours: 30,
        min: 44
      },
      avarageTime: {
        hours: 10,
        min: 23
      }
    }
  },
  created () {
    Loading.show({
      delay: 0
    })
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
    },
    loading (value) {
      value ? Loading.show() : Loading.hide()
    },
    hideLeft (value) {
      console.log('hiding left value...', value)
      if (value) {
        this.$refs.mainLayout.hideCurrentSide(() => {
          console.log('closed')
        })
      }
      else {
        console.log('the value is false: ', value)
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'activities', 'loading', 'categories', 'catActivities']),
    queryMsg () {
      return this.$route.query ? (this.$route.query.msg ? this.$route.query.msg : null) : null
    },
    currentMonth () {
      return this.months[(new Date()).getMonth()]
    }
  },
  methods: {
    testActi () {
      this.$store.dispatch('loadActivities')
    },
    deleteActivity () {
      console.log('deleting ...')
      Alert.create({
        html: 'Coming soon!',
        color: 'warning',
        icon: 'face',
        position: 'right'
      })
    },
    updateActivity () {
      console.log('updating ...')
      Alert.create({
        html: 'Coming soon!',
        color: 'positive',
        icon: 'face',
        position: 'left'
      })
    },
    fetchData () {
      this.$store.dispatch('loadActivities')
    },
    welcomeMessage () {
      if (this.queryMsg === 'success') {
        Toast.create.positive({
          html: 'Welcome to using our App!',
          timeout: 4000
        })
        this.$router.replace(this.$route.path)
      }
    },
    addNewActivity () {
      this.$router.push({
        path: addActivityPath
      })
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
      const a = new Date(value)
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .layout-padding {
    max-height: 100vh;
  }
</style>
