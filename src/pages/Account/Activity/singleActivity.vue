<template>
  <q-layout class="layout-padding">
    <q-card>
      <q-card-title>
        Adding a New Log
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-datetime v-model="actDate" type="date" float-label="Date" />
        <q-datetime format24h v-model="activityForm.start" type="time" float-label="Start" />
        <q-datetime format24h v-model="activityForm.end" type="time" float-label="End" />
         
        <template v-if="showPause">
          <q-datetime color="lime" format24h v-model="pauseForm.start" type="time" float-label="Pause Start" />
          <q-datetime color="lime" format24h v-model="pauseForm.end" type="time" float-label="Pause End" />
          <q-btn small color="lime" @click="savePause">Save</q-btn>
          <q-btn small color="lime" @click="showPause = false">cancel</q-btn>
        </template>
        
        {{actDate}}
      </q-card-main>
      <q-card-separator />
      <q-card-actions v-if="!showPause">
        <q-btn color="green" @click="createActivity">Save Log</q-btn>
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
  computed: {
    ...mapGetters(['user']),
    actDate () {
      const a = this.$route.params.actDate
      const b = a.split('-').reverse().join('-')
      const d = new Date(b)
      d.setHours(0)
      return d
    }
  },
  methods: {
    savePause () {
      console.log(this.pauseForm)
      const newPause = {
        start: this.formatTime(this.pauseForm.start),
        end: this.formatTime(this.pauseForm.end),
        duration: diffDate(this.pauseForm.end, this.pauseForm.start)
      }
      this.activityForm.pauses.push(newPause)
      this.showPause = false
    },
    formatTime (date) {
      const s = date
      const d = new Date(s)
      const h = addZero(d.getHours())
      const m = addZero(d.getMinutes())
      return `${h}:${m}`
    },
    createActivity () {
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
      console.log('form date: ', this.activityForm.date)
      const tzoffset = (new Date()).getTimezoneOffset() * 60000
      const d = (new Date(this.activityForm.date)).getTime()
      const localISOTime = (((new Date(d - tzoffset)).toISOString()).slice(0, 10)).split('-').reverse().join('-')

      const newActivity = {
        date: localISOTime,
        start: this.formatTime(this.activityForm.start),
        end: this.formatTime(this.activityForm.end),
        pauses: this.activityForm.pauses,
        duration: diffDate(this.activityForm.end, this.activityForm.start)
      }
      console.log('new activity: ', newActivity)
      console.log('form: ', this.activityForm)
      this.$store.dispatch('addActivity', newActivity)
      this.$router.replace('/')
    },
    notifyMsg (msg) {
      Toast.create.warning({
        html: msg
      })
    }
  }
}
</script>
