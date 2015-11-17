/**
 * Created by JFL on 11/16/2015.
 */
var chat_example = angular.module('chat_example', ['ngRoute']);

// configure our routes
chat_example.config(function($routeProvider, $locationProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'templates/main_template.html',
            controller  : 'mainController'
        });

    $locationProvider.html5Mode(true);
});

// create the controller and inject Angular's $scope
chat_example.controller('mainController', function($scope) {
    $scope.msg = {
        message : "",
        user_name : ""
    }
    var socket = io();
    function printMessage(msg) {
        console.log(msg);
        return msg.date_time + "/" + msg.user_name + " : " + msg.message;
    }

    socket.on('updates', function (msg) {
        $scope.messages[$scope.messages.length] = printMessage(msg);
        $scope.$apply();
    });

    socket.on('snapshot', function (messages) {
        $scope.messages = [];
        messages.forEach(function (msg) {
            $scope.messages[$scope.messages.length] = printMessage(msg);
        });
        $scope.$apply();
    });

    $scope.submitMessage = function() {
        socket.emit('updates', $scope.msg);
        $scope.msg.message = "";
        $scope.$apply();
    };
});