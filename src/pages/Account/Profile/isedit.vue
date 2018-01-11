<template lang="pug">
  q-card(v-if="user")
    q-card-media.bg-lime-8
      .profile
        img.profile_image(:src="userPhotoUrl" v-if="userPhotoUrl")
        .profile_noimage.bg-green(v-else)
          span.absolute-center.text-white {{ user.first_name | firstLetter }} {{ user.last_name | firstLetter}}
      .text-center.text-white
        q-btn(flat @click="openModalAvatar") change avatar
        q-btn(flat @click="openCamera") open camera
    q-card-main
      img.profile_image(:src="uploadUrl" v-if="uploadUrl")
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
      q-btn.on-right(outline color="green" icon-right="check" @click="updateUser") save
      q-btn.on-right(outline color="warning" icon-right="close" @click="cancelEdit") cancel
    
    q-modal(ref="avatarModal" v-model="avatarModalOpen" position="bottom"
            :content-css="{padding: '20px', width: '100vw'}")
      input(type="file" @change="handleChange" @click.prevent="uploadFile")
      q-btn.float-right(round icon="cloud" color="green" @click="uploadAvatar")
  q-card.fixed-center(v-else)
    q-card-title Loading...
</template>
<script>
/* eslint-disable no-undef, no-unused-vars */
import { mapGetters } from 'vuex'
import { QUploader, Toast } from 'quasar'
const setOptions = (srcType) => {
  const options = {
    // Some common settings are 20, 50, and 100
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    // In this app, dynamically set the picture source, Camera or photo gallery
    sourceType: srcType,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: true,
    correctOrientation: true // Corrects Android orientation quirks
  }
  return options
}
export default {
  data () {
    return {
      avatar: '',
      imageSrc: false,
      userForm: {
        first_name: '',
        last_name: '',
        email: ''
      },
      uploadUrl: ''
    }
  },
  components: {
    QUploader
  },
  created () {
    this.updateForm()
  },
  watch: {
    profileUpdated (value) {
      if (value === 'success') {
        this.$store.dispatch('setEditMode', false)
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'avatarModalOpen', 'userPhotoUrl', 'profileUpdated'])
  },
  methods: {
    uploadFile () {
      console.log('clicked the input')
      window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, (fs) => {
        alert('file system open: ' + fs.name)
        const fileName = 'kengres.txt'
        const dirEntry = fs.root
        dirEntry.getFile(fileName, {
          create: true,
          exclusive: false
        }, (fileEntry) => {
          // Write something to the file before uploading it.
          this.writeFile(fileEntry)
        }, () => alert('error reading file'))
      }, () => alert('error loading'))
    },
    writeFile (fileEntry, dataObj) {
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function () {
          alert('Successful file write...')
          this.upload(fileEntry)
        }
        fileWriter.onerror = function (e) {
          alert('Failed file write: ' + e.toString())
        }
        if (!dataObj) {
          dataObj = new Blob(['file data to upload'], { type: 'text/plain' })
        }
        fileWriter.write(dataObj)
      })
    },
    upload (fileEntry) {
      // !! Assumes variable fileURL contains a valid URL to a text file on the device,
      const fileURL = fileEntry.toURL()
      const success = function (r) {
        alert('Successful upload...')
        alert('Code = ' + r.responseCode)
        // displayFileData(fileEntry.fullPath + ' (content uploaded to server)')
      }
      const fail = function (error) {
        alert('An error has occurred: Code = ' + error.code)
      }
      const options = new FileUploadOptions()
      options.fileKey = 'file'
      options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1)
      options.mimeType = 'text/plain'
      const params = {}
      params.value1 = 'test'
      params.value2 = 'param'
      options.params = params
      const ft = new FileTransfer()
      // SERVER must be a URL that can handle the request, like
      // http://some.server.com/upload.php
      ft.upload(fileURL, encodeURI(SERVER), success, fail, options)
    },
    updateForm () {
      console.log('update form... ', this.user)
      this.userForm.first_name = this.user.first_name
      this.userForm.last_name = this.user.last_name
      // this.userForm.userName = this.user.userName ? this.user.userName : ''
      this.userForm.email = this.user.email
    },
    cancelEdit () {
      this.$store.dispatch('setEditMode', false)
    },
    updateUser () {
      console.log(this.userForm)
      const data = this.userForm
      for (const input in data) {
        if (data.hasOwnProperty(input)) {
          const element = data[input]
          if (element === '') {
            this.notifyMsg('No empty fields allowed!')
            return
          }
        }
      }
      let canSave = false
      const changedValues = []
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          const userEl = this.user[key]
          if (element !== userEl) {
            canSave = true
            changedValues.push(key)
          }
          console.log(element, userEl)
        }
      }
      console.log('can save: ', canSave)
      console.log('changed values: ', changedValues)
      if (canSave) {
        this.$store.dispatch('updateUserProfile', {data: this.userForm, values: changedValues})
      }
    },
    openModalAvatar () {
      this.$store.dispatch('setAvatarModalOpen', true)
    },
    openCamera () {
      alert('taking a picture')
      const srcType = Camera.PictureSourceType.CAMERA
      alert('srcType' + srcType.toString())
      const options = setOptions(srcType)
      alert('options' + JSON.stringify(options))
      const func = createNewFileEntry
      navigator.camera.getPicture((imageUri) => {
        alert('image uri: ' + imageUri)
        this.uploadUrl = imageUri
        // You may choose to copy the picture, save it somewhere, or upload.
        func(imageUri)
        alert('image uri: ' + imageUri.toString())
      }, (error) => {
        alert('Unable to obtain picture: ' + error.toString())
      }, options)
      this.$cordova.camera.getPicture((imageUri) => {
        alert('vue image uri: ' + imageUri)
        this.uploadUrl = imageUri
        // You may choose to copy the picture, save it somewhere, or upload.
        func(imageUri)
        alert('vue image uri: ' + imageUri.toString())
      }, (error) => {
        alert('Unable to obtain picture: ' + error.toString())
      }, options)
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
    },
    notifyMsg (msg) {
      Toast.create.warning({
        html: msg
      })
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

