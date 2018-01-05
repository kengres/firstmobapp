<template lang="pug">
  q-layout.layout-padding
    q-card
      q-card-title Adding a New Log
      q-card-separator
      q-card-main
        q-datetime(
            v-model="activityForm.date" 
            type="date"
            float-label="Date"
            monday-first)
        q-select(v-model="activityForm.category" :options="categoriez" float-label="Category")
        q-datetime-range(format24h v-model="activityForm.range" type="time" float-label="Range")

      q-card-separator
      q-card-actions
        q-btn(round color="green" @click="createActivity" icon="check")
        q-btn(round color="green" icon="close" @click="$router.go(-1)")
</template>
<script>
import { mapGetters } from 'vuex'
import { Toast } from 'quasar'
import { addZero, diffDate } from 'js_config'
export default {
  data () {
    return {
      activityForm: {
        category: '',
        date: '',
        range: {
          from: '',
          to: ''
        }
      },
      categoriess: [
        { label: 'Work', value: 'work' },
        { label: 'Health', value: 'health' },
        { label: 'Sleep', value: 'sleep' }
      ]
    }
  },
  created () {
    if (this.user) {
      this.$store.dispatch('fetchCategories')
    }
  },
  computed: {
    ...mapGetters(['user', 'categories']),
    categoriez () {
      try {
        const a = []
        for (const cat of this.categories) {
          a.push({
            label: cat.name,
            value: cat.name,
            icon: cat.icon,
            color: cat.color
          })
        }
        console.log('cat: ', a)
        return a
      }
      catch (error) {
        return this.categoriess
      }
    }
  },
  methods: {
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
      const localISOTime = ((new Date(d - tzoffset)).toISOString()).slice(0, 10)
      const endTime = this.activityForm.range.to
      const startTime = this.activityForm.range.from
      const newActivity = {
        date: localISOTime,
        start: this.formatTime(startTime),
        end: this.formatTime(endTime),
        duration: diffDate(startTime, endTime),
        category: this.activityForm.category
      }
      console.log('new activity: ', newActivity)
      console.log('form: ', this.activityForm)
      // this.$store.dispatch('saveActivity', { act: newActivity, isProd: isProd() })
      // this.$router.replace('/')
    },
    notifyMsg (msg) {
      Toast.create.warning({
        html: msg
      })
    }
  }
}
</script>
