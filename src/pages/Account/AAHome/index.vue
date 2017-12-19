<template>
  <q-layout ref="mainLayout" class="layout-padding">
    <q-card>

      <q-item>
        <q-item-side :avatar="avatar" />
        <q-item-main>
          <q-item-tile label>Kenguruka</q-item-tile>
          <q-item-tile sublabel>Grevisse</q-item-tile>
        </q-item-main>
      </q-item>

      <q-card-title>
        Time spent at work.
      </q-card-title>
      <q-card-main>
        
        <q-list separator>
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
        
      </q-card-main>
    </q-card>


    <q-card separator>
      <q-card-title>
        Latest submits
      </q-card-title>
      <q-card-main>
        <q-list separator>
          <q-item v-for="log in displayLogs" :key="log.date" @click="openLog(log)">
            <q-item-side>
              <q-item-tile>{{log.date}} -- </q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-item-tile>{{log.duration}}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      <!-- <q-btn round icon="add" color="info" @click="testLogs"></q-btn> -->
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

    </q-card>

    <q-fixed-position corner="bottom-right" :offset="[20, 20]">
      <q-btn round color="positive" @click="addNewLog" icon="add" />
    </q-fixed-position>

  </q-layout>
</template>
<script>
import avatar from 'assets/boy-avatar.jpg'
import { diffDate, addZero, addActivityPath, loginPath } from '../../../config'
import { ActionSheet, Toast } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      avatar: avatar,
      logInView: null,
      open: false
    }
  },
  created () {
    this.$store.dispatch('loadLogs')
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
    }
  },
  computed: {
    ...mapGetters(['user', 'logs']),
    queryMsg () {
      return this.$route.query ? (this.$route.query.msg ? this.$route.query.msg : null) : null
    },
    displayLogs () {
      const newLogs = []
      for (const log of this.logs) {
        const block1 = diffDate(log.lunchStart, log.start)
        const block2 = diffDate(log.end, log.lunchEnd)
        const totalMin = block1 + block2
        const duration = `${addZero(Math.floor(totalMin / 60))}h ${addZero(totalMin % 60)}min`
        const displayLog = {
          duration,
          date: this.getTheDate(log.date),
          start: this.getTheTime(log.start),
          lunchStart: this.getTheTime(log.lunchStart),
          lunchEnd: this.getTheTime(log.lunchEnd),
          end: this.getTheTime(log.end)
        }
        newLogs.push(displayLog)
      }
      return newLogs
    },
    totalTimeSpent () {
      const logs = this.displayLogs
      let totalH = 0
      let totalM = 0
      if (logs) {
        for (const log of logs) {
          const h = parseInt(log.duration.slice(0, 2))
          totalH += h
          const m = parseInt(log.duration.slice(4, 6))
          totalM += m
        }
      }
      const plusH = Math.floor(totalM / 60)
      const newM = totalM % 60
      totalH += plusH

      return {hours: totalH, min: newM}
    },
    avarageTime () {
      if (this.logs && this.totalTimeSpent) {
        const l = this.logs.length
        const hours = Math.floor(this.totalTimeSpent.hours / l)
        const minutes = Math.floor((((this.totalTimeSpent.hours % l) * 60) + this.totalTimeSpent.min) / l)
        return {hours, min: minutes}
      }
    }
  },
  methods: {
    welcomeMessage () {
      if (this.queryMsg === 'success') {
        Toast.create.positive({
          html: 'Welcome to using our App!',
          timeout: 4000
        })
      }
    },
    addNewLog () {
      this.$router.push({
        path: addActivityPath
      })
    },
    getTheDate (value) {
      const d = new Date(value)
      const day = addZero(d.getDate())
      const month = addZero(d.getMonth() + 1)
      const year = d.getFullYear()
      return `${day}.${month}.${year}`
    },
    getTheTime (value) {
      const t = new Date(value)
      const min = addZero(t.getMinutes())
      const h = addZero(t.getHours())
      return `${h}:${min}`
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
  }
}
</script>
