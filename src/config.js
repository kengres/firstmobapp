export const landingPath = '/'
export const homePath = '/account'
export const loginPath = '/login'
export const registerPath = '/register'

export const nav = {
  landingUrl: landingPath,
  loginUrl: loginPath,
  registerUrl: registerPath,
  homeUrl: homePath,
  addLogUrl: '/addlog'
}
export const diffDate = (dateA, dateB) => {
  const start = new Date(dateA)
  const end = new Date(dateB)
  return (start.getTime() - end.getTime()) / 60000 // in min
}

export const addZero = value => {
  return value < 10 ? `0${value}` : value
}
