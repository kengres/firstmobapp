import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

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
    }
  }
}
