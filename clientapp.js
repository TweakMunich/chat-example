/**
 * Created by JFL on 11/16/2015.
 */
var chat_example = angular.module('chat_example', ['ngRoute']);

// configure our routes
chat_example.config(function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'main_template.html',
            controller  : 'mainController'
        })
});

// create the controller and inject Angular's $scope
chat_example.controller('mainController', function($scope) {

});