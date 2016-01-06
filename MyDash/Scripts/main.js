var map;    // declares a global map variable


// helper
var stringContains = function (string, contains) {
    string = string || "";
    contains = contains || "";
    if (contains.length > string.length)
        return -1;
    return string.indexOf(contains);
};



//self.InitializeAllMarkers = function () {
//    // The next lines save location data from the search result object to local variables
//    var location = { "lat": 51.4494309, "lng": 6.6436319 };

//    // marker is an object with additional data about the pin for a single location
//    var marker = new google.maps.Marker({
//        map: map,
//        position: location,
//        title: "test"
//    });

//    //infoWindows are the little helper windows that open when you click
//    //or hover over a pin on a map. They usually contain more information
//    //about a location.
//    var infoWindow = new google.maps.InfoWindow({
//        content: "<div> HELLO WORLD </div>"
//    });

//    // add event handling for mapmarkers
//    google.maps.event.addListener(marker, 'click', function () {
//        infoWindow.open(map, marker);
//    });

//}

ko.bindingHandlers.marker = {

    infowindow: null,

    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var map = bindingContext.$parent.mapControl;
        var restaurant = valueAccessor().restaurant;
        var latLng = new google.maps.LatLng(restaurant.lat, restaurant.long);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: "http://chart.apis.google.com/chart?chst=d_bubble_icon_text_small_withshadow&chld=swim|bbT|" + restaurant.name + "|24527A|E0EBEB",
            title: restaurant.name
        });

        marker.addListener('click', function () {
            ko.bindingHandlers.marker.openInfoWindow(map, marker);
        });
    },



    openInfoWindow: function (map, marker) {
        var contentString = '<div">' + marker.getTitle() + '</div>';
        if (this.infowindow) {
            this.infowindow.close();
        };
        this.infowindow = new google.maps.InfoWindow({
            content: contentString,
            pixelOffset: new google.maps.Size(50, 0),
        });
        map.setZoom(9);
        map.setCenter(marker.getPosition());
        this.infowindow.open(map, marker);
        google.maps.event.addListener(this.infowindow, 'closeclick', function () {
            map.setZoom(7);
            //map.setCenter(mapOptions.center);
        });
    }
};


(function () {
    'use strict';

    // Class to represent a single restaurant
    var Restaurant = function (name, kitchenType) {
        var self = this;
        self.name = name;
        self.typeOfKitchen = ko.observable(kitchenType)
        self.showMarker = true;
        self.lat = 0;
        self.long = 0;
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

ko.applyBindings(viewModel);


/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap() {

    var locations;

    var mapOptions = {
        disableDefaultUI: true,
        center: {lat: 51.4502796, lng: 6.6406621},
        zoom: 13
    };

    var mapdiv = document.getElementById("map-div");
    map = new google.maps.Map(mapdiv, mapOptions);

    // Sets the boundaries of the map based on pin locations
    window.mapBounds = new google.maps.LatLngBounds();
}


// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function (e) {
    //Make sure the map bounds get updated on page resize
    map.fitBounds(mapBounds);
});




}());


