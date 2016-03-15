// NodeMailer-Mailgun Server-Side
var SERVER_SIDE_URL = "https://git.heroku.com/agile-bastion-13984.git"

//Stripe keys
var SERVER_SIDE_URL             = "sk_test_bX9d0AXPcjHqw2ThDGy9CikX";
var STRIPE_API_PUBLISHABLE_KEY  = "pk_test_CM0AzwaTpaHo9lv9kZqL1NWV";

angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'credit-cards'])

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
//
//  });
//})

  //-----CONFIG - state routing thru ui angular routing specific to ionic
.config(function($stateProvider, $urlRouterProvider){

  $stateProvider

    .state('donate', {
    url: '/donate',
    templateUrl: 'templates/donate.html',
    controller: 'DonateCtrl'

  })


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
        controller: 'InspireCtrl'
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

  .run(function($ionicPlatform, $ionicAnalytics) {
  $ionicPlatform.ready(function() {

    $ionicAnalytics.register();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }


//    console.log("window.stripe ", window.stripe);
    //alert(window.stripe);

    //createCharge()
  })

  function testStripe() {
    // https://stripe.com/docs/api#list_customers
    stripe.customers.list({
      limit: "2" // both value as string and number are supported
    },
  function(response) {
      console.log(JSON.stringify(response, null, 2));

      createCustomer();
    },
  function(response) {
      alert(JSON.stringify(response))
    } // error handler
                         );
  }


  function createCustomer() {
    // creating a customer: https://stripe.com/docs/api#create_customer
    stripe.customers.create({
      description: "Ti Wegmeyer",
      email: "tiwegmeyeryoga@gmail.com.com"
    },
  function(response) {
      alert("Customer created:\n\n" + JSON.stringify(response))
      console.log(JSON.stringify(response, null, 2))
    },
  function(response) {
      alert(JSON.stringify(response))
    } // error handler
                           );
  }
})







