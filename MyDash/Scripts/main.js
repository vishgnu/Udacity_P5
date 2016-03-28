'use strict';

//global for map
var map;

// current instance of infowindow
var infowindow;
var loadingContent = "<h3> loading...</h3>"

// helper
var stringContains = function (string, contains) {
    string = string || "";
    contains = contains || "";
    if (contains.length > string.length)
        return -1;
    return string.indexOf(contains);
};

// Class to represent a single restaurant
var Vacation = function (name, locationType, lat, long, weatherloc, zoomLev) {
    var self = this;
    self.name = name;
    self.typeOfLocation = ko.observable(locationType)
    self.lat = lat;
    self.long = long;
    self.zoom = zoomLev;
    self.mapMarker = null;
    self.mapMarkerVisble = true;
    self.weatherLocation = weatherloc;
}

// main viewmodel for this screen, along with initial state
var ViewModel = function(vacations) {

    // keep track of self
    var self = this;

    // our data
    this.allVacations = ko.observableArray(vacations);

    // reset marker function
    self.resetMarkers = function () {

        for (var i = 0; i < vacations.length; i++) {
            if (vacations[i].mapMarker != null) {
                vacations[i].mapMarker.setMap(null);
            }
        }
    };

    // store data from input for filtering list of restaurants
    self.currentSearchFilter = ko.observable();

    // vacation list with filter and markers
    self.vacations = ko.computed(function () {
        var filteredVacations;
        // filter if is set
        if (self.currentSearchFilter()) {

            filteredVacations = ko.utils.arrayFilter(self.allVacations(), function (rest) {
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
        else {
            filteredVacations = self.allVacations();
        }

        self.resetMarkers();

        // update mapmarkers here
        for (var i = 0; i < filteredVacations.length; i++) {
            console.log(filteredVacations[i].name + " - create marker !");

            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(filteredVacations[i].lat, filteredVacations[i].long),
                title: filteredVacations[i].name
            });
            google.maps.event.addListener(marker, 'click', (function (marker, map, i) {

                return function () {

                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }

                    map.setZoom(viewModel.vacations()[i].zoom);
                    map.setCenter(marker.getPosition());

                    // show global marker 
                    infowindow.setContent(loadingContent);
                    infowindow.open(map, marker);
                    marker.setIcon('https://www.google.com/mapfiles/marker_green.png');

                    google.maps.event.addListener(infowindow, 'closeclick', function () {
                        map.setZoom(3);
                        map.setCenter(new google.maps.LatLng(29.3491722, -34.5674402));
                        marker.setIcon();
                        marker.setAnimation(google.maps.Animation.DROP);
                    });

                    var url = "https://api.worldweatheronline.com/free/v2/weather.ashx?key=00b67585b3cb25e33e8723c524bc4&q=" + marker.title + "&format=json&num_of_days=1&fx=no&cc=yes&mca=no&fx24=no"

                    $.ajax({

                        url: url,
                        type: 'POST',
                        data: { location: i, name: marker.title },
                        contentType: 'application/json; charset=utf-8',
                        success: function (response) {

                            var content =
                                "<div class='map-info-window'>" +
                                    "<div class='row'>" +
                                        "<div class='col-md-6'>Temperature</div>" +
                                        "<div class='col-md-6'>" + response.data.current_condition[0].FeelsLikeC + " C </div>" +
                                    " </div>" +
                                    "<div class='row'>" +
                                        "<div class='col-md-6'>Humidity</div>" +
                                        "<div class='col-md-6'>" + response.data.current_condition[0].humidity + " % </div>" +
                                    " </div>" +
                                    "<div class='row'>" +
                                        "<div class='col-md-6'>Current Weather </div>" +
                                        "<div class='col-md-6'>" + response.data.current_condition[0].weatherDesc[0].value + "</div>" +
                                    " </div>" +
                                    "<div class='row'>" +
                                        "<div class='col-md-2 col-md-offset-5'><img alt='weather icon' src ='" + response.data.current_condition[0].weatherIconUrl[0].value + "'> </img> </div>"
                            " </div>" +
                            "</div>";


                            infowindow.setContent(content);
                        },
                        error: function () {
                            infowindow.setContent("<h3>No weather avaliable - sorry</h3>")
                        }
                    });
                }
            })(marker, map, i));

            filteredVacations[i].mapMarker = marker;
            filteredVacations[i].showMarker = true;
        }

        return filteredVacations;

       
    });
    
    // clear existing filter and show all data again
    self.clearSearch = function () {
        self.currentSearchFilter('');
        return;
    };

    // handel click on list
    self.clickLocationListItem = function (vacation) {

        if (this.lastClick != vacation.name) {

            this.lastClick = vacation.name;

            new google.maps.event.trigger(vacation.mapMarker, 'click');
        }
        else {
            this.lastClick = "";
            infowindow.close();
            map.setZoom(3);
            map.setCenter(new google.maps.LatLng(29.3491722, -34.5674402));
            vacation.mapMarker.setIcon();
        }
    };
}

function createMap() {

    var elevator;
    var myOptions = {
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        center: new google.maps.LatLng(29.3491722,-34.5674402),
    };
    map = new google.maps.Map($('#map-div')[0], myOptions);

    // set gloabl infowindow
    infowindow =  new google.maps.InfoWindow({
        content: loadingContent,
        pixelOffset: new google.maps.Size(10, 0),
    });

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
    new Vacation("San Pietro Olive", locationTypes[2], 44.3644916,9.2140754, "Rapallo", 19),
    new Vacation("Habor View ", locationTypes[1], 39.3626075, 2.9524576,"SA Rapita", 15),
    new Vacation("Lopesan Baobab Resort", locationTypes[1], 27.7409588, -15.6011867,"MASPALOMAS",20),
    new Vacation("Loews Royal Pacific Resort", locationTypes[0], 28.4678992, -81.4664681, "ORLANDO",15),
    new Vacation("Hyatt Regency Bellevue", locationTypes[0], 47.6178534, -122.2013131, "SEATTLE",19)
];

// bind a new instance of our view model to the page
var viewModel = new ViewModel(vacations || []);

$(document).ready(function () {

    createMap();
    ko.applyBindings(viewModel);

    viewModel.clearSearch();

});



