<template>
  <div>
    <div class="maxwidth row">
      <div class="col-4 avatar">
        <img :src="avatar" />
      </div>
      <div class="col-8 labels">
        <div class="labels__title">Anonymous</div>
        <div class="labels__subtitle">User</div>
      </div>
      <div class="for-icon">
        <q-icon name="settings" style="font-size: 25px" />
      </div>
    </div>
    
    <q-list no-border link inset-delimiter>
    <q-item>
    </q-item>
    <q-item @click="launch(addActivityUrl)">
      <q-item-side icon="add_circle" />
      <q-item-main label="Add Activity" />
    </q-item>
    <q-item>
      <q-item-side icon="help" />
      <q-item-main label="F.A.Q" />
    </q-item>
    <q-item @click="logout">
      <q-item-side icon="exit_to_app" />
      <q-item-main label="Logout" />
    </q-item>
  </q-list>
  </div>
</template>
<script>
import avatar from 'assets/boy-avatar.jpg'
import { addActivityPath } from '../config'
export default {
  data () {
    return {
      addActivityUrl: addActivityPath,
      avatar: avatar
    }
  },
  methods: {
    launch (path) {
      console.log('launch...')
      this.$router.push({path: path})
      this.$store.dispatch('setHideLeft', true)
    },
    logout () {
      this.$auth.logUserOut()
        .then(resp => {
          this.$store.dispatch('setUser', null)
        })
    }
  }
}
</script>
<style lang="scss">
  .maxwidth {
    min-height: 100px;
    padding: 20px;
    position: relative;

    .for-icon {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    
    img {
      max-width: 100%;
      width: 100%;
      height: auto;
      border-radius: 50%;
    }

    .labels {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 2;
      padding-left: 10px;
      font-size: 24px;

      &__title {
        font-size: .75em;
      }
      &__subtitle {
        font-size: .65em;
      }
    }
  }
</style>

