var userNotes = angular.module('notesApp', ['angular.filter', 'notesFilter'])
.config(function($locationProvider){
    //uncomment below to use Angular for page routing
    // $locationProvider.html5Mode(true);
  });

userNotes.controller('notesCtrl', function ($scope, $http) {

	$scope.sortType     = 'note.title'; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order
	$scope.search   	= '';     // set the default search/filter term
	
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})

// Search
$scope.filterFunction = function(element) {
	return element.name.match(/^Ma/) ? true : false;
};

// Get Shares
$scope.getNotes = function(value) {
  $scope.uid = value;
    config ={};

    $http.get("http://wp-postshareapi-glassfish-prod-a.wpprivate.com:9001/api/data/mostfollows/2015/4/7/7/7/1/all/all/5", config, {}).
      success(function(data) {
      $scope.follows = data.sortedFollows;
      console.log($scope.follows);
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
	var url = '/api/removeFavorite/'+ value;
	$http.delete(url)
    .success(function(data){
      window.console.log(data);
    })
    .error(function(data,status){
      window.console.log(data + status);
    });
}

});