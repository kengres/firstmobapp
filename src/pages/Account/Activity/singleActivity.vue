<template>
  <q-layout class="layout-padding">
    <q-card>
      <q-card-title>
        Update <span class="text-green">{{actDate}}</span>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-datetime 
            v-model="displayDate" 
            type="date" 
            float-label="Date"
            disable  />
        <q-datetime format24h v-model="activityForm.start" type="time" float-label="Start" />
        <q-datetime format24h v-model="activityForm.end" type="time" float-label="End" />
        <template v-for="(pause, i) in activityForm.pauses">
          <span :key="i">
            <q-datetime color="lime" format24h v-model="pause.start" type="time" float-label="Pause Start" />
            <q-datetime color="lime" format24h v-model="pause.end" type="time" float-label="Pause End" />
          </span>
        </template>
        <template v-if="showPause">
          <q-datetime color="lime" format24h v-model="pauseForm.start" type="time" float-label="Pause Start" />
          <q-datetime color="lime" format24h v-model="pauseForm.end" type="time" float-label="Pause End" />
          <q-btn small color="lime" @click="savePause">Save</q-btn>
          <q-btn small color="lime" @click="showPause = false">cancel</q-btn>
        </template>
        
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn color="green" @click="updateActivity">Save Log</q-btn>
        <q-btn color="tertiary" @click="testSingle">Test Log</q-btn>
      </q-card-actions>
      <q-fixed-position corner="bottom-right" :offset="[20, 10]">
        <p>
          <span style="margin-right:10px">Add a pause</span>
          <q-btn small round icon="add" color="lime" @click="showPause = true"/>
        </p>
      </q-fixed-position>
    </q-card>
  </q-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import { Toast } from 'quasar'
import { addZero, diffDate } from '../../../config'
export default {
  data () {
    return {
      showPause: false,
      pauseForm: {
        start: '',
        end: ''
      },
      activityForm: {
        start: '',
        end: '',
        pauses: []
      }
    }
  },
  created () {
    this.$store.dispatch('loadSingleActivity', this.actDate)
  },
  watch: {
    singleActivity (value) {
      value ? this.updateForm() : console.log(value)
    }
  },
  computed: {
    ...mapGetters(['user', 'singleActivity', 'activities']),
    actDate () {
      return this.$route.params.actDate
    },
    displayDate () {
      const a = this.$route.params.actDate
      const b = a.split('-').reverse().join('-')
      const d = new Date(b)
      d.setHours(0)
      return d
    }
  },
  methods: {
    testSingle () {
      console.log('all: ', this.activities)
      console.log('single: ', this.singleActivity)
    },
    updateForm () {
      console.log('all: ', this.activities)
      console.log('single: ', this.singleActivity)
      const pauses = this.singleActivity.pauses
      const newPauses = []
      for (const pause of pauses) {
        newPauses.push({
          duration: pause.duration,
          end: this.unFormatTime(pause.end),
          start: this.unFormatTime(pause.start)
        })
      }
      const newForm = {
        start: this.unFormatTime(this.singleActivity.start),
        end: this.unFormatTime(this.singleActivity.end),
        pauses: newPauses
      }
      this.activityForm = newForm
    },
    savePause () {
      console.log(this.pauseForm)
      const newPause = {
        start: this.pauseForm.start,
        end: this.pauseForm.end,
        duration: diffDate(this.pauseForm.end, this.pauseForm.start)
      }
      this.activityForm.pauses.push(newPause)
      this.showPause = false
      this.pauseForm = { start: '', end: '' }
    },
    formatTime (date) {
      const s = date
      const d = new Date(s)
      const h = addZero(d.getHours())
      const m = addZero(d.getMinutes())
      return `${h}:${m}`
    },
    unFormatTime (time) {
      const h = parseInt(time.split(':')[0])
      const m = parseInt(time.split(':')[1])
      const d = new Date()
      d.setHours(h)
      d.setMinutes(m)
      return d
    },
    updateActivity () {
      const data = this.activityForm
      for (const input in data) {
        if (data.hasOwnProperty(input)) {
          const element = data[input]
          if (element === '') {
            this.notifyMsg('No empty fields Allowed!')
            return
          }
        }
      }
      const pauses = []
      for (const pause of this.activityForm.pauses) {
        pauses.push({
          duration: diffDate(pause.end, pause.start),
          end: this.formatTime(pause.end),
          start: this.formatTime(pause.start)
        })
      }
      const newActivity = {
        date: this.actDate,
        start: this.formatTime(this.activityForm.start),
        end: this.formatTime(this.activityForm.end),
        duration: diffDate(this.activityForm.end, this.activityForm.start),
        pauses: pauses
      }
      console.log('new activity: ', newActivity)
      console.log('form: ', this.activityForm)
      this.$store.dispatch('updateActivity', newActivity)
      // notify of success
      // this.$router.replace('/')
    },
    notifyMsg (msg) {
      Toast.create.warning({
        html: msg
      })
    }
  },
  filters: {
    dateFriendly (value) {
      const d = new Date(value)
      const day = addZero(d.getDay())
      const month = addZero(d.getMonth())
      const year = d.getFullYear()
      return `${day}-${month}-${year}`
    }
  }
}
</script>
