import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
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
          firebase.database().ref('users/' + data.uid).set({
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: data.email
          })
            .then(user => {
              console.log('returned user details: ', user)
              dispatch('getUserDetails', data.uid)
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
            const user = {
              id: data.uid
            }
            resolve(user)
            dispatch('getUserDetails', data.uid)
          })
          .catch(error => {
            console.log('user error: ', error)
            reject(error)
          })
      })
    },
    autoSignIn ({commit, dispatch}, payload) {
      console.log('autoSigning in...', payload.id)
      commit('setLoading', true)
      dispatch('getUserDetails', payload)
    },
    getUserDetails ({ commit }, payload) {
      let userDetails = {}
      firebase.database().ref(`users/${payload.id}`).once('value')
        .then(data => {
          const result = data.val()
          if (result) {
            userDetails = {
              ...result,
              ...payload
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
          console.log(error)
          commit('setLoading', false)
        })
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
