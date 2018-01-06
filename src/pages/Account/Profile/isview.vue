<template lang="pug">
  q-card(v-if="user")
    q-card-media
      .profile
        img.profile_image(src="../../../assets/boy-avatar.jpg" v-if="imageSrc")
        .profile_noimage.bg-green(v-else)
          span.absolute-center.text-white {{ user.first_name | firstLetter }} {{ user.last_name | firstLetter}}
    
    q-card-title Name: {{user.last_name | toTitleCase}} {{user.first_name | toTitleCase}}
    q-card-main
      p Email: 
        span.text-faded {{user.email}}
      //- p {{ user }}
    q-card-separator
    //- q-card-actions
    //-   q-btn.on-right(outline icon-right="edit" big) edit
  q-card.fixed-center(v-else)
    q-card-title Loading...
</template>
<script>
import { mapGetters } from 'vuex'
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .profile {
    margin: 0 auto;
    min-height: 50px;
    width: 60vw;
    min-width: 50px;
    max-width: 150px;

    &_image {
      width: 100%;
      max-width: 100%;
      height: auto;
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

