angular.module('starter')

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})

.constant('API_ENDPOINT', {

  url: 'http://159.203.226.169:8080/api'
  // sim:  url: 'http://127.0.0.1:8080/api'
  //  non simulator: 'http://127.0.0.1:8100/api'
});
