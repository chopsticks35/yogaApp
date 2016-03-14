angular.module('starter')

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})

.constant('API_ENDPOINT', {

  url: 'http://127.0.0.1:8080/api'
  //'http://159.203.226.169:8080/api' - DO
  //'http://10.0.0.41:8080/api' -- home
  // sim:  url: 'http://127.0.0.1:8080/api'
  //  non simulator: 'http://127.0.0.1:8100/api'
});
