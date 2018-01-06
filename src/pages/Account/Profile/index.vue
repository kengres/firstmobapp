<template lang="pug">
  q-card(v-if="user")
    q-card-media
      .profile
        img.profile_image(src="../../../assets/boy-avatar.jpg")
    q-card-title Name: {{user.last_name | toTitleCase}} {{user.first_name | toTitleCase}}
    q-card-main
      p Email: 
        span.text-faded kengres@mail.com
      p {{ user }}
  q-card.fixed-center(v-else)
    q-card-title Loading...
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['user'])
  },
  filters: {
    toTitleCase (val) {
      if (val) {
        const a = (val.toLowerCase()).split('')
        a[0] = a[0].toUpperCase()
        const b = a.join('')
        return b
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
    max-width: 500px;

    &_image {
      width: 100%;
      max-width: 100%;
      height: auto;
      border-radius: 50%;
    }
  }
</style>

