(function () {
    angular.module('tutorialsApp')
    .controller('NavController', NavController);

    NavController.$inject = ['$scope', '$window'];

    function NavController($scope, $window) {
        $scope.user = $window.user;
    }
})();