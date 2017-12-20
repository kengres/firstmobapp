<template>
  <q-layout ref="mainLayout" class="layout-padding">
    <q-card>

      <q-item>
        <q-item-side :avatar="avatar" />
        <q-item-main v-if="user">
          <q-item-tile label>{{user.last_name}}</q-item-tile>
          <q-item-tile sublabel>{{user.first_name}}</q-item-tile>
        </q-item-main>
        <q-item-main v-else>
          <q-item-tile label>Anonymous</q-item-tile>
          <q-item-tile sublabel>User</q-item-tile>
        </q-item-main>
      </q-item>

      <q-card-title>
        Time spent at work.
      </q-card-title>
      <q-card-main v-if="!loading">
        
        <q-list separator v-if="activities && activities.length > 0">
          <q-item>
            <q-item-side>
              <q-item-tile color="primary" icon="access_time" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label v-if="totalTimeSpent">Total Time: {{totalTimeSpent.hours}}h {{totalTimeSpent.min}}min</q-item-tile>
              <q-item-tile label v-else>Total Time: unknown</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile color="primary" icon="av_timer" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label v-if="avarageTime">Avarage: {{avarageTime.hours}}h {{avarageTime.min}}min</q-item-tile>
              <q-item-tile label v-else>Avarage: unknown</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
        
        <div v-else>
          Please add activities
        </div>
      </q-card-main>
    </q-card>


    <q-card separator>
      <q-card-title>
        Latest submits
      </q-card-title>
      <q-card-main v-if="activities">
        <q-list separator v-if="activities.length > 0">
          <q-item v-for="item in activities" :key="item.id" @click="openLog(item)">
            <q-item-side>
              <q-item-tile>{{item.category}} -- </q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-item-tile>{{ item.date | formattedDate }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
        <div v-else>
          Empty activities
        </div>
      <!-- <q-btn round icon="add" color="info" @click="testLogs"></q-btn> -->
      </q-card-main>

      <q-card-main v-else>
        there are no activities
      </q-card-main>

      <q-modal ref="minimizedModal" minimized v-model="open" 
        :content-css="{padding: '20px'}" v-if="logInView">
        <h4>Saturday</h4>
        <h5>{{logInView.date}}</h5>
        <h5>{{logInView.duration}}</h5>
        <p>Start: {{logInView.start}}</p>
        <p>Lunch Start: {{logInView.lunchStart}}</p>
        <p>Lunch End: {{logInView.lunchEnd}}</p>
        <p>End: {{logInView.end}}</p>
        <q-btn color="faded" icon="close" round
             @click="$refs.minimizedModal.close()"></q-btn>
      </q-modal>

      <q-fixed-position corner="bottom-right" :offset="[20, 20]">
        <q-btn round color="positive" @click="addNewActivity" icon="add" />
      </q-fixed-position>
    </q-card>
    <q-fixed-position corner="bottom-left" :offset="[20, 20]">
        <q-btn round color="positive" @click="testFirebase" icon="close" />
      </q-fixed-position>
  </q-layout>
</template>
<script>
import avatar from 'assets/boy-avatar.jpg'
import { addActivityPath, loginPath, addZero } from '../../../config'
import { ActionSheet, Toast, Loading } from 'quasar'
import { mapGetters } from 'vuex'
// import * as firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/database'

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
    ...mapGetters(['user', 'activities', 'loading', 'hideLeft']),
    queryMsg () {
      return this.$route.query ? (this.$route.query.msg ? this.$route.query.msg : null) : null
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
    testFirebase () {
      console.log('test hideleft: ', this.hideLeft)
    },
    fetchData () {
      if (this.user) {
        this.$store.dispatch('loadActivities')
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .layout-padding {
    max-height: 100vh;
  }
</style>
