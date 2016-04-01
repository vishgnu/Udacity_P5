'use strict';

//create global for map
var map;
// current instance of infowindow
var infowindow;


// main viewmodel for this screen, along with initial state
var ViewModel = function (vacations) {

    // keep track of self
    var self = this;
    
    // keep maker
    var activeMarker;



    // our complete "database"
    this.allVacations = ko.observableArray(vacations);

    // reset all markers
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
        // filter if is set so do filtering of locations
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
            // no filter is set set all vacations as filtered
            filteredVacations = self.allVacations();
        }

        // reset all markers
        self.resetMarkers();

        // update mapmarkers here for all found search results
        for (var i = 0; i < filteredVacations.length; i++) {
            //console.log(filteredVacations[i].name + " - create marker !");

            // create marker for all 
            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(filteredVacations[i].lat, filteredVacations[i].long),
                title: filteredVacations[i].name
            });

            // add click function to googlemaps for each marker including data retrieval
            google.maps.event.addListener(marker, 'click', (function (marker, map, i) {
                return function () {

                    activeMarker = marker;

                    // zoommin on map
                    map.setZoom(viewModel.vacations()[i].zoom);
                    map.setCenter(marker.getPosition());

                    // show marker green for selected
                    infowindow.setContent(loadingContent);
                    infowindow.open(map, marker);
                    marker.setIcon('https://www.google.com/mapfiles/marker_green.png');

                    // add eventhandler for closing
                    google.maps.event.addListener(infowindow, 'closeclick', function () {
                        self.resetMap(marker);

                    });

                    // get some data from worldweather for the clicked location via datamodel url and the makertitle
                    $.ajax({
                        url: weatherApiURL.replace("!%%MarkerTitle%%!", marker.title),
                        type: 'POST',
                        data: { location: i, name: marker.title },
                        contentType: 'application/json; charset=utf-8',
                        success: function (response) {

                            // if the weather return we will prepare the result html with the weather info
                            var content = weatherInfoWindowContent;
                            content = content.replace("!%%FeelsLikeC%%!", response.data.current_condition[0].FeelsLikeC)
                                      .replace("!%%humidity%%!", response.data.current_condition[0].humidity)
                                      .replace("!%%weatherDesc%%!", response.data.current_condition[0].weatherDesc[0].value)
                                      .replace("!%%weatherIconUrl%%!", response.data.current_condition[0].weatherIconUrl[0].value);

                            // set content to marker info
                            infowindow.setContent(content);
                        },
                        error: function () {
                            // incase sth goes wrong we will show a message to the user
                            // !!!!
                            // please be aware that this demo uses a free version of the api and will only allow a certain number of requests per day
                            // !!!!
                            infowindow.setContent(noWeather);
                        }
                    });
                }
            })(marker, map, i));

            // store markers on dataobjects so we can access them for other operations
            filteredVacations[i].mapMarker = marker;
            filteredVacations[i].showMarker = true;
        }

        //return search result for binding to list
        return filteredVacations;
    });

    // clear existing filter and show all data again by resetting the search filter
    self.clearSearch = function () {
        // reset input
        self.currentSearchFilter('');
        self.resetMap();
        return;
    };

    self.resetMap = function (marker) {
        infowindow.close();
        map.setZoom(3);
        map.setCenter(new google.maps.LatLng(startCoordinates.lat, startCoordinates.long));
        if (marker != null) {
            marker.setIcon();
            activeMarker = null;
        }
        else if (activeMarker != null) {
            activeMarker.setIcon();
        }
    };

    // handle click on list of locations
    // this will trigger the click event of the marker to show details
    // and if another marker is clicked reset the selected details
    self.clickLocationListItem = function (vacation) {

        if (this.lastClick != vacation.name) {

            this.lastClick = vacation.name;
            new google.maps.event.trigger(vacation.mapMarker, 'click');
        }
        else {
            this.lastClick = "";
            self.resetMap(vacation.mapMarker);

        }
    };
}


// function to create the google map object once
function createMap() {

    var elevator;
    var myOptions = {
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        center: new google.maps.LatLng(startCoordinates.lat, startCoordinates.long),
    };
    map = new google.maps.Map($('#map-div')[0], myOptions);

    // set gloabl infowindow
    infowindow = new google.maps.InfoWindow({
        content: loadingContent,
        pixelOffset: new google.maps.Size(10, 0),
    });
}

// bind a new instance of our view model to the page
var viewModel = new ViewModel(vacations || []);

// when document is ready start our app
$(document).ready(function () {

    createMap();
    ko.applyBindings(viewModel);

    viewModel.clearSearch();

});



