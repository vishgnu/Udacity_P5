(function () {
    'use strict';

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

        this.restaurants = ko.observableArray(restaurants);
        //this.restaurants = ko.observableArrary(restaurants.map(function (restaurant) {
        //    var testres = restaurant;

        //    return new Restaurant(restaurant.name, restaurant.typeOfKitchen)
        //}));


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

    showMarkers();

}());


