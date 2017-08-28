(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('indexService', indexService);

    /** @ngInject */
    function indexService($q, $mdToast, msApi, $http, api, $firebaseObject, $firebaseArray, $filter) {


        var services = {};


        services.getData = function (resourceUrl) {


            var endPoint = api.apiUrl + resourceUrl;
            console.log('getMethod', endPoint);

            var deferred = $q.defer();
            $http.get(api.apiUrl + resourceUrl)
                .success(function (response) {
                    deferred.resolve(response);
                    // deferred.reject(response);

                }).error(function (error) {
                    deferred.reject(error);
                })

            return deferred.promise;
        }

        services.postData = function (resourceUrl, param) {
            var deferred = $q.defer();

            var endPoint = api.apiUrl + resourceUrl;
            console.log('postMethod', endPoint);

            $http.post(api.apiUrl + resourceUrl, param)
                .success(function (response) {
                    console.log('response', response)

                    deferred.resolve(response);
                    // deferred.reject(response);

                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        var ref = firebase.database().ref('userRoles');
        services.getRefData = function () {
            var list = $firebaseObject(ref);
            return list;

        }


        services.addRefData = function (ref, formData) {
            var endPoint = firebase.database().ref(ref);
            var list = $firebaseArray(endPoint);
            list.$add(formData).then(function (res) {
                console.log("added record with id " + res);
                return res;

            });
        }










        return services;
    }
})();