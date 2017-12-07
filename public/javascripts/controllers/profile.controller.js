(function () {
    angular.module('tutorialsApp')
    .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$window'];
    function ProfileController($scope, $window) {
        $scope.user = window.user;
    }
})();