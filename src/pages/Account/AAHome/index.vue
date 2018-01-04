<template lang="pug">
  q-layout(ref="mainLayout" class="layout-padding" view="lHh Lpr fFf")
    template(v-if="!loading")
      template(v-if="activities && activities.length > 0")
        q-list(separator v-for="item in reverseAct" :key="item.date")
          q-list-header(inset) {{item.date | latestDates}}
          q-item(v-for="(act, i) in item.dateActivities" :key="i")
            q-item-side
              q-item-tile(:color="act.category.color" :icon="act.category.icon")
            q-item-main
              q-item-tile(label) {{act.category.name | toTitleCase}}
              q-item-tile(sublabel) For {{act.duration | hourMinFormat}}
            q-item-side(right)
              q-item-tile(stamp) {{act.start}} - {{act.end}}
              //- q-item-tile(stamp) {{act.duration | hourMinFormat}}
            q-item-side(right :ref="`target${i}`")
              q-item-tile(icon="more_vert")

                q-popover(:ref="`popover${i}`" anchor="top right" self="top right")
                  q-list(separator)
                    q-item(@click="updateActivity(act), $refs[`popover${i}`][0].close()")
                      q-icon(name="edit")
                      q-item-tile Edit
                    q-item(@click="deleteActivity(act), $refs[`popover${i}`][0].close()")
                      q-icon(name="delete")
                      q-item-tile Delete
      q-list(v-else-if="dbrows && dbrows.length > 0")
        q-item(v-for="(item, i) in dbrows" :key="i")
          q-item-main
            q-item-tile name
            q-item-tile duration
      q-list(v-else)
        q-item Please add activities.
        q-item
          q-item-main
            q-item-tile To do so, click at the add button below.

    //- <q-modal ref="minimizedModal" minimized v-model="open" 
    //-   :content-css="{padding: '20px'}" v-if="logInView">
    //-   <h4>Saturday</h4>
    //-   <h5>{{logInView.date | formattedDate}}</h5>
    //-   <h5>{{logInView.duration}}</h5>
    //-   <p>Start: {{logInView.start | formattedTime}}</p>
    //-   <p>End: {{logInView.end | formattedTime}}</p>
    //-   <q-btn color="faded" icon="close" round
    //-         @click="$refs.minimizedModal.close()"></q-btn>
    //- </q-modal>
    
    q-fixed-position(corner="bottom-right" :offset="[20, 10]")
      q-btn(round color="positive" @click="addNewActivity" icon="add")

    q-fixed-position(corner="bottom-left" :offset="[20, 20]")
      q-btn(round color="positive" icon="check" @click="testActi")
    
    //- <q-toolbar slot="footer" color="faded">
    //-   <q-toolbar-title>
    //-     <p class="small">22 weekdays this month. (16 done)</p>
    //-   </q-toolbar-title>
    //- </q-toolbar>
</template>
<script>
import avatar from 'assets/boy-avatar.jpg'
import { addActivityPath, loginPath, addZero, singleActivityPath, isProd } from 'js_config'
import { ActionSheet, Toast, Dialog } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      avatar: avatar,
      search: '',
      logInView: null,
      open: false,
      dbrows: null,
      totalTimeSpent: {
        hours: 30,
        min: 44
      },
      avarageTime: {
        hours: 10,
        min: 23
      }
    }
  },
  created () {
    console.log('home is created..', this.user)
    // Loading.show({
    //   delay: 0
    // })
    if (this.user) {
      this.fetchData()
    }
    this.welcomeMessage()
  },
  watch: {
    user (value) {
      console.log('user value changed in Home. logout??? ', value)
      if (!value) {
        this.$refs.mainLayout.hideCurrentSide(() => {
          this.$router.push({
            path: loginPath,
            query: {
              msg: 'goodbye'
            }
          })
        })
      }
      else {
        this.fetchData()
      }
    }
    // loading (value) {
    //   value ? Loading.show() : Loading.hide()
    // }
  },
  computed: {
    ...mapGetters(['user', 'loading', 'activities']),
    queryMsg () {
      return this.$route.query ? (this.$route.query.msg ? this.$route.query.msg : null) : null
    },
    currentMonth () {
      return this.months[(new Date()).getMonth()]
    },
    reverseAct () {
      return this.activities ? (this.activities).reverse() : null
    }
  },
  methods: {
    testActi () {
      if (isProd()) {
        const db = window.sqlitePlugin.openDatabase({name: 'userData.db', location: 'default'})
        db.executeSql('SELECT * FROM activitiesTable', [], (rs) => {
          alert('Record count: ' + rs.rows.length)
          const toAlert = JSON.stringify(rs.rows)
          alert(toAlert)
          this.dbrows = rs.rows
        }, function (error) {
          console.log('SELECT SQL statement ERROR: ' + JSON.stringify(error.message))
        })
      }
      else {
        const db = window.openDatabase('userData', '0.1', 'user data db', 2 * 1024 * 1024)
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM activitiesTable', [], (tx, rs) => {
            // letNotify('Record count: ' + rs.rows.length)
            this.dbrows = rs.rows
            console.log(rs.rows)
          }, function (tx, error) {
            console.log('SELECT error: ' + error.message)
          })
        })
      }
    },
    deleteActivity (act) {
      console.log('deleting ...: ', act)
      // const vm = this
      Dialog.create({
        title: 'Warning',
        message: 'You are about to delete a log.',
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler () {
              console.log('from handler')
              // vm.$store.dispatch('deleteActivity', act)
              //   .then(positive => {
              //     Toast.create.positive({
              //       html: 'Delete succeded!'
              //     })
              //   })
              //   .catch(error => {
              //     Toast.create.warning({
              //       html: 'Delete failed!'
              //     })
              //     console.log(error)
              //   })
            }
          }
        ]
      })
    },
    updateActivity (act) {
      console.log('updating ...: ', act)
      console.log('updating ...: ', singleActivityPath)
      this.$router.push({
        path: `${singleActivityPath}/${act.id}?date=${act.date}`
      })
    },
    fetchData () {
      console.log('fetching activities...')
      this.$store.dispatch('loadActivities')
    },
    welcomeMessage () {
      if (this.queryMsg === 'success') {
        Toast.create.positive({
          html: 'Welcome to using our App!',
          timeout: 4000
        })
        this.$router.replace(this.$route.path)
      }
    },
    addNewActivity () {
      this.$router.push({
        path: addActivityPath
      })
    },
    openActionSheet () {
      ActionSheet.create({
        title: 'First Action',
        actions: [
          {
            label: 'share',
            icon: 'share',
            handler: () => console.log('Share')
          },
          {
            label: 'delete',
            icon: 'delete',
            handler: () => console.log('Delete')
          }
        ],
        dismiss: {
          label: 'Cancel',
          icon: 'cancel',
          classes: 'text-primary',
          handler: () => console.log('cancel')
        }
      })
    },
    openLog (log) {
      console.log('clicked log: ', log)
      if (log) {
        this.logInView = log
        this.open = true
      }
      else {
        this.open = false
      }
    }
  },
  filters: {
    formattedDate (value) {
      const d = new Date(value)
      const day = addZero(d.getDate())
      const month = addZero(d.getMonth() + 1)
      const year = d.getFullYear()
      return `${day}.${month}.${year}`
    },
    formattedTime (value) {
      const t = new Date(value)
      const min = addZero(t.getMinutes())
      const h = addZero(t.getHours())
      return `${h}:${min}`
    },
    latestDates (value) {
      const newVal = value.split('-').reverse().join('-')
      const a = new Date(newVal)
      const day = addZero(a.getDate())
      const month = addZero(a.getMonth() + 1)
      const year = a.getFullYear()
      const d = a.toLocaleDateString()
      const b = new Date()
      const t = b.toLocaleDateString()
      const c = new Date()
      const oneday = (c.getDate() - 1)
      c.setDate(oneday)
      const y = c.toLocaleDateString()
      switch (d) {
        case t:
          return 'Today'
        case y:
          return 'Yesterday'
        default:
          return `${day}.${month}.${year}`
      }
    },
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
    },
    toTitleCase (val) {
      const a = (val.toLowerCase()).split('')
      a[0] = a[0].toUpperCase()
      const b = a.join('')
      return b
    }
  }
}
</script>
<style lang="scss" scoped>
  .layout-padding {
    max-height: 100vh;
  }
</style>
