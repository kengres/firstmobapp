<template>
  <q-layout class="layout-padding">
    <q-card>
      <q-card-title>
        Adding a New Log
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-select :options="categories" v-model="activityForm.category" float-label="Category"></q-select>
        <q-datetime v-model="activityForm.date" type="date" float-label="Date" />
        <q-datetime format24h v-model="activityForm.start" type="time" float-label="Start" />
        <q-datetime format24h v-model="activityForm.end" type="time" float-label="End" />
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn color="primary" @click="createActivity">Save Log</q-btn>
      </q-card-actions>
    </q-card>
  </q-layout>
</template>
<script>
import { Toast } from 'quasar'
export default {
  data () {
    return {
      activityForm: {
        category: '',
        date: '',
        start: '',
        end: ''
      },
      categories: [
        { label: 'Work', value: 'work' },
        { label: 'Sport', value: 'sport' },
        { label: 'Health', value: 'health' },
        { label: 'Sex', value: 'sex' }
      ]
    }
  },
  methods: {
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
      const newActivity = {
        date: this.activityForm.date,
        start: this.activityForm.start,
        end: this.activityForm.end,
        category: this.activityForm.category
      }
      console.log('new activity: ', newActivity)
      console.log('form: ', this.activityForm)
      this.$store.dispatch('createActivity', data)
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
