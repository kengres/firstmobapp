<template lang="pug">
  q-layout.layout-padding
    q-card(v-if="!loading")
      q-card-title Update 
        span.text-green {{actDate}}
      q-card-separator
      q-card-main(v-if="singleActivity")
        q-datetime(v-model="displayDate" 
            type="date" 
            float-label="Date"
            disable)
        q-select(v-model="activityForm.category" :options="categoriez" float-label="Category")
        q-datetime(format24h v-model="activityForm.start" type="time" float-label="Start")
        q-datetime(format24h v-model="activityForm.end" type="time" float-label="End")
        template(v-for="(pause, i) in activityForm.pauses")
          span(:key="i")
            q-datetime(color="lime" format24h v-model="pause.start" type="time" float-label="Pause Start")
            q-datetime(color="lime" format24h v-model="pause.end" type="time" float-label="Pause End")
        
      q-card-separator
      q-card-actions
        q-btn(color="green" @click="updateActivity") Save Log
        q-btn(color="tertiary" @click="testSingle") Test Log
      q-fixed-position(corner="bottom-right" :offset="[20, 10]")
        p
          span( style="margin-right:10px" ) Add a pause
          q-btn(small round icon="add" color="lime" @click="showPause = true")
</template>
<script>
import { mapGetters } from 'vuex'
import { Toast, Loading } from 'quasar'
import { addZero, diffDate } from '../../../config'
export default {
  data () {
    return {
      activityForm: {
        start: '',
        end: '',
        category: ''
      }
    }
  },
  beforRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('fetchCategories')
    })
  },
  created () {
    console.log('query: ', this.$route.query)
    console.log('params: ', this.$route.params)
    Loading.show({
      delay: 0
    })
    if (this.user) {
      this.$store.dispatch('loadSingleActivity', { id: this.actId, date: this.actDate })
    }
  },
  watch: {
    user (value) {
      value ? this.$store.dispatch('loadSingleActivity', { id: this.actId, date: this.actDate }) : console.log('')
    },
    singleActivity (value) {
      value ? this.updateForm() : console.log(value)
    },
    loading (value) {
      value ? Loading.show() : Loading.hide()
    }
  },
  computed: {
    ...mapGetters(['user', 'loading', 'singleActivity', 'categories', 'activities']),
    actId () {
      return this.$route.params.id
    },
    actDate () {
      return this.$route.query.date
    },
    displayDate () {
      const a = this.$route.query.date
      const b = a.split('-').reverse().join('-')
      const d = new Date(b)
      d.setHours(0)
      return d
    },
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
        return []
      }
    }
  },
  methods: {
    testSingle () {
      console.log('all: ', this.categories)
      console.log('single: ', this.singleActivity)
    },
    updateForm () {
      console.log('all: ', this.categories)
      console.log('single: ', this.singleActivity)
      const newForm = {
        start: this.unFormatTime(this.singleActivity.start),
        end: this.unFormatTime(this.singleActivity.end),
        category: this.singleActivity.category
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
      this.$router.replace('/')
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
