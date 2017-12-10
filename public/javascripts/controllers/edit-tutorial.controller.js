(function () {
    angular.module('tutorialsApp')
    .controller('EditTutorialController', EditTutorialController);

    EditTutorialController.$inject = ['$scope', '$window', '$http'];
    function EditTutorialController($scope, $window, $http) {
        $scope.tutorial = $window.tutorial;

        $scope.editTutorial = function () {
            console.log
            $http.put('/tutorials/' + tutorial._id, $scope.tutorial)
            .then((response) => {
                window.location = '/tutorials/' + response.data.id;
            })
            .catch((err) => {
                toastr.error(err.data.message, 'Error!');
            });
        }
    }
})();