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
$scope.captureHeadlines = function(value) {
  $scope.uid = value;
    config ={};
    $http.get("https://postshare.washingtonpost.com/api/data/mostfollows/2015/6/7/7/7/1/all/all/5", config, {}).
      success(function(data) {
      $scope.follows = data.sortedFollows;
      console.log($scope.follows);
      var url = '/api/captureHeadlines/';
      $http.post(url, {headlines: $scope.follows})
        .success(function(data){
          window.console.log(data);
        })
        .error(function(data,status){
          window.console.log(data + status);
      });
    });
}


// Get Shares
$scope.getHeadlines = function(value) {
  $scope.uid = value;
    config ={};
    $http.get("", config, {}).
      success(function(data) {
      $scope.follows = data.sortedFollows;
      console.log($scope.follows);
    });
}

// Old - delete in future
// $scope.getNotes = function(value) {
//   $scope.uid = value;
//     config ={};
//     $http.get("http://wp-postshareapi-glassfish-prod-a.wpprivate.com:9001/api/data/mostfollows/2015/5/7/7/7/1/all/all/5", config, {}).
//       success(function(data) {
//       $scope.follows = data.sortedFollows;
//       console.log($scope.follows);
//     });
// }

// Single Note
$scope.singleNote = function(value) {
    $scope.id = value;
    config ={};
    $http.get("/api/notes/single/" + $scope.id, config, {}).
      success(function(data) {
      $scope.userNote = data.userNote;
      console.log($scope.userNote);
    });
}


// Add Note
$scope.addNote = function() {
	var url = '/api/removeFavorite/';
	$http.post(url)
    .success(function(data){
      window.console.log(data);
    })
    .error(function(data,status){
      window.console.log(data + status);
    });
}

// Remove Note
$scope.removeNote = function(value) {
  // value is the note id
	var url = '/api/removeNote/'+ value;
	$http.delete(url)
    .success(function(data){
      window.console.log(data);
      $scope.getNotes();
    })
    .error(function(data,status){
      window.console.log(data + status);
    });
}


});