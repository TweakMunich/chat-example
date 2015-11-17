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
chat_example.controller('mainController', function($scope, $timeout) {
    $scope.msg = {
        message : "",
        user_name : ""
    }

    var socket = io();
    socket.on('reconnect', function(){
        socket.emit('version', $scope.version);
    });
    socket.on('disconnect', function(){});


    function printMessage(msg) {
        // console.log(msg);
        return msg.date_time + "/" + msg.user_name + " : " + msg.message;
    }

    function updateScroll() {
        $timeout(function() {
            var scroller = document.getElementById("messages");
            scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
    }


    socket.on('updates', function (msg) {
        $scope.messages[$scope.messages.length] = printMessage(msg);
        $scope.$apply();
        updateScroll();
    });

    socket.on('snapshot', function (snapshot) {
        $scope.messages = [];
        $scope.version = snapshot.version;
        snapshot.messages.forEach(function (msg) {
            $scope.messages[$scope.messages.length] = printMessage(msg);
        });
        $scope.version = snapshot.version;
        $scope.$apply();
        updateScroll();
    });

    socket.on('refresh', function(){
        window.location = '/';
    });

    $scope.submitMessage = function() {
        console.log("SM: " + $scope.msg);
        socket.emit('updates', $scope.msg);
        $scope.msg.message = "";
        $scope.$apply();
    };
});