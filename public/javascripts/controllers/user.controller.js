(function () {
    angular.module('tutorialsApp')
    .controller('UserController', ProfileController);

    ProfileController.$inject = ['$scope', '$window'];
    function ProfileController($scope, $window) {
        $scope.user = window.user;
    }
})();