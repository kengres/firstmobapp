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
              monday-first)
      q-item
        q-item-side
        q-item-main
          q-item-tile(color="green-9") Pause
      q-item
        q-item-side(icon="pause_circle_filled")
        q-item-main
          q-select(v-model="activityForm.pause" :options="dynamicPauses")
      //- q-item-separator
      q-item
        q-item-side
        q-item-main
          q-btn.on-left(color="green-9" @click="createActivity") save
          q-btn.on-right(color="warning" @click="$emit('cancel')") cancel
</template>
<script>
import { Toast } from 'quasar'
import { diffDate } from 'js_config'
export default {
  data () {
    return {
      activityForm: {
        range: {
          from: '',
          to: ''
        },
        pause: ''
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
      console.log('form: ', this.activityForm)
      const range = this.activityForm.range
      const newActivity = {
        date: this.activityForm.range.from.slice(0, 10),
        start: this.activityForm.range.from,
        end: this.activityForm.range.to,
        pause: this.activityForm.pause,
        duration: diffDate(range.from, range.to) - this.activityForm.pause
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
        html: msg
      })
    }
  }
}
</script>
