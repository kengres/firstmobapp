<template>
  <q-layout ref="mainLayout" class="layout-padding"
      view="lHh Lpr fFf">
    <template v-if="!loading">
      <q-list separator v-if="todayActivities.length > 0">
        <q-list-header inset color="positive">
          Today
        </q-list-header>
        <q-item v-for="item in todayActivities" :key="item.id">
          <q-item-side>
            <q-item-tile color="amber" icon="directions_run" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label v-if="totalTimeSpent">{{totalTimeSpent.hours}}h {{totalTimeSpent.min}}min</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile stamp>spent on</q-item-tile>
            <q-item-tile>{{item.category}}</q-item-tile>
          </q-item-side>
        </q-item>
      </q-list>
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

    <q-list separator v-if="activities && activities.length > 0">
      <q-list-header inset>
        Yesterday
      </q-list-header>
      <q-item v-for="item in activities" :key="item.id" @click="openLog(item)">
        <q-item-side>
          <q-item-tile color="amber" icon="work"/>
        </q-item-side>
        <q-item-main>
          <q-item-tile>30h 44min</q-item-tile>
        </q-item-main>
        <q-item-side right>
          <q-item-tile stamp>spent on</q-item-tile>
          <q-item-tile>{{item.category}} </q-item-tile>
        </q-item-side>
      </q-item>
    </q-list>

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

    <q-fixed-position corner="bottom-left" :offset="[20, 20]">
        <q-btn round color="positive" @click="testFiltering" icon="close" />
      </q-fixed-position>
    <q-fixed-position corner="bottom-left" :offset="[90, 20]">
        <q-btn round color="positive" @click="testFiltering2" icon="thumb_up" />
      </q-fixed-position>
    
    <q-toolbar slot="footer" color="faded">
      <q-toolbar-title>
        This is footer
      </q-toolbar-title>
    </q-toolbar>

  </q-layout>
</template>
<script>
import avatar from 'assets/boy-avatar.jpg'
import { addActivityPath, loginPath, addZero } from '../../../config'
import { ActionSheet, Toast, Loading } from 'quasar'
import { mapGetters } from 'vuex'
import * as firebase from 'firebase/app'
// import 'firebase/auth'
import 'firebase/database'

export default {
  name: 'home',
  data () {
    return {
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
    this.fetchData()
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
    ...mapGetters(['user', 'activities', 'loading', 'categories']),
    queryMsg () {
      return this.$route.query ? (this.$route.query.msg ? this.$route.query.msg : null) : null
    },
    todayActivities () {
      const d = new Date()
      const todayDate = d.toLocaleDateString()
      return this.activities.filter(act => {
        return act.date === todayDate
      })
    }
    // displayLogs () {
    //   const newLogs = []
    //   for (const log of this.logs) {
    //     const block1 = diffDate(log.lunchStart, log.start)
    //     const block2 = diffDate(log.end, log.lunchEnd)
    //     const totalMin = block1 + block2
    //     const duration = `${addZero(Math.floor(totalMin / 60))}h ${addZero(totalMin % 60)}min`
    //     const displayLog = {
    //       duration,
    //       date: this.getTheDate(log.date),
    //       start: this.getTheTime(log.start),
    //       lunchStart: this.getTheTime(log.lunchStart),
    //       lunchEnd: this.getTheTime(log.lunchEnd),
    //       end: this.getTheTime(log.end)
    //     }
    //     newLogs.push(displayLog)
    //   }
    //   return newLogs
    // },
    // totalTimeSpent () {
    //   const logs = this.displayLogs
    //   let totalH = 0
    //   let totalM = 0
    //   if (logs) {
    //     for (const log of logs) {
    //       const h = parseInt(log.duration.slice(0, 2))
    //       totalH += h
    //       const m = parseInt(log.duration.slice(4, 6))
    //       totalM += m
    //     }
    //   }
    //   const plusH = Math.floor(totalM / 60)
    //   const newM = totalM % 60
    //   totalH += plusH

    //   return {hours: totalH, min: newM}
    // },
    // avarageTime () {
    //   if (this.logs && this.totalTimeSpent) {
    //     const l = this.logs.length
    //     const hours = Math.floor(this.totalTimeSpent.hours / l)
    //     const minutes = Math.floor((((this.totalTimeSpent.hours % l) * 60) + this.totalTimeSpent.min) / l)
    //     return {hours, min: minutes}
    //   }
    // }
  },
  methods: {
    testFiltering () {
      // console.log('joins: ', this.categories)
      const rootRef = firebase.database().ref()
      const actRef = rootRef.child('activities/' + this.user.id)
      const catRef = rootRef.child('categories/' + this.user.id)
      catRef.on('child_added', snap => {
        // console.log(snap.key)
        catRef.child(snap.key).child('activities').on('child_added', childSnap => {
          // console.log(childSnap.key)
          actRef.child(childSnap.key).once('value')
            .then(finalSnap => console.log('final: ', finalSnap.val()))
            .catch(error => console.log(error))
        })
      })
    },
    testFiltering2 () {
      console.log('user id: ', this.user.id)
      firebase.database().ref('activities').child(this.user.id).on('child_added', snap => {
        console.log(snap.val())
      })
    },
    fetchData () {
      if (this.user) {
        this.$store.dispatch('loadActivities')
        this.$store.dispatch('fetchCategories')
      }
      else {
        console.log('there is no user in home????')
      }
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
    // getTheTime (value) {
    //   const t = new Date(value)
    //   const min = addZero(t.getMinutes())
    //   const h = addZero(t.getHours())
    //   return `${h}:${min}`
    // },
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .layout-padding {
    max-height: 100vh;
  }
</style>
