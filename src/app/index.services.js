(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('indexService', indexService);

    /** @ngInject */
    function indexService($q, $mdToast, msApi, $http, api, $firebaseObject, $firebaseStorage, $firebaseArray, $filter) {


        var services = {};


        services.updateUserRole = function () {
            var orderByChild = $scope.UserProfile.orderByChild("uid").equalTo(getUsers).on("child_added", function (data) {
                var obj = data.val();
                obj.userRole = 'seller';
                console.log(JSON.stringify(obj));
                indexService.update($scope.UserProfile, data.key, obj)
            });
            console.log('updateUserRole');


        }

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

        services.setUser = function (users) {
            localStorage.advboard = JSON.stringify(users);
        }
        services.getUser = function () {
            if (!localStorage.advboard) {
                localStorage.advboard = JSON.stringify([]);
            }
            return JSON.parse(localStorage.advboard);
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
            console.log(obj)
            var list = $firebaseArray(refD);
            list.$add(obj).then(function (res) {
                console.log(res)
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
        services.usersProfile = function (refD, obj) {
            var list = $firebaseArray(refD);
            list.$add(obj).then(function (res) {
                if (res) {
                    console.log(res);
                    // services.sucessMessage('Record added succfully');
                } else {
                    console.log('error:', res)
                    // services.errorMessage('error adding record');
                }
            });
        }
        services.haveingUid = function (refs) {
            var getuser = services.getUser();
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);
            var list = $firebaseArray(ref.orderByChild("uid").equalTo(getuser)).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };
        services.lastTransaction = function (refs) {
            var getuser = services.getUser();
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);
            var list = $firebaseArray(ref.orderByChild("uid").equalTo(getuser).limitToLast(1)).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };

        services.getTrialPackage = function (refs) {
            console.log(refs);
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);
            var list = $firebaseArray(ref.orderByChild("isTrial").equalTo(true)).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };


        services.dataBetween = function (refs, startDate, endDate) {
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);
            var list = $firebaseArray(ref.orderByChild("created")).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };
        services.createTransaction = function (refs, obj) {
            var qProfile = $q.defer();

            var list = $firebaseArray(refs);
            list.$add(obj).then(function (res) {
                if (res) {
                    qProfile.resolve(res);
                } else {
                    console.log('error:', res)
                    qProfile.reject(res);
                }

            });
            return qProfile.promise;
        };


        return services;
    }
})();


// (function () {
//     var app = angular.module('fuse')
//     app.factory("ArrayWithSum", ArrayWithSum);
//     function ArrayWithSum($firebaseArray) {
//         console.log('ArrayWithSum')
//         return $firebaseArray.$extend({
//             sum: function () {
//                 var total = 0;
//                 angular.forEach(this.$list, function (rec) {
//                     console.log(rec)
//                     total += rec.x;
//                 });
//                 return total;
//             }
//         })
//     }



// })();
