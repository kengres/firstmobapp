<template lang="pug">
  q-card(v-if="user")
    q-card-media.bg-green-8
      .profile
        img.profile_image(:src="user.photoUrl" v-if="user.photoUrl")
        .profile_noimage.bg-green(v-else)
          span.absolute-center.text-white {{ user.first_name | firstLetter }} {{ user.last_name | firstLetter}}
    
    q-card-title Name: 
      span.text-green-8 {{user.last_name | toTitleCase}} {{user.first_name | toTitleCase}}
    q-card-main
      p Email: 
        span.text-faded.text-green-8 {{user.email}}
      p Registered: 
        span.text-faded.text-green-8 {{user.created_at | friendlyDate}} - 
          span(style="font-size: 12px") {{user.created_at | friendlyTime}}
      //- p {{ user }}
    q-card-separator
    //- q-card-actions
    //-   q-btn.on-right(outline icon-right="edit" big) edit
  q-card.fixed-center(v-else)
    q-card-title Loading...
</template>
<script>
import { mapGetters } from 'vuex'
import { addZero } from 'js_config'
export default {
  data () {
    return {
      imageSrc: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    changeAvatar () {
      console.log('changing avatar...')
    }
  },
  filters: {
    toTitleCase (val) {
      if (val) {
        const a = (val.toLowerCase()).split('')
        a[0] = a[0].toUpperCase()
        const b = a.join('')
        return b
      }
    },
    firstLetter (val) {
      if (val) {
        const a = (val.toLowerCase()).split('')
        return a[0].toUpperCase()
      }
    },
    friendlyDate (val) {
      if (val) {
        const d = new Date(parseInt(val))
        const day = addZero(d.getDate())
        const month = addZero(d.getMonth() + 1)
        const year = d.getFullYear()
        return `${day}.${month}.${year}`
      }
      return 'unknown'
    },
    friendlyTime (val) {
      if (val) {
        const d = new Date(parseInt(val))
        const hour = addZero(d.getHours())
        const min = addZero(d.getMinutes())
        return `${hour}:${min}`
      }
      return 'unknown'
    }
  }
}
</script>
<style lang="scss" scoped>
  $pd: 10px;
  .profile {
    padding: $pd 0;
    margin: 0 auto;
    width: 120px;
    height: calc(120px + #{2 * $pd});

    @media(min-width: 320px){
      width: 150px;
      height: calc(150px + #{2 * $pd});
    }
    @media(min-width: 350px){
      width: 170px;
      height: calc(170px + #{2 * $pd});
    }

    &_image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    &_noimage {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      position: relative;
      font-size: 30px;
      font-weight: 500;
    }
  }
</style>

