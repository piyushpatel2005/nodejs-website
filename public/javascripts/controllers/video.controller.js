(function () {
    angular.module('tutorialsApp')
    .controller('VideoController', VideoController);

    VideoController.$inject = ['$scope', '$window', '$http'];

    function VideoController($scope, $window, $http) {

        function resetForm() {
            $scope.formData = {
                title: "",
                url: "",
                hour: 0,
                minutes: 0,
                seconds: 0
            }
        }

        resetForm();

        $scope.video = $window.video;
        
        $scope.addVideo = function (data) {
            $http.post('/tutorials/' + tutorial.id + '/videos/', $scope.formData)
            .then((response) => {
                resetForm();
                toastr.success(response.data.message, 'Success!');
                $window.tutorial.videos.push(response.data.video);
                // TODO: update dom automatically on addition
                // window.location = '/tutorials/' + tutorial.id;
            })
            .catch((err) => {
                toastr.error(err.data.message, 'Error!');
            });
        };

        $scope.updateVideo = function () {
            $http.put('/tutorials/' + $window.tutorial.id + '/videos/' + video.id, video)
            .then((response) => {
                window.location = '/tutorials/' + $window.tutorial.id;
                
            })
            .catch((err) => {
                toastr.error(err.data.message, "Error!");
            });
        };

        $scope.deleteVideo = function (id) {
            $http.delete('/tutorials/' + $window.tutorial.id + '/videos/' + id)
            .then((response) => {
                console.log(response.data);
                toastr.success(response.data.message, 'Success!');
                $scope.$emit('videoDeleted', response.data.tutorial);
                // $window.location = '/tutorials/' + $window.tutorial.id;
                
            })
            .catch((err) => {
                console.log(err.data);
                toastr.error(err.data.message, 'Error!');
            });
        };

    }
})();