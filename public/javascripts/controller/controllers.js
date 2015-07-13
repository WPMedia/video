var userNotes = angular.module('notesApp', ['angular.filter', 'notesFilter'])
.config(function($locationProvider){
    //uncomment below to use Angular for page routing
    // $locationProvider.html5Mode(true);
  });

userNotes.controller('notesCtrl', function ($scope, $http) {

	$scope.sortType     = 'follow.articleData.title'; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	$scope.search   	= '';     // set the default search/filter term
	
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})

// Search
$scope.filterFunction = function(element) {
	return element.name.match(/^Ma/) ? true : false;
};

// Get Shares and Save to DB
$scope.captureHeadlines = function() {
    config ={};
    $http.get("https://postshare.washingtonpost.com/api/data/mostfollows/2015/5/7/7/7/1/all/all/5", config, {}).
      success(function(data) {
      $scope.follows = data.sortedFollows;
      var url = '/api/captureHeadlines/';
      $http.post(url, {headlines: $scope.follows})
        .success(function(data){
          // window.console.log(data);
          $scope.headlines = data;
        })
        .error(function(data,status){
          // window.console.log(data + status);
      });
    });
}

// Get Shares
$scope.getHeadlines = function() {
    config ={};
    $http.get("/api/headlines", config, {}).
      success(function(data) {
      $scope.headlines = data.all;
    });
}

// Remove Headline
$scope.removeHeadline = function(value) {
  // value is the note id
	var url = '/api/removeHeadline/'+ value;
	$http.delete(url)
    .success(function(data){
      window.console.log(data);
      $scope.getHeadlines();
    })
    .error(function(data,status){
      window.console.log(data + status);
    });
}

// Obtain Image Size
$scope.getSize = function(){
  $http.get('/gm/size')
  .success(function(data){
    $scope.imgSize = (data.image);
    window.console.log($scope.imgSize);
  })
  .error(function(data){
    window.console.log(data + status);
  });
}

// Resize Image
$scope.resize = function(){
  $http.get('/gm/resize')
  .success(function(data){
    $scope.imagInfo = (data);
    window.console.log($scope.imagInfo);
  })
  .error(function(data){
    window.console.log(data + status);
  });
}

// Create Image
$scope.create = function(text, id){
  window.console.log(text, id);
  var headline = {'id': id, 'text': text}
  $http.post('/gm/create', headline)
  .success(function(data){
    $scope.imagInfo = (data);
    window.console.log($scope.imagInfo);
  })
  .error(function(data){
    window.console.log(data + status);
  });
}

// Montage
$scope.montage = function(){
  console.log('montage');
  $http.post('/gm/montage')
  .success(function(data){
    $scope.imagInfo = (data);
    window.console.log($scope.imagInfo);
  })
  .error(function(data){
    window.console.log(data + status);
  });
}

// Flip Image
$scope.annotate = function(){
  $http.get('/gm/annotate')
  .success(function(data){
    $scope.imagInfo = (data);
    window.console.log($scope.imagInfo);
  })
  .error(function(data){
    window.console.log(data + status);
  });
}



});