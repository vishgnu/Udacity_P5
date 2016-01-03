
var googleMap = '<div id="map"></div>';

/*
This is the fun part. Here's where we generate the custom Google Map for the website.
See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/
var map;    // declares a global map variable


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

function showMarkers() {
        // The next lines save location data from the search result object to local variables
        var location = { "lat": 51.4494309, "lng": 6.6436319 };

        // marker is an object with additional data about the pin for a single location
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            title: "test"
        });

        // infoWindows are the little helper windows that open when you click
        // or hover over a pin on a map. They usually contain more information
        // about a location.
        var infoWindow = new google.maps.InfoWindow({
            content: markerInfo
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
