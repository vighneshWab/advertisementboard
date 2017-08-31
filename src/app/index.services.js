(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('indexService', indexService);

    /** @ngInject */
    function indexService($q, $mdToast, msApi, $http, api, $firebaseObject, $firebaseStorage, $firebaseArray, $filter) {


        var services = {};



        services.sucessMessage = function (msg) {

            var configOptions = {
                hideDelay: 3000,
                position: 'top right',
                template: '<md-toast class="md-toast">' + msg + '</md-toast>'

            }
            $mdToast.show($mdToast.simple(configOptions));
        }

        services.errorMessage = function (msg) {
            var configOptions = {
                hideDelay: 3000,
                position: 'top right',
                template: '<md-toast class="md-toast">' + msg + '</md-toast>'

            }
            $mdToast.show($mdToast.simple(configOptions));

        }



        var ref = firebase.database().ref('userRoles');
        services.getRefData = function () {
            var list = $firebaseObject(ref);
            return list;

        }

        var admin = firebase.database().ref('admin');

        services.getByRef = function (refD) {
            var child = admin.child(refD)
            var refDdata = refD;
            var list = $firebaseArray(child);

            return list;

        }


        // optimiza code starts

        services.getAll = function (refD) {
            var list = $firebaseArray(refD);
            return list;

        }
        services.create = function (refD, obj) {
            console.log('create ', refD)
            var list = $firebaseArray(refD);
            list.$add(obj).then(function (res) {
                if (res) {
                    services.sucessMessage('Record added succfully');

                } else {
                    console.log('error:', res)
                    services.errorMessage('error adding record');
                }

            });

        }

        services.update = function (refD, childRef, obj) {
            var list = refD.child(childRef).set(obj, function (error) {
                if (error) {
                    services.errorMessage('error while update record');
                } else {
                    services.sucessMessage('Record updated succfully');

                }


            });

        }

        services.strorage = function (file) {
            var currentDate = Date.now();
            var randomNumberBetween0and19 = Math.floor(Math.random() * 1000);
            var imageName = currentDate + randomNumberBetween0and19.toString();
            const imageStorageRef = firebase.storage().ref(imageName);
            const imageStorage = $firebaseStorage(imageStorageRef)
            const uploadTask = imageStorage.$put(file);
           return uploadTask;

        }


        //ends 



        return services;
    }
})();
