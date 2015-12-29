var app = angular.module('node-force');
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/views/home.html',
        controller: 'MainCtrl'
    })
    .state('validate', {
        url: '/validate/{id}',
        templateUrl: '/views/validate.html',
        controller: 'ValidateCtrl',
        resolve: {
            opp: ['$stateParams', 'force', function($stateParams, force) {
                return force.get($stateParams.id);
            }]
        }
    })
    $urlRouterProvider.otherwise('home');
}])