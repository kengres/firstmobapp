<template lang="pug">
  q-list
    q-list-header
      h5 Statistics 
      h6 {{ len }} activities
      h6 Average: {{ average | hourMinFormat }}
    q-item
      q-item-side
        q-item-tile Total Time:
        q-item-tile {{ total | hourMinFormat }}
      q-item-main
        q-knob(v-model="totalHours" :min="week.min" :max="week.max" 
          readonly color="green")
    q-item
      q-item-main
        stat-chart(:chartData="chartData" :options="options")
    

</template>
<script>
import { mapGetters } from 'vuex'
import { QKnob } from 'quasar'
import StatChart from './chart'
export default {
  data () {
    return {
      week: {
        min: 36,
        max: 45
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            barThicknes: 10
          }]
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      }
    }
  },
  components: {
    StatChart,
    QKnob
  },
  computed: {
    ...mapGetters(['activities']),
    total () {
      let t = 0
      for (const item of this.activities) {
        t += item.duration
      }
      return t
    },
    totalHours () {
      return parseFloat((this.total / 60).toFixed(2))
    },
    len () {
      return this.activities.length
    },
    average () {
      return Math.ceil(this.total / this.len)
    },
    dynamicChartData () {
      const labels = []
      const data = []
      for (const item of this.activities) {
        const label = (item.date.slice(5)).split('-').reverse().join('-').replace('-', '/')
        labels.unshift(label)
        data.unshift(item.duration)
      }
      return {
        labels,
        data
      }
    },
    chartData () {
      return {
        labels: this.dynamicChartData.labels,
        datasets: [
          {
            label: 'January Shifts',
            backgroundColor: 'green',
            data: this.dynamicChartData.data
          }
        ]
      }
    }
  },
  filters: {
    hourMinFormat (value) {
      const h = Math.floor(value / 60)
      const m = value % 60
      if (h === 0) {
        return `${m}min`
      }
      else if (m === 0) {
        return `${h}h`
      }
      return `${h}h ${m}min`
    }
  }
}
</script>
<style lang="scss" scoped>
  .q-list {
    padding-bottom: 70px;
  }
</style>
