var app = angular.module('node-force');
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/views/home.html',
        controller: 'MainCtrl'/*,
        resolve: {
            postPromise: ['urls', function(urls){
                return urls.getAll();
            }]
        }*/
    });
    $urlRouterProvider.otherwise('home');
}])