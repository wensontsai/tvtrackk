angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', 'routeParams', 'Show', 'Subscription', function($scope, $rootScope, $routeParams, Show, Subscription) {
    // uses $resource's get function, adds show to $scope so it is available to detail.html template
      Show.get({ _id: $routeParams.id }, function(show){
        $scope.show = show;

        // define new functions for $scope to access for display in template
        $scope.isSubscribed = function(){
          return $scope.show.subscribers.indexOf($rootScope.currentUser._id) !== -1;
        };

        $scope.subscribe = function(){
          Subscription.subscribe(show).success(function(){
            $scope.show.subscribers.push( $rootScope.currentUser._id);
          });
        };

        $scope.unsubscribe = function(){
          Subscription.unsubscribe(show).success(function(){
            var index = $scope.show.subscribers.indexOf($rootScope.currentUser._id);
            $scope.show.subscribers.splice(index, 1);
          });
        };

        // uses javascript filter() method to create an array of all future episodes and then only returns first one, hence [0]
        $scope.nextEpisode = show.episodes.filter(function(episode){
          return new Date(episode.firstAired) > new Date();
        })[0];

      });
  }]);
