// NodeMailer-Mailgun Server-Side
var SERVER_SIDE_URL = "https://git.heroku.com/agile-bastion-13984.git"

angular.module('starter', ['ionic'])

//preset run from ionic - changed run below
//  .run(function($ionicPlatform) {
//  $ionicPlatform.ready(function() {
//    if(window.cordova && window.cordova.plugins.Keyboard) {
//      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//      // for form inputs)
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//
//      // Don't remove this line unless you know what you are doing. It stops the viewport
//      // from snapping when text inputs are focused. Ionic handles this internally for
//      // a much nicer keyboard experience.
//      cordova.plugins.Keyboard.disableScroll(true);
//    }
//    if(window.StatusBar) {
//      StatusBar.styleDefault();
//    }
//  });
//})

  //-----CONFIG - state routing thru ui angular routing specific to ionic
.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
//  template called tabs: go get it at this url, but not real page to navigate - abstract true, but rather be a parent template
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

  //  home page routing - no need for controller on home page
    .state('tabs.home', {
    url: '/home',
    views: {
      'home-tab': {
        templateUrl: 'templates/home.html',
      }
    }
  })

//  subtemplate/child of tabs - this one load up a view that has template and controller
    .state('tabs.list', {
      url: '/list',
      views: {
        'list-tab': {
          templateUrl: 'templates/list.html',
          controller: 'ListController'
        }
      }
    })

//  SUB PAGE: child of tabs template - same controller
    .state('tabs.detail', {
    url: '/list/:videoId',
    views: {
      'list-tab': {
        templateUrl: 'templates/detail.html',
        controller: 'ListController'
      }
    }
  })

//  NEW PAGE: calendar - sep controller
    .state('tabs.calendar', {
    url: '/calendar',
    views: {
      'calendar-tab': {
        templateUrl: 'templates/calendar.html',
        controller: 'CalendarController'
      }
    }
  })

  //  NEW PAGE: connect - sep controller
    .state('tabs.connect', {
    url: '/connect',
    views: {
      'connect-tab': {
        templateUrl: 'templates/connect.html',
        controller: 'ConnectController'
      }
    }
  })


  //  NEW PAGE: email - sep controller
    .state('tabs.email', {
    url: '/email',
    views: {
      'email-tab': {
        templateUrl: 'templates/email.html',
        controller: 'DashCtrl'
      }
    }
  })

  //  NEW PAGE: inpsirational text - sep controller
    .state('tabs.inspiration', {
    url: '/inspiration',
    views: {
      'inspiration-tab': {
        templateUrl: 'templates/inspiration.html',
//        controller: 'InspireCtrl'
      }
    }
  })

  // login routing:
//  $stateProvider
    .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
    .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
    .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
    .state('inside', {
    url: '/inside',
    templateUrl: 'templates/inside.html',
    controller: 'InsideCtrl'
  });

//  default routing back to home page - will load tabs and list navigation
  $urlRouterProvider.otherwise('/tab/home');
  //  originally: '/tab/home' then /outside/login
})


//<------------------------------   .run   ----------------------------------------------->
//catch stateChangeStart - triggered when change routes - check authentication

  .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register' && next.name !== 'tabs.home') {
        event.preventDefault();
        $state.go('tabs.home');
      }
    }
  });
})







