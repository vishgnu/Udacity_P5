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
        self.showMarker = false;
        self.lat = lat;
        self.long = long;
        self.zoom = zoomLev;
        self.mapMarker = null;
        self.weatherLocation = weatherloc;
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
            ko.applyBindings(viewModel);
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


            for (var i = 0; i < viewModel.vacations().length; i++) {
                
                var res = viewModel.vacations()[i];


                var marker = new google.maps.Marker({
                    map: gm,
                    position: new google.maps.LatLng(res.lat,res.long),
                    title: res.name
                });

                //marker.addListener('click', function () {
                //    openInfoWindow(gm, marker);
                //});
                
                google.maps.event.addListener(marker, 'click', (function (marker,map, i) {
                    return function () {

                        map.setZoom(viewModel.vacations()[i].zoom);
                        map.setCenter(marker.getPosition());

                        // show global marker 
                        infowindow.setContent(loadingContent);
                        infowindow.open(map, marker);
                        
                        google.maps.event.addListener(infowindow, 'closeclick', function () {
                            map.setZoom(3);
                            map.setCenter(new google.maps.LatLng(29.3491722, -34.5674402));
                        });

                        var url = "https://api.worldweatheronline.com/free/v2/weather.ashx?key=00b67585b3cb25e33e8723c524bc4&q=" + marker.title+ "&format=json&num_of_days=1&fx=no&cc=yes&mca=no&fx24=no"

                        $.ajax({

                            url: url,
                            type: 'POST',
                            data: { location: i, name: marker.title },
                            contentType: 'application/json; charset=utf-8',
                            success: function (response) {

                                var content =
                                    "<div class='map-info-window'>"+
                                        "<div class='row'>"+
                                          "<div class='col-md-6'>Temperature</div>" +
                                          "<div class='col-md-6'>"+ response.data.current_condition[0].FeelsLikeC +" C </div>" +
                                       " </div>" +
                                        "<div class='row'>" +
                                          "<div class='col-md-6'>Humidity</div>" +
                                          "<div class='col-md-6'>"+ response.data.current_condition[0].humidity + " % </div>" +
                                       " </div>" +
                                        "<div class='row'>" +
                                          "<div class='col-md-6'>Current Weather </div>" +
                                          "<div class='col-md-6'>"+ response.data.current_condition[0].weatherDesc[0].value + "</div>" +
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
                })(marker,map, i));



                res.mapMarker = marker;
                res.showMarker = true;
            }
        },

        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

            // get filered
            var allRes = viewModel.vacations();
            

        }
    };


    //function openInfoWindow (map, marker) {
    //    var contentString = '<div">' + marker.getTitle() + '</div>';
    //    var infowindow = new google.maps.InfoWindow({
    //        content: contentString,
    //        pixelOffset: new google.maps.Size(50, 0),
    //    });

    //    map.setZoom(9);
    //    map.setCenter(marker.getPosition());
        
    //    google.maps.event.addListener(infowindow, 'closeclick', function () {
    //        map.setZoom(3);
    //        map.setCenter(new google.maps.LatLng(29.3491722, -34.5674402));
    //    });

    //    infowindow.open(map, marker);

    //}

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
});



