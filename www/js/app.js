// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

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
        templateUrl: 'templates/home.html'
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

//  default routing back to home page - will load tabs and list navigation
  $urlRouterProvider.otherwise('/tab/home');
})

//connect controller
  .controller('ConnectController', ['$sce', '$scope', '$http', '$state', function($sce, $scope, $http, $state){
    $http.get('js/user.json').success(function(data){
      $scope.user = data;

    })
  }])

//calendar controller
  .controller('CalendarController', ['$sce', '$scope', '$http', '$state', function($sce, $scope, $http, $state){
    $http.get('js/data.json').success(function(data){
      $scope.calendar = data.calendar;

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
.controller('ListController', ['$sce', '$scope', '$http', '$state', function($sce, $scope, $http, $state){
  $http.get('js/data.json').success(function(data){
      //connect data to videos variable
      $scope.videos = data.videos;
      //add params id for subpage
      $scope.whichVideo = $state.params.videoId;
      //correct button functionality - set to false
      $scope.data = { showDelete: false,
                      showReorder: false
                    };

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
