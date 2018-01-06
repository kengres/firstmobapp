<template lang="pug">
  div
    q-list
      q-list-header
        h5 Edit Shift
      q-item
        q-item-side(icon="access_time")
        q-item-main
          q-item-tile Start and End
      q-item
        q-item-side
        q-item-main
          q-datetime-range(
              v-model="activityForm.range" 
              type="datetime"
              monday-first)
      q-item
        q-item-side(icon="pause_circle_filled")
        q-item-main
          q-item-tile Pause
      q-item
        q-item-side
        q-item-main
          q-select(v-model="activityForm.pause" :options="dynamicPauses")
      q-item
        q-item-side
        q-item-main
          q-btn(color="green" @click="updateActivity") update
</template>
<script>
import { Toast } from 'quasar'
import { diffDate } from '../../../config'
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
        .then((resp) => {
          console.log('update promise: ', resp)
          this.$emit('updated')
        })
    },
    notifyMsg (msg) {
      Toast.create.warning({
        html: msg
      })
    }
  }
}
</script>
