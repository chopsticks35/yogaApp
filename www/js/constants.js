angular.module('starter')

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})

.constant('API_ENDPOINT', {


  url: 'http://45.55.31.119:8080/api'
  //need to omit :8080 when going live
  //old//url: 'http://159.203.226.169:8080/api'
 // url: 'http://10.0.0.41:8080/api'
  //url: 'http://192.168.173.246:8080/api'
  // url: 'http://127.0.0.1:8080/api'

});
