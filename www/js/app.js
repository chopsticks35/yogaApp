// NodeMailer-Mailgun Server-Side
var SERVER_SIDE_URL = "https://git.heroku.com/agile-bastion-13984.git"

angular.module('starter', ['ionic'])

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

  //-----CONFIG - state routing
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




//-----FACTORIES

//login factory


//  google hangouts factory

  .factory('hangoutFactory', [function(){
    return {
      ShowH : { show : false }   }
  }])

//  email dash factory
  .factory('EmailManager', function($q, $http) {
  var self = this;

  //email format - send email
  self.sendMail = function(mailObj) {
    var qSend = $q.defer();
    $http.post(SERVER_SIDE_URL + "/email/send", mailObj)
      .success(
      function(response){
        qSend.resolve(response)
      }
    )
      .error(
      function(error){
        qSend.reject(error);
      }
    );
    return qSend.promise;
  };

  return self;
})


//----- TAB CONTROLLERS

//login controller
    .controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
    $scope.user = {
      name: '',
      password: ''
    };

    $scope.login = function() {
      AuthService.login($scope.user).then(function(msg) {
        $state.go('inside');
      }, function(errMsg) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: errMsg
        });
      });
    };
  })

    .controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
    $scope.user = {
      name: '',
      password: ''
    };

    $scope.signup = function() {
      AuthService.register($scope.user).then(function(msg) {
        $state.go('outside.login');
        var alertPopup = $ionicPopup.alert({
          title: 'Register success!',
          template: msg
        });
      }, function(errMsg) {
        var alertPopup = $ionicPopup.alert({
          title: 'Register failed!',
          template: errMsg
        });
      });
    };
  })

    .controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
    $scope.destroySession = function() {
      AuthService.logout();
    };

    $scope.getInfo = function() {
      $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
        $scope.memberinfo = result.data.msg;
      });
    };

    $scope.logout = function() {
      AuthService.logout();
      $state.go('outside.login');
    };
  })

    .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      AuthService.logout();
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    });
  })


// hangout controller
  .controller('HangoutController', ['$sce', '$scope', 'hangoutFactory', '$http', '$state', function($sce, $scope, hangoutFactory,   $http, $state){
    $http.get('js/data.json').success(function(data){
      $scope.user = data;
      $scope.ShowH = hangoutFactory.ShowH.show;


    })
  }])

  .controller('DashCtrl', function($scope, $ionicLoading, $timeout, EmailManager) {

  // send email, use as input $scope.MailData
  initMailData();
  $scope.sendMail = function() {
    // validate
    if($scope.MailData.senderEmail && $scope.MailData.senderName && $scope.MailData.receiverEmail) {

      // send
      showMessage('Sending...');
      EmailManager.sendMail($scope.MailData).then(
        function(success){
          showMessage('Mail sent!', 1500);
          initMailData();
        },
        function(error){
          console.log(error);
          showMessage('Something went wrong - please try again...', 1500);
        }
      );

    } else {

      // notify the user
      showMessage('Please fill in the required (*) fields', 2000);

    };
  };

  // init maildata
  function initMailData() {
    $scope.MailData = {
      senderName: "",
      senderEmail: "",
      receiverEmail: "tiwegmeyeryoga@gmail.com",
      html: "", // optionally, add html formatting
    };
  };

  // fn show loading dialog
  function showMessage(optMessage, optTime){

    // prepare the dialog content
    var templateStr;
    if(optTime != undefined) {templateStr = optMessage};
    if(optMessage != undefined && optTime != undefined) {
      templateStr = optMessage;
    } else if(optMessage != undefined && optTime == undefined) {
      templateStr = optMessage + '<br><br>' + '<ion-spinner icon="dots"></ion-spinner>';
    } else {
      templateStr = '<ion-spinner icon="dots"></ion-spinner>';
    };

    // prompt
    $ionicLoading.show({
      template: templateStr
    });

    // hide if input provided
    if(optTime != undefined) {
      $timeout(function(){
        $ionicLoading.hide();
      }, optTime)
    };

  };

})

//connect controller
.controller('ConnectController', ['$sce', '$scope', 'hangoutFactory', '$http', '$state', function($sce, $scope, hangoutFactory, $http, $state){
    $http.get('js/data.json').success(function(data){
      // need to connect to users ???  $scope.users = data;
      $scope.ShowH = !hangoutFactory.ShowH.show;

    })
  }])

//calendar controller
  .controller('CalendarController', ['$sce', '$scope', 'hangoutFactory','$http', '$state', function($sce, $scope, hangoutFactory, $http, $state){
    $http.get('js/data.json').success(function(data){
      $scope.calendar = data.calendar;
      $scope.ShowH = hangoutFactory.ShowH.show;

      // delete calendar item - nested array
      $scope.deleteItem = function(dayIndex, item) {
        $scope.calendar[dayIndex].schedule.splice($scope.calendar[dayIndex].schedule.indexOf(item), 1);
      }

      $scope.refreshList = function() {
        $http.get('js/data.json').success(function(data) {
          $scope.calendar = data.calendar;
          $scope.$broadcast('scroll.refreshComplete');
        });
      }

      $scope.toggleStar = function(item){
        item.star = !item.star;
      }

    })
  }])


//list controller
.controller('ListController', ['$sce', '$scope','hangoutFactory','$http', '$state', function($sce, $scope, hangoutFactory, $http, $state){
  $http.get('js/data.json').success(function(data){
      //connect data to videos variable
      $scope.videos = data.videos;
      //add params id for subpage
      $scope.whichVideo = $state.params.videoId;
      //correct button functionality - set to false
      $scope.data = { showDelete: false,
                      showReorder: false
                    };
      $scope.ShowH = hangoutFactory.ShowH.show;
      // delete item connect to click event
      $scope.deleteItem = function(item) {
        $scope.videos.splice($scope.videos.indexOf(item), 1);
      }

      $scope.refreshList = function() {
        $http.get('js/data.json').success(function(data) {
          $scope.videos = data.videos;
          $scope.$broadcast('scroll.refreshComplete');
        });
      }

      $scope.toggleStar = function(item){
        item.star = !item.star;
      }

      // move item connect to click event
      $scope.moveItem = function(item, fromIndex, toIndex){
        $scope.videos.splice(fromIndex, 1);
        $scope.videos.splice(toIndex, 0, item);
      }
    });

    $scope.$sce = $sce;
  }]);


