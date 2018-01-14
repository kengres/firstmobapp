<template lang="pug">
  q-card(v-if="user")
    q-card-media.bg-lime-8
      .profile
        img.profile_image(:src="imageSrc" v-if="imageSrc")
        .profile_noimage.bg-green(v-else)
          span.absolute-center.text-white {{ user.first_name | firstLetter }} {{ user.last_name | firstLetter}}
      .text-center.text-white
        q-btn(flat @click="openCamera") Take Picture
        q-btn(flat @click="openLibrary") choose picture
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
      q-btn.on-right(outline color="green" icon-right="check" @click="updateUser") save
      q-btn.on-right(outline color="warning" icon-right="close" @click="cancelEdit") cancel
    
    
  q-card.fixed-center(v-else)
    q-card-title Loading...
</template>
<script>
/* eslint-disable no-undef, no-unused-vars */
import { mapGetters } from 'vuex'
import { Toast } from 'quasar'
const setOptions = (srcType) => {
  const options = {
    // Some common settings are 20, 50, and 100
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    // destinationType: Camera.DestinationType.DATA_URL,
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
      imageSrc: '',
      file: null,
      userForm: {
        first_name: '',
        last_name: '',
        email: ''
      }
    }
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
    ...mapGetters(['user', 'avatarModalOpen', 'profileUpdated'])
  },
  methods: {
    writeFile (fileEntry, dataObj) {
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function () {
          console.log('Successful file write...')
          this.upload(fileEntry)
        }
        fileWriter.onerror = function (e) {
          console.log('Failed file write: ' + e.toString())
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
        console.log('Successful upload...')
        console.log('Code = ' + r.responseCode)
        // displayFileData(fileEntry.fullPath + ' (content uploaded to server)')
      }
      const fail = function (error) {
        console.log('An error has occurred: Code = ' + error.code)
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
      this.imageSrc = this.user.photoUrl
      // this.userForm.userName = this.user.userName ? this.user.userName : ''
      this.userForm.email = this.user.email
    },
    cancelEdit () {
      this.$store.dispatch('setEditMode', false)
    },
    updateUser () {
      console.log('userform: ', this.userForm)
      console.log('image src: ', this.imageSrc)
      console.log('image file: ', this.file)
      let data = this.userForm
      for (const input in data) {
        if (data.hasOwnProperty(input)) {
          const element = data[input]
          if (element === '') {
            this.notifyMsg('No empty fields allowed!')
            return
          }
        }
      }
      if (this.imageSrc) {
        data = {
          file: this.file,
          ...data
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
        this.$store.dispatch('updateUserProfile', {data, values: changedValues})
      }
    },
    openCamera (selection) {
      console.log('picture selection: ', selection)
      const srcType = Camera.PictureSourceType.CAMERA
      console.log('srcType' + srcType.toString())
      const options = setOptions(srcType)
      console.log('options' + JSON.stringify(options))
      // const func = createNewFileEntry
      if (selection === 'camera-thmb') {
        options.targetHeight = 130
        options.targetWidth = 130
      }
      navigator.camera.getPicture((imageUri) => {
        console.log('imageUri: ', imageUri)
        this.imageSrc = imageUri
        this.getFileContentAsBase64(imageUri)
        // this.createNewFileEntry(imageUri)
        // You may choose to copy the picture, save it somewhere, or upload.
      }, (error) => {
        console.log('Unable to obtain picture: ' + error.toString())
      }, options)
    },
    openLibrary (selection) {
      const srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM
      const options = setOptions(srcType)
      console.log('options' + JSON.stringify(options))
      // const func = createNewFileEntry
      if (selection === 'picker-thmb') {
        options.targetHeight = 130
        options.targetWidth = 130
      }
      navigator.camera.getPicture((imageUri) => {
        console.log('imageUri: ', imageUri)
        this.imageSrc = imageUri
        this.getFileContentAsBase64(imageUri)
      }, (error) => {
        console.log('Unable to obtain picture: ' + error.toString())
      }, options)
    },
    getFileContentAsBase64 (path) {
      window.resolveLocalFileSystemURL(path, success, fail)
      const vm = this
      function fail (e) {
        console.log('Cannot found requested file: ', e)
      }
      function success (fileEntry) {
        fileEntry.file(function (file) {
          const reader = new FileReader()
          reader.onloadend = function (e) {
            const content = this.result
            console.log('content, e: ', content, e)
            vm.file = content
          }
          reader.readAsDataURL(file)
        })
      }
    },
    createNewFileEntry (imgUri) {
      window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success (dirEntry) {
        // JPEG file
        dirEntry.getFile('tempFile.jpeg', { create: true, exclusive: false }, function (fileEntry) {
          // Do something with it, like write to it, upload it, etc.
          // writeFile(fileEntry, imgUri);
          console.log('got file: ' + fileEntry.fullPath)
          // displayFileData(fileEntry.fullPath, 'File copied to')
        }, (error) => console.log('error creating file', error))
      }, (error) => console.log('error resolving url', error))
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

