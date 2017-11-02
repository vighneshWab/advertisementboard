(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('api', apiService);

    /** @ngInject */
    function apiService($resource, $q, $firebaseObject, $http, $firebaseStorage, $firebaseArray) {

        var api = {};
        var firebaseDatabase = firebase.database()
        // Base Url
        api.baseUrl = 'app/data/';
        api.apiUrl = "http://localhost:2017/";
        api.stripeUrl = "https://stripewebhookadv.herokuapp.com/";
        // api.stripeUrl = "http://localhost:8080/";


        api.setRole = function (users) {
            localStorage.advboardRole = JSON.stringify(users);
        }
        api.getUserRole = function () {
            if (!localStorage.advboardRole) {
                localStorage.advboardRole = JSON.stringify([]);
            }
            return JSON.parse(localStorage.advboardRole);
        }
        api.insert = function (ref, data) {
            console.log('insert', JSON.stringify(data));
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            firebaseDatabase.ref(ref).push(data).on('value', function (snap) {
                var data = {
                    key: snap.key,
                    data: snap.val()
                }
                qProfile.resolve(data);
            })
            return qProfile.promise;
        }

        api.update = function (ref, chidid, data) {
            console.log('ref', ref)
            console.log('childid', chidid)
            console.log('data', JSON.stringify(data));
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            firebaseDatabase.ref(ref).child(chidid).update(data, function (snap) {
                if (snap) {
                    console.log(erorr)
                    qProfile.reject(data);
                } else {
                    qProfile.resolve(data);
                }

            })
            return qProfile.promise;
        }
        api.bulkupdate = function (ref, bulkdata) {
            console.log('data', JSON.stringify(bulkdata));
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            firebaseDatabase.ref(ref).update(bulkdata, function (snap) {
                if (snap) {
                    console.log('bulkdata', snap)
                    qProfile.reject(snap);
                } else {
                    qProfile.resolve(snap);
                }

            })
            return qProfile.promise;
        }
        api.delete = function (ref, chidid) {
            console.log(ref);
            console.log(chidid)
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var ref = firebaseDatabase.ref(ref).child(uid).child(chidid);
            var obj = $firebaseObject(ref);
            obj.$remove().then(function (ref) {
                console.log('child removed:', chidid);
                // data has been deleted locally and in the database
                qProfile.resolve(chidid);
            }, function (error) {
                qProfile.reject(error);
                console.log("Error:", error);
            });
            return qProfile.promise;
        }

        api.admin_delete = function (ref, chidid) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var ref = firebaseDatabase.ref(ref).child(chidid);
            var obj = $firebaseObject(ref);
            obj.$remove().then(function (ref) {
                console.log('child not removed:', ref);
                // data has been deleted locally and in the database
            }, function (error) {
                console.log("Error:", error);
            });
            return qProfile.promise;
        }

        api.getAll = function (ref) {
            var qProfile = $q.defer();
            var refD = firebaseDatabase.ref(ref);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            });
            return qProfile.promise;

        }
        api.getRoleWiseData = function (ref, role) {
            var qProfile = $q.defer();
            var refD = firebaseDatabase.ref(ref).equalTo(role);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            });
            return qProfile.promise;
        }
        api.verifyABN = function (abn) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var refD = firebaseDatabase.ref('sellercompany').orderByChild("abn").equalTo(abn);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            });
            return qProfile.promise;
        }
        api.verifyName = function (name) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var refD = firebaseDatabase.ref('admin/productcategory').orderByChild("CategoryName").equalTo("Fridges");
            var list = $firebaseArray(refD).$loaded(function (success) {
                console.log(JSON.stringify(success))
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            });
            return qProfile.promise;
        }

        api.count = function (ref) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var equ = uid + "_" + true;
            var refD = firebaseDatabase.ref(ref).orderByChild("uid_disable").equalTo(equ);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            });
            return qProfile.promise;
        }
        // 

        api.verifyEmail = function (Email) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var refD = firebaseDatabase.ref('sellercompany').orderByChild("Email").equalTo(Email);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            });


            return qProfile.promise;

        }

        api.userWiseData = function (ref) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var refD = firebaseDatabase.ref(ref).orderByChild('uid').equalTo(uid);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            });
            return qProfile.promise;

        }
        api.userEditData = function (ref, childId) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var refD = firebaseDatabase.ref(ref).child(childId);
            refD.on('value', function (snap) {
                var data = snap.val();

                qProfile.resolve(data);
            })
            return qProfile.promise;

        }
        api.getUserData = function (ref, childId) {
            var qProfile = $q.defer();
            var refD = firebaseDatabase.ref(ref).orderByChild('uid').equalTo(childId);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            });
            return qProfile.promise;
        }
        api.getUserProfile = function (ref, childId) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var refD = firebaseDatabase.ref('user').child(childId);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            });
            return qProfile.promise;
        }



        api.lastTransaction = function (refs, uid) {
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs).child(uid);
            var list = $firebaseArray(ref.limitToLast(1)).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };


        api.insertUser = function (ref, childId, user) {
            var qProfile = $q.defer();
            var refD = firebaseDatabase.ref(ref).push(user);
            refD.on('value', function (snap) {
                var data = snap.val();

                qProfile.resolve(data);
            })
            return qProfile.promise;

        }


        api.insertAdmin = function (ref, data) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            firebaseDatabase.ref(ref).push(data).on('value', function (snap) {
                var data = {
                    id: snap.key,
                    data: snap.val(),
                }
                qProfile.resolve(data);
            })
            return qProfile.promise;
        }


        api.bulkRemove = function (ref, companyid) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var refD = firebaseDatabase.ref(ref).orderByChild('companyId').equalTo(companyid);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            });
            return qProfile.promise;
        }



        api.insert_transaction = function (ref, uid, data) {
            var qProfile = $q.defer();

            firebaseDatabase.ref(ref).child(uid).push(data).on('value', function (snap) {
                var data = {
                    key: snap.key,
                    data: snap.val()
                }
                qProfile.resolve(data);
            })
            return qProfile.promise;
        }


        // Stripe Apis 

        api.postdata = function (endpoint, data) {
            var deferred = $q.defer();
            $http.post(api.stripeUrl + endpoint, data).then(function (response) {
                if (response.data.status) {
                    deferred.resolve(response.data.success);
                } else {
                    deferred.reject(response.data.err);
                }
            })
            return deferred.promise;

        }

        api.getdata = function (endpoint, data) {
            var deferred = $q.defer();
            $http.get(api.stripeUrl + endpoint).then(function (response) {
                console.log('response data:', JSON.stringify(response))
                if (response.data.status) {
                    deferred.resolve(response.data.success);
                } else {
                    deferred.reject(response.data.err);
                }
            })
            return deferred.promise;

        }

        api.deletedata = function (endpoint, data) {
            var deferred = $q.defer();
            var deleteUrl = endpoint + '/' + data;
            $http.delete(api.stripeUrl + deleteUrl).then(function (response) {
                console.log('response data:', JSON.stringify(response))
                if (response.data.status) {
                    deferred.resolve(response.data.success);
                } else {
                    deferred.reject(response.data.err);
                }
            })
            return deferred.promise;

        }







        return api;
    }

})();