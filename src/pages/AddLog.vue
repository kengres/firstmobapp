<template>
  <q-layout class="layout-padding">
    <q-card>
      <q-card-title>
        Adding a New Log
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-datetime v-model="logForm.date" type="date" float-label="Date" />
        <q-datetime format24h v-model="logForm.start" type="time" float-label="Start" />
        <q-datetime format24h v-model="logForm.lunchStart" type="time" float-label="Start Lunch" />
        <q-datetime format24h v-model="logForm.lunchEnd" type="time" float-label="End Lunch" />
        <q-datetime format24h v-model="logForm.end" type="time" float-label="End" />
      </q-card-main>
      <q-card-separator />
        <q-card-actions>
          <q-btn color="primary" @click="createLog">Save Log</q-btn>
        </q-card-actions>
    </q-card>
  </q-layout>  
</template>
<script>
import {
  Toast,
  QLayout,
  QBtn,
  QCard,
  QCardTitle,
  QCardActions,
  QCardSeparator,
  QDatetime,
  QCardMain
} from 'quasar'

export default {
  data () {
    return {
      logForm: {
        date: '',
        start: '',
        lunchStart: '',
        lunchEnd: '',
        end: ''
      }
    }
  },
  components: {
    QLayout,
    QBtn,
    QCard,
    QCardTitle,
    QCardActions,
    QCardSeparator,
    QDatetime,
    QCardMain
  },
  methods: {
    createLog () {
      const data = this.logForm
      for (const input in data) {
        if (data.hasOwnProperty(input)) {
          const element = data[input]
          if (element === '') {
            this.notifyMsg('No empty fields Allowed!')
            return
          }
        }
      }
      const newLog = {
        date: this.logForm.date,
        start: this.logForm.start,
        lunchStart: this.logForm.lunchStart,
        lunchEnd: this.logForm.lunchEnd,
        end: this.logForm.end
      }
      console.log('new log: ', newLog)
      console.log('form: ', this.logForm)
      this.$store.dispatch('createLog', data)
      this.$router.replace('/')
    },
    notifyMsg (msg) {
      Toast.create.warning({
        html: msg
      })
    },
    formatDate (value) {
      const date = new Date(value)
      if (typeof value === 'string') {
        let hours = value.match(/^(\d+)/)[1]
        const minutes = value.match(/:(\d+)/)[1]
        date.setHours(hours)
        date.setMinutes(minutes)
      }
      else {
        date.setHours(value.getHours())
        date.setMinutes(value.getMinutes())
      }
      return date
    }
  }
}
</script>

