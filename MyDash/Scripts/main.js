    'use strict';

    //global for map
    var map;

    // current instance of infowindow
    var infowindow;

    // helper
    var stringContains = function (string, contains) {
        string = string || "";
        contains = contains || "";
        if (contains.length > string.length)
            return -1;
        return string.indexOf(contains);
    };

    // Class to represent a single restaurant
    var Vacation = function (name, locationType, lat, long) {
        var self = this;
        self.name = name;
        self.typeOfLocation = ko.observable(locationType)
        self.showMarker = false;
        self.lat = lat;
        self.long = long;
        self.mapMarker = null;
    }

    // main viewmodel for this screen, along with initial state
    var ViewModel = function(vacations) {

        // keep track of self
        var self = this;

        // our data
        this.allVacations = ko.observableArray(vacations);
       
        // store data from input for filtering list of restaurants
        self.currentSearchFilter = ko.observable();

        self.vacations = ko.computed(function () {
            if (!self.currentSearchFilter()) {
                return self.allVacations();
            } else {

                return ko.utils.arrayFilter(self.allVacations(), function (rest) {
                    // get contains for type and restaurantname
                    var indexName = stringContains(rest.name.toLowerCase(), self.currentSearchFilter().toLowerCase());
                    var indexType = stringContains(rest.typeOfLocation().type.toLowerCase(), self.currentSearchFilter().toLowerCase());
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


            for (var i = 0; i < viewModel.allVacations().length; i++) {
                
                var res = viewModel.allVacations()[i];


                var marker = new google.maps.Marker({
                    map: gm,
                    position: new google.maps.LatLng(res.lat,res.long),
                    title: res.name
                });

                marker.addListener('click', function () {
                    openInfoWindow(gm, marker);
                });
                


                res.mapMarker = marker;
                res.showMarker = true;
            }
        },

        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {


            var allRes = viewModel.allVacations();
            //var visRes = viewModel.restaurants();

            //viewModel.allRestaurants()[0].mapMarker.setVisble(false);
          
          
        }
    };


    function openInfoWindow (map, marker) {
        var contentString = '<div">' + marker.getTitle() + '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            pixelOffset: new google.maps.Size(50, 0),
        });

        map.setZoom(9);
        map.setCenter(marker.getPosition());
        
        google.maps.event.addListener(infowindow, 'closeclick', function () {
            map.setZoom(3);
            map.setCenter(new google.maps.LatLng(29.3491722, -34.5674402));
        });

        infowindow.open(map, marker);

    }

    function createMap() {

        var elevator;
        var myOptions = {
            zoom: 3,
            center: new google.maps.LatLng(29.3491722,-34.5674402),
        };
        map = new google.maps.Map($('#map-div')[0], myOptions);
    }

    // some masterdata
    var locationTypes = [
        { type: "Hotel " },
        { type: "Appartment" },
        { type: "House" },
        { type: "Camping" }
    ];

    // Searchable data
    var vacations = [
        new Vacation("San Pietro Rural", locationTypes[2], 44.3644916,9.2140754),
        new Vacation("Habor View", locationTypes[1], 39.3626075, 2.9524576,77),
        new Vacation("Lopesan Baobab Resort", locationTypes[1], 27.7409588, -15.6011867, 667),
        new Vacation("Loews Royal Pacific Resort", locationTypes[0], 28.4678992, -81.4664681, 44),
        new Vacation("Hyatt Regency Bellevue", locationTypes[0], 47.6178534, -122.2013131)
    ];

// bind a new instance of our view model to the page
    var viewModel = new ViewModel(vacations || []);

$(document).ready(function () {

    createMap();
    ko.applyBindings(viewModel);
});



