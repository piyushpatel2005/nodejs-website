(function () {
    angular.module('tutorialsApp')
    .controller('NavController', NavController);

    NavController.$inject = ['$scope', '$window'];

    function NavController($scope, $window) {
        $scope.user = window.user;
        
        $scope.logout = function () {
            $http.get('/users/logout')
            .then((result) => {
                window.location = '/users/signin';
            })
            .catch((err) => {
                $scope.errors = err.data;
                toastr.error($scope.errors.message, "Error!");
            });
        };
    }
})();