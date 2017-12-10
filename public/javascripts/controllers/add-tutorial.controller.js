(function () {
    angular.module('tutorialsApp')
    .controller('AddTutorialController', AddTutorialController);

    AddTutorialController.$inject = ['$scope', '$http'];

    function AddTutorialController ($scope, $http) {

        $scope.formData = {
            title: $scope.title,
            description: $scope.description
        };
        $scope.createTutorial = function (data) {
            $http.post('/tutorials', data)
            .then((response) => {
                toastr.success('Your tutorial has been created!', 'Success');
                console.log(response);
                window.location = '/tutorials/' + response.data._id;
            })
            .catch((err) => {
                $scope.errors = err.data;
                toastr.error($scope.errors.message, 'Error!');
            });
        }
    }
})();