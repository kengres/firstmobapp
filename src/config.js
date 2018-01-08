export const APP_NAME = 'timespent'
// firebase configuration
export const isProd = () => {
  return process.env.NODE_ENV === 'production'
}
export let firebaseConfig
if (isProd()) {
  firebaseConfig = {
    apiKey: 'AIzaSyCNrNZbm97DWP4kFi_SQgp13hiz2xVrgqk',
    authDomain: 'time-spent-app.firebaseapp.com',
    databaseURL: 'https://time-spent-app.firebaseio.com',
    projectId: 'time-spent-app',
    storageBucket: 'time-spent-app.appspot.com'
  }
}
else {
  firebaseConfig = {
    apiKey: 'AIzaSyArPMcE4_L7HxapH1Hyk5AtojKL0nnojNU',
    authDomain: 'time-spent-dev.firebaseapp.com',
    databaseURL: 'https://time-spent-dev.firebaseio.com',
    projectId: 'time-spent-dev',
    storageBucket: 'time-spent-dev.appspot.com'
  }
}
export const letNotify = (msg) => {
  isProd() ? alert(msg) : console.log(msg)
}
// firebase node keys
export const ACTIVITIES_KEY = `${APP_NAME}-activities`
export const USER_KEY = `${APP_NAME}-user`
export const USERS_KEY = `${APP_NAME}-users`
// path and urls
export const landingPath = '/'
export const homePath = '/account'
export const loginPath = '/login'
export const registerPath = '/register'
export const addActivityPath = '/add-activity'
export const singleActivityPath = '/activities'
export const aboutPath = '/about'
export const profilePath = '/profile'

export const nav = {
  landingUrl: landingPath,
  loginUrl: loginPath,
  registerUrl: registerPath,
  homeUrl: homePath,
  addActivityUrl: addActivityPath,
  singleActivityUrl: singleActivityPath,
  aboutUrl: aboutPath,
  profileUrl: profilePath

}
export const diffDate = (dateA, dateB) => {
  const start = new Date(dateA)
  const end = new Date(dateB)
  return Math.abs((start.getTime() - end.getTime()) / 60000) // in min
}

export const addZero = value => {
  return value < 10 ? `0${value}` : value
}

export const toLocalIsoTime = (date) => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000
  const d = (new Date(date)).getTime()
  const localISOTime = ((new Date(d - tzoffset)).toISOString()).slice(0, 10)
  return localISOTime
}
