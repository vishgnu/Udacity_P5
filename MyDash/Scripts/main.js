var map;    // declares a global map variable


// helper
var stringContains = function (string, contains) {
    string = string || "";
    contains = contains || "";
    if (contains.length > string.length)
        return -1;
    return string.indexOf(contains);
};

(function () {
    'use strict';

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

        addMarker();
    }



    function addMarker() {
        // The next lines save location data from the search result object to local variables
        var location = { "lat": 51.4494309, "lng": 6.6436319 };

        // marker is an object with additional data about the pin for a single location
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            title: "test"
        });

        //infoWindows are the little helper windows that open when you click
        //or hover over a pin on a map. They usually contain more information
        //about a location.
        var infoWindow = new google.maps.InfoWindow({
            content: "<div> HELLO WORLD </div>"
        });

        // add event handling for mapmarkers
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(map, marker);
        });
    }


    // Calls the initializeMap() function when the page loads
    window.addEventListener('load', initializeMap);

    // Vanilla JS way to listen for resizing of the window
    // and adjust map bounds
    window.addEventListener('resize', function (e) {
        //Make sure the map bounds get updated on page resize
        map.fitBounds(mapBounds);
    });


    // Class to represent a single restaurant
    var Restaurant = function (name, kitchenType) {
        var self = this;
        self.name = name;
        self.typeOfKitchen = ko.observable(kitchenType)
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
                    
                // filter names here
                //return self.allRestaurants()[0];

                return ko.utils.arrayFilter(self.allRestaurants(), function (rest) {

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

}());


