// this file contains all datamodels and constants



// text for loading animation
var loadingContent = "<h3> loading...</h3>";
var noWeather = "<h3>No weather avaliable - sorry</h3>";

var startCoordinates = {
    "lat": 29.3491722,
    "long": -34.5674402,
};

// connection to weather
var weatherApiURL = "https://api.worldweatheronline.com/free/v2/weather.ashx?key=00b67585b3cb25e33e8723c524bc4&q=!%%MarkerTitle%%!&format=json&num_of_days=1&fx=no&cc=yes&mca=no&fx24=no";

var weatherInfoWindowContent =
                              "<div class='map-info-window'>" +
                                  "<div class='row'>" +
                                      "<div class='col-md-6'>Temperature</div>" +
                                      "<div class='col-md-6'> !%%FeelsLikeC%%!  C </div>" +
                                  " </div>" +
                                  "<div class='row'>" +
                                      "<div class='col-md-6'>Humidity</div>" +
                                      "<div class='col-md-6'> !%%humidity%%! </div>" +
                                  " </div>" +
                                  "<div class='row'>" +
                                      "<div class='col-md-6'>Current Weather </div>" +
                                      "<div class='col-md-6'> !%%weatherDesc%%! </div>" +
                                  " </div>" +
                                  "<div class='row'>" +
                                      "<div class='col-md-2 col-md-offset-5'><img alt='weather icon' src ='!%%weatherIconUrl%%! '> </img> </div>"
                                " </div>" +
                                "</div>";



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

// some masterdata
var locationTypes = [
    { type: "Hotel " },
    { type: "Appartment" },
    { type: "House" },
    { type: "Camping" }
];

// Searchable data
var vacations = [
    new Vacation("San Pietro Olive", locationTypes[2], 44.3644916, 9.2140754, "Rapallo", 19),
    new Vacation("Habor View ", locationTypes[1], 39.3626075, 2.9524576, "SA Rapita", 15),
    new Vacation("Lopesan Baobab Resort", locationTypes[1], 27.7409588, -15.6011867, "MASPALOMAS", 20),
    new Vacation("Loews Royal Pacific Resort", locationTypes[0], 28.4678992, -81.4664681, "ORLANDO", 15),
    new Vacation("Hyatt Regency Bellevue", locationTypes[0], 47.6178534, -122.2013131, "SEATTLE", 19)
];
