import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import { isEmpty } from 'js_config'
import { Alert } from 'quasar'

export default {
  state: {
    user: null,
    userPhotoUrl: null
  },
  getters: {
    user: state => state.user,
    userPhotoUrl: state => state.userPhotoUrl
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    previewAvatar (state, url) {
      state.userPhotoUrl = url
    }
  },
  actions: {
    signUserUp ({ commit, dispatch }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(data => {
          console.log('data after user create: ', data)
          const formatData = {
            userName: data.displayName,
            email: data.email,
            created_at: data.metadata.a,
            lastSignIn: data.metadata.lastSignInTime,
            photoUrl: data.photoURL,
            phoneNumber: data.phoneNumber,
            id: data.uid,
            userDetails: false
          }
          firebase.database().ref('users/' + data.uid).set({
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: data.email
          })
            .then(() => {
              console.log('created successfully!')
              commit('setLoading', true)
              dispatch('getUserDetails', formatData)
            })
            .catch(error => {
              console.log('error user details: ', error)
            })
        })
        .catch(error => {
          console.log('error creating: ', error)
        })
    },
    signUserIn ({ commit, dispatch }, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(data => {
            console.log('user data: ', data)
            const formatUser = {
              userName: data.displayName,
              email: data.email,
              created_at: data.metadata.a,
              lastSignIn: data.metadata.lastSignInTime,
              photoUrl: data.photoURL,
              phoneNumber: data.phoneNumber,
              id: data.uid,
              userDetails: false
            }
            resolve(formatUser)
            dispatch('getUserDetails', formatUser)
          })
          .catch(error => {
            console.log('user error: ', error)
            reject(error)
          })
      })
    },
    autoSignIn ({commit, dispatch}, user) {
      const formatUser = {
        userName: user.displayName,
        email: user.email,
        created_at: user.metadata.a,
        lastSignIn: user.metadata.lastSignInTime,
        photoUrl: user.photoURL,
        phoneNumber: user.phoneNumber,
        id: user.uid,
        userDetails: false
      }
      console.log('autoSigning user:', formatUser)
      commit('setLoading', true)
      dispatch('getUserDetails', formatUser)
    },
    getUserDetails ({ commit, dispatch }, payload) {
      console.log('getting user details. userId: ', payload.id)
      console.log('navigator online: ', navigator.onLine)
      let userDetails = {}
      firebase.database().ref(`users/${payload.id}`).once('value')
        .then(data => {
          const result = data.val()
          if (result) {
            userDetails = {
              ...result,
              ...payload,
              userDetails: true
            }
          }
          else {
            userDetails = {
              ...payload
            }
          }
          console.log('got user details: ', userDetails)
          commit('setUser', userDetails)
          commit('previewAvatar', userDetails.photoUrl)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log('error getting user details', error)
          commit('setLoading', false)
        })
      setTimeout(() => {
        console.log('isEmpty user 5s: ', isEmpty(userDetails))
        if (isEmpty(userDetails)) {
          // dispatch('checkInternetConnection')
          commit('setLoading', false)
        }
      }, 10000)
    },
    uploadAvatar ({ commit, getters, dispatch }, file) {
      const user = firebase.auth().currentUser
      console.log('current user: ', user)
      const userId = getters.user.id
      const name = file.name
      const fileName = `avatar${name.slice(name.lastIndexOf('.'))}`
      const fileRef = firebase.storage().ref(`userAvatars/${userId}/${fileName}`)
      fileRef.put(file)
        .then(fileData => {
          const avatarUrl = fileData.downloadURL
          user.updateProfile({
            photoURL: avatarUrl
          })
            .then(() => {
              dispatch('setAvatarModalOpen', false)
              commit('previewAvatar', avatarUrl)
            })
            .catch(error => console.log('update error: ', error))
          console.log(fileData)
          console.log(avatarUrl)
        })
    },
    updateUserProfile ({ commit, getters, dispatch }, payload) {
      const userId = getters.user.id
      const user = firebase.auth().currentUser
      console.log(user, userId)
      console.log('payload: ', payload)
      if (payload.values.indexOf('email') !== -1) {
        user.updateEmail(payload.data.email)
          .then(() => {
            dispatch('updateUserData', payload)
          })
      }
      else {
        dispatch('updateUserData', payload)
      }
    },
    updateUserData ({ commit, getters }, payload) {
      const userId = getters.user.id
      const userRef = firebase.database().ref(`users/${userId}`)
      let updateInfo = {}
      if (payload.values.indexOf('email') !== -1) {
        updateInfo.email = payload.data.email
      }
      else if (payload.values.indexOf('first_name') !== -1) {
        updateInfo.first_name = payload.data.first_name
      }
      else if (payload.values.indexOf('last_name') !== -1) {
        updateInfo.last_name = payload.data.last_name
      }
      userRef.update(updateInfo)
        .then(() => {
          Alert.create({
            html: 'Update succeded!',
            color: 'lime',
            icon: 'check',
            position: 'top-left',
            dismissable: true,
            enter: 'bounceInRight',
            leave: 'bounceOutRight'
          })
          commit('profileUpdate', 'success')
        })
        .catch(error => {
          console.log(error)
          Alert.create({
            html: 'Update Failed!',
            color: 'warning',
            icon: 'info',
            position: 'top-left',
            dismissable: true,
            enter: 'bounceInRight',
            leave: 'bounceOutRight'
          })
        })
    }
  }
}
