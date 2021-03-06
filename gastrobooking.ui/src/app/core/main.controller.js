/**
 * Created by yonatom on 8/31/16.
 */

(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('MainController', MainController);
    /*@ngNoInject*/
    function MainController($state, $scope, $rootScope,CoreService, AuthService, $translate, $location, $anchorScroll, appConstant, $geolocation) {
        var vm = this;
        
        $scope.webWidgetCSS = appConstant.onlineApi + "/webservice/css" + window.location.search;

        if(typeof(localStorage.getItem('user')) != "undefined"){
            $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));
        }
        vm.totalOrder = 0;
        initializeCart();

        $scope.$on('orders-detail-changed', function(event, args){
            CoreService.getOrdersDetailCount().then(function(response){
                vm.totalOrder = response;
            }, function(error){

            });
        });

        vm.currentUser = $rootScope.currentUser;

        //var currentLanguage = JSON.parse(localStorage.getItem('current_language'));
        var currentLanguage = localStorage.getItem('current_language');
        if (currentLanguage) {
            $rootScope.language = currentLanguage;
            changeLanguage(currentLanguage);
        }
        else {
            setDefaultLanguage();
            getLangugeByLocation();
        }

        debugger;
        vm.logout = logout;
        vm.changeLanguage = changeLanguage;

        function changeLanguage(language){
            $translate.use(language);
            //localStorage.setItem('current_language', JSON.stringify($translate.use()));
            localStorage.setItem('current_language', $translate.use());
        }

        function setDefaultLanguage() {
            $rootScope.language = "en";
            changeLanguage($rootScope.language);
        }

        var lang = getURLParameter('lang');
        if(lang) { vm.changeLanguage(lang); }

        function logout() {
            vm.totalOrder = 0;
            AuthService.logout();
        }

        function initializeCart() {
            CoreService.getOrdersDetailCount().then(function(response){
                debugger;
                vm.totalOrder = response;
            }, function(error){

            });
        }

        function getURLParameter(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)
                || [null, ''])[1].replace(/\+/g, '%20')) || null;
        }

        function getLangugeByLocation(){
            $geolocation.getCurrentPosition({
                //timeout: 600
            }).then(function(position) {
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var geocoder = geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results) {
                        var length = results.length - 1;
                        var country = results[length].address_components[0].short_name;
                        
                        if ( country === "CZ" ) {
                            $scope.$apply(function () {
                                $rootScope.language = "cs";
                                $translate.use($rootScope.language);
                                localStorage.setItem('current_language', $rootScope.language);
                            });
                        }
                    }
                }
            });
                
            }, function(error){
                debugger;
            });
        }
    }

})();