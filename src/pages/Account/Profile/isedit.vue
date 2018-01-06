<template lang="pug">
  q-card(v-if="user")
    q-card-media.bg-green-8
      .profile
        img.profile_image(:src="userPhotoUrl" v-if="userPhotoUrl")
        .profile_noimage.bg-green(v-else)
          span.absolute-center.text-white {{ user.first_name | firstLetter }} {{ user.last_name | firstLetter}}
      .text-center.text-white
        q-btn(flat @click="openModalAvatar") change avatar
    q-card-main
      q-field()
        q-input(v-model="userForm.first_name" float-label="First Name")
      q-field()
        q-input(v-model="userForm.last_name" float-label="Last Name")
      //- q-field()
      //-   q-input(v-model="userForm.userName" float-label="UserName")
      q-field()
        q-input(v-model="userForm.email" float-label="Email")
    
    q-card-separator
    q-card-actions
      q-btn.on-right(outline color="green" icon-right="check") save
      q-btn.on-right(outline color="warning" icon-right="close" @click="cancelEdit") cancel
    
    q-modal(ref="avatarModal" v-model="avatarModalOpen" position="bottom"
            :content-css="{padding: '20px', width: '100vw'}")
      input(type="file" @change="handleChange")
      q-btn.float-right(round icon="cloud" color="green" @click="uploadAvatar")
  q-card.fixed-center(v-else)
    q-card-title Loading...
</template>
<script>
import { mapGetters } from 'vuex'
import { QUploader } from 'quasar'
export default {
  data () {
    return {
      avatar: '',
      imageSrc: false,
      userForm: {
        first_name: '',
        last_name: '',
        userName: '',
        email: ''
      }
    }
  },
  components: {
    QUploader
  },
  created () {
    this.updateForm()
  },
  computed: {
    ...mapGetters(['user', 'avatarModalOpen', 'userPhotoUrl'])
  },
  methods: {
    updateForm () {
      console.log('update form... ', this.user)
      this.userForm.first_name = this.user.first_name
      this.userForm.last_name = this.user.last_name
      this.userForm.userName = this.user.userName ? this.user.userName : ''
      this.userForm.email = this.user.email
    },
    cancelEdit () {
      this.$store.dispatch('setEditMode', false)
    },
    openModalAvatar () {
      this.$store.dispatch('setAvatarModalOpen', true)
    },
    handleChange (e) {
      const file = e.target.files[0]
      this.avatar = file
      console.log('file changed...', file)
    },
    uploadAvatar () {
      if (!this.avatar) {
        console.log('no file choose...')
        return
      }
      console.log(this.avatar)
      this.$store.dispatch('uploadAvatar', this.avatar)
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
    padding: 10px 0;
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
      margin-bottom: 20px;
    }
  }
</style>

