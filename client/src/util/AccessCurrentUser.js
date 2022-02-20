function checkLocalStorage () {
  return (
    localStorage.getItem('currentUser') === undefined ||
    localStorage.getItem('currentUser') === 'undefined' ||
    localStorage.getItem('currentUser') === null
  )
}

export function accessCurrentUser () {
  let currentUser = null
  if (!checkLocalStorage()) {
    currentUser = JSON.parse(localStorage.getItem('currentUser'))
  }
  return currentUser
}

export function setCurrentUser (data) {
  localStorage.setItem('currentUser', JSON.stringify(data))
}

export function isUserLoggedIn () {
  return !checkLocalStorage()
}
