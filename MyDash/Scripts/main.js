    'use strict';

    //global for map
    var map;

    // helper
    var stringContains = function (string, contains) {
        string = string || "";
        contains = contains || "";
        if (contains.length > string.length)
            return -1;
        return string.indexOf(contains);
    };

    // Class to represent a single restaurant
    var Restaurant = function (name, kitchenType) {
        var self = this;
        self.name = name;
        self.typeOfKitchen = ko.observable(kitchenType)
        self.showMarker = false;
        self.lat = 51.4572253;
        self.long = 6.4787701;
        self.mapMarker = null;
    }

    // main viewmodel for this screen, along with initial state
    var ViewModel = function(restaurants) {

        // keep track of self
        var self = this;

        // our data
        this.allRestaurants = ko.observableArray(restaurants);
       
        // store data from input for filtering list of restaurants
        self.currentSearchFilter = ko.observable();

        self.restaurants = ko.computed(function () {
            if (!self.currentSearchFilter()) {
                return self.allRestaurants();
            } else {

                return ko.utils.arrayFilter(self.allRestaurants(), function (rest) {
                    // get contains for type and restaurantname
                    var indexName = stringContains(rest.name.toLowerCase(), self.currentSearchFilter().toLowerCase());
                    var indexType = stringContains(rest.typeOfKitchen().type.toLowerCase(), self.currentSearchFilter().toLowerCase());
                    if (indexName != -1 || indexType != -1) {
                        return true;
                    }
                    else {
                        return false;
                    };
                });
            }
        });

        // clear existing filter and show all data again
        self.clearSearch = function () {
            self.currentSearchFilter('');
            return;
        };
    }



    ko.bindingHandlers.map = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

            var gm = allBindingsAccessor().map;


            for (var i = 0; i < viewModel.allRestaurants().length; i++) {
                
                var res = viewModel.allRestaurants()[i];


                var marker = new google.maps.Marker({
                    map: gm,
                    position: new google.maps.LatLng(res.lat+i*1,res.long+i*1),
                    title: res.name
                });

                res.mapMarker = marker;
                res.showMarker = true;
            }

            //var position = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());


            //viewModel._mapMarker = marker;
        },

        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {


            var allRes = viewModel.allRestaurants();
            var visRes = viewModel.restaurants();

            //viewModel.allRestaurants()[0].mapMarker.setVisble(false);
            
        }
    };



    function createMap() {

        var elevator;
        var myOptions = {
            zoom: 15,
            center: new google.maps.LatLng(51.4572253, 6.4787701),
        };
        map = new google.maps.Map($('#map-div')[0], myOptions);
    }

    // some masterdata
    var kitchenTypes = [
        { type: "Italian Restaurant" },
        { type: "Thai Streetkitchen" },
        { type: "Burger Joint" },
        { type: "Greek Grill" },
        { type: "Chinese Restaurant" },
        { type: "German Restaurant" },
        { type: "Bar/Restaurant" }
    ];

    // Searchable data
    var restaurants = [
        new Restaurant("The Stallion", kitchenTypes[0]),
        new Restaurant("Thai Ngam", kitchenTypes[1]),
        new Restaurant("Walt's Diner", kitchenTypes[2]),
        new Restaurant("Apollon Grill", kitchenTypes[3]),
        new Restaurant("China Restaurant Wang Fu", kitchenTypes[4]),
        new Restaurant("Restaurant il Mulino Ercole Ruggiero", kitchenTypes[0]),
        new Restaurant("Moerser Brauhaus", kitchenTypes[5]),
        new Restaurant("Gasthof Hufen", kitchenTypes[5]),
        new Restaurant("Cafe Del Sol", kitchenTypes[6]),
        new Restaurant("Chili's Bar & Restaurant", kitchenTypes[4]),
        new Restaurant("Bua Luang", kitchenTypes[1])
    ];

// bind a new instance of our view model to the page
var viewModel = new ViewModel(restaurants || []);

$(document).ready(function () {

    createMap();
    ko.applyBindings(viewModel);
});



