(function () {
    angular.module('tutorialsApp')
    .controller('TutorialsController', TutorialsController);

    TutorialsController.$inject = ['$scope', '$window'];

    function TutorialsController($scope, $window){
        $scope.tutorials = $window.tutorials;
    }
})();