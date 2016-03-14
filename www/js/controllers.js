// all front end controllers and factories here

angular.module('starter')

//<------------------------   FACTORIES   ------------------------>


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

// twilio factory
  .factory('API', function($http) {
  var api = {};
  var baseURL = 'http://161fd74d.ngrok.io';

  api.sendMsg = function(to) {
    return $http.post(baseURL + '/sendmsg', {
      "to": to
    });
  };

  return api;
})


//<------------------------   CONTROLLERS   ------------------------>

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

//inspire controller
  .controller('InspireCtrl', function($scope, $ionicLoading, $ionicPopup, API) {

  $scope.processing = false;

  $scope.show = function(message) {
    $ionicLoading.show({
      template: message
    });
  };

  $scope.hide = function() {
    $ionicLoading.hide();
  };

  $scope.showAlert = function(msg) {
    $ionicPopup.alert({
      title: msg.title,
      template: msg.message,
      okText: 'Namaste!',
      okType: 'button-assertive'
    });
  };

  $scope.sendMessage = function() {
    $scope.processing = true;
    $scope.show('Sending Message...');
    API.sendMsg($scope.msgTo).then(function(data) {

//      need to reconfig and use ng-model
      if (data.data.status == 'success') {
        $scope.showAlert({
          title: "Oops!!",
          message: "Oops something went wrong! Please try again later."
        });
      } else {
        $scope.msgTo = '';
        $scope.showAlert({
          title: "Success",
          message: "Message sent successfully"
        });
      }
      $scope.hide();
      $scope.processing = false;

    });

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
