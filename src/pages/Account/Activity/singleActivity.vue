<template lang="pug">
  div(v-if="activity")
    q-list
      q-list-header
        h5.text-green-7 Edit Shift
      q-item
        q-item-side(icon="access_time" color="green-7")
        q-item-main
          q-item-tile(color="green-7") Start and End
      q-item
        q-item-side
        q-item-main
          q-datetime-range(
              color="green-7"
              format24h
              v-model="activityForm.range" 
              type="datetime"
              monday-first)
      q-item
        q-item-side(icon="pause_circle_filled" color="green-7")
        q-item-main
          q-item-tile(color="green-7") Pause
      q-item
        q-item-side
        q-item-main
          q-select(v-model="activityForm.pause" :options="dynamicPauses" color="green-7")
      q-item
        q-item-side
        q-item-main
          q-btn.on-left(color="green" @click="updateActivity") update
          q-btn.on-right(color="warning" @click="$emit('cancel', true)") cancel
</template>
<script>
import { Toast } from 'quasar'
import { diffDate } from 'js_config'
export default {
  props: ['activity'],
  data () {
    return {
      activityForm: {
        range: {
          from: this.activity.start,
          to: this.activity.end
        },
        pause: this.activity.pause
      }
    }
  },
  computed: {
    dynamicPauses () {
      const p = []
      for (let i = 10; i <= 100; i += 10) {
        p.push({
          label: `${i} min`,
          value: `${i}`
        })
      }
      return p
    }
  },
  methods: {
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
      console.log('form: ', this.activityForm)
      const range = this.activityForm.range
      const newActivity = {
        date: this.activityForm.range.from.slice(0, 10),
        start: this.activityForm.range.from,
        end: this.activityForm.range.to,
        pause: this.activityForm.pause,
        duration: diffDate(range.from, range.to) - this.activityForm.pause,
        id: this.activity.id
      }
      console.log('new activity: ', newActivity)
      this.$store.dispatch('updateActivity', newActivity)
      this.$emit('editComplete', true)
    },
    notifyMsg (msg) {
      Toast.create.warning({
        html: msg
      })
    }
  }
}
</script>
