// Class to represent a row in the seat reservations grid
function Restaurant(name, kitchenType) {
    var self = this;
    self.name = name;
    self.typeOfKitchen = ko.observable(kitchenType);
}


// Overall viewmodel for this screen, along with initial state
function RestaurantFinderViewModel() {
    var self = this;

    // Non-editable catalog data - would come from the server
    self.kitchenTypes = [
        { type: "Italian Restaurant"},
        { type: "Thai Streetkitchen"},
        { type: "Burger Joint" },
        { type: "Greekt Grill" }
    ];

    // Searchable data
    self.Restaurants = ko.observableArray([
        new Restaurant("The Stallion", self.kitchenTypes[0]),
        new Restaurant("Thai Ngam", self.kitchenTypes[1]),
        new Restaurant("Walt's Diner", self.kitchenTypes[2]),
        new Restaurant("Apollon Grill", self.kitchenTypes[3])
    ]);
}

// run knockout
ko.applyBindings(new RestaurantFinderViewModel());


var map = {
    "display": function displayMap() {

        $("#map-div").append(googleMap);
    }

}

// here drwarfs shovelling html
map.display();
