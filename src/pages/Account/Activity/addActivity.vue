<template lang="pug">
  div
    q-list
      q-list-header
        h5.text-green-9 Create a Shift
      q-item
        q-item-side
        q-item-main
          q-item-tile(color="green-9") Select Start and End
      q-item
        q-item-side(icon="date_range")
        q-item-main
          q-datetime-range(
              format24h
              color="green-9"
              v-model="activityForm.range" 
              type="datetime"
              :default-from="defaultFrom"
              monday-first @change="handleDateChange")
      q-item
        q-item-side
        q-item-main
          q-item-tile(color="green-9") Pause
      q-item(v-if="!pauseInput")
        q-item-side(icon="pause_circle_filled")
        q-item-main
          q-select(v-model="activityForm.pause" radio color="green-9" 
            :options="dynamicPauses" @change="handleSelectPause")
      q-item(v-else)
        q-item-side(icon="pause_circle_filled")
        q-item-main
          q-input(v-model="activityForm.pause" color="green-9" :max-length="3" suffix="in min" autofocus)
      //- q-item-separator
      q-item
        q-item-side
        q-item-main
          q-btn.on-left(color="green-9" @click="createActivity") save
          q-btn.on-right(color="warning" @click="$emit('cancel')") cancel
</template>
<script>
import { Toast, date as QDate } from 'quasar'
import { diffDate, isEmpty, nextHours, addZero } from 'js_config'

const formattedString = (timeStamp) => QDate.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
export default {
  data () {
    return {
      activityForm: {
        range: {
          from: '',
          to: ''
        },
        pause: ''
      },
      pauseInput: false,
      defaultFrom: new Date()
    }
  },
  computed: {
    dynamicPauses () {
      const p = []
      for (let i = 10; i <= 80; i += 10) {
        p.push({
          label: `${i} min`,
          value: `${i}`
        })
      }
      p.push({
        label: 'Other',
        value: 'otherpausehereyo'
      })
      return p
    }
  },
  methods: {
    handleSelectPause (value) {
      console.log('select pause: ', value)
      if (value === 'otherpausehereyo') {
        this.activityForm.pause = ''
        this.pauseInput = true
      }
    },
    handleDateChange (value) {
      console.log('date range: ', value)
      if (value && value.from) {
        this.activityForm.range.from = formattedString(value.from)
        if (!value.to) {
          console.log('no value to')
          const next = formattedString(nextHours(new Date(value.from), 2))
          console.log('next hours 1: ', next)
          this.activityForm.range.to = next
        }
      }
      if (value && value.to) {
        if (!value.from) {
          console.log('no value from')
        }
      }
      if (value && value.from && value.to) {
        const completeDuration = diffDate(value.from, value.to)
        const pause = this.activityForm.pause
        console.log('complete duration: ', completeDuration)
        console.log('this pause: ', this.activityForm.pause)
        console.log('no pause added')
        if (completeDuration <= 120) {
          if (!pause || pause > 20) {
            this.activityForm.pause = '20'
          }
        }
        else if (completeDuration > 120 && completeDuration <= 480) {
          if (!pause) {
            this.activityForm.pause = '60'
          }
        }
        else if (completeDuration > 480) {
          console.log('duration sub a 480')
          this.pauseInput = true
          this.activityForm.pause = '100'
        }
      }
    },
    createActivity () {
      const data = this.activityForm
      const start = this.activityForm.range.from
      const end = this.activityForm.range.to
      const pause = this.activityForm.pause
      if (isEmpty(start)) {
        this.notifyMsg('Log start time is required!')
        return
      }
      if (isEmpty(end)) {
        this.notifyMsg('Log end is time required!')
        return
      }
      if (isEmpty(pause)) {
        this.notifyMsg('Pause duration is required!')
        return
      }
      console.log('form end: ', data)
      const date = new Date(start)
      const y = date.getFullYear()
      const m = addZero(date.getMonth() + 1)
      const d = addZero(date.getDate())

      const range = this.activityForm.range
      const newActivity = {
        date: `${y}-${m}-${d}`,
        start,
        end,
        pause,
        duration: diffDate(range.from, range.to) - pause
      }
      console.log('new activity: ', newActivity)
      this.$store.dispatch('createActivity', newActivity)
        .then(resp => {
          this.$emit('created')
        })
        .catch(error => console.log('error: ', error))
    },
    notifyMsg (msg) {
      Toast.create.warning({
        html: msg,
        color: 'green-9'
      })
    }
  }
}
</script>
