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

//  child of tabs template - same controller
    .state('tabs.detail', {
    url: '/list/:videoId',
    views: {
      'list-tab': {
        templateUrl: 'templates/detail.html',
        controller: 'ListController'
      }
    }
  })
//  default routing back to home page - will load tabs and list navigation
  $urlRouterProvider.otherwise('/tab/home');
})

//list controller
.controller('ListController', ['$sce', '$scope', '$http', '$state', function($sce, $scope, $http, $state){
  $http.get('js/videos.json').success(function(data){
      //connect data to videos variable
      $scope.videos = data;
      $scope.whichVideo = $state.params.videoId;

      // delete item connect to click event
      $scope.deleteItem = function(item) {
        $scope.videos.splice($scope.videos.indexOf(item), 1);
      }

      $scope.refreshList = function() {
        $http.get('js/videos.json').success(function(data) {
          $scope.videos = data;
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
