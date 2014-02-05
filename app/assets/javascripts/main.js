/*var getMidpointCoords = function() {
    return "40.7278202,-73.9980006";
};

var getCategory = function() {
    return "cafe";
};
 */

// this closure takes two parameters
// parameter1 = ll = "<latitude>,<longitude>"
// parameter2 = category = "<category>"
YELP = function(ll, category) {
    var auth = {
        consumerKey: "Jdy8fp6RC-3uO9eeh1K6IA",
        consumerSecret: "jfO1O9GH0eMamjUhZZa9byq82ho",
        accessToken: "6_s2AkZmUyYEuwGsJBvkzZlkdiigc7sP",
        accessTokenSecret: "ahhR0jRAKYVyaHBXGamMQCAY3yw",
        serviceProvider: {
            signatureMethod: "HMAC-SHA1"
        }
    };
    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['term', category]);
    parameters.push(['limit', "5"] );
    parameters.push( ["ll", ll] ) ;
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

    return function() {
        $.ajax({
            'url': message.action,
            'data': parameterMap,
            'cache': true,
            'dataType': 'jsonp',
            'jsonpCallback': 'cb',
            'success': function(data, textStats, XMLHttpRequest) {
                data.businesses.forEach(function(business) {
                    // we do this because the yelp id is not the id we want to use
                    // in the Location constructor
                    delete business["id"];
                    //var location_view = new LocationView( business );
                    new YelpLocation(business);
                });
                // KILL THE MAGNIFICENT MAP
                //$("#mapnificent-map").remove();
                console.log(ll);
                var map = new Map(ll);
                map.initialize();
                setTimeout(function(){google.maps.event.trigger(map, 'resize')}, 1000);
            }
        });
    };
};

var google_map;
var iterator = 0;

var Map = function(ll) {
    console.log(ll);
    var self = this;
    this.marker_drop_lag = 300;

    this.initialize = function() {
        self.renderMap();
        self.renderMarkers();

        // only run the infowindow creator after all the markers have dropped
        setTimeout(function() {
            self.renderInfoWindows();
        }, app.locations.length * (self.marker_drop_lag+1) );

        self.renderInfoWindows();
    };

    this.renderMap = function() {
        var midpoint_lat = parseFloat( ll.split(",")[0] );
        var midpoint_lng = parseFloat( ll.split(",")[1] );
        alert("latitude is: " + midpoint_lat + " and longitude is: " + midpoint_lng);
        var mapOptions = {
            center: new google.maps.LatLng( midpoint_lat, midpoint_lng ),
            zoom: 15
        };
        google_map = new google.maps.Map(document.getElementById("results_map"), mapOptions);
        app.elements.$results_map_div.css("height", "500px");
        app.elements.$results_map_div.css("width", "500px");

    };

    this.renderMarkers = function() {
        function addMarker() {
            var latitude = app.locations[iterator].lat;
            var longitude = app.locations[iterator].lng;

            var new_marker = new google.maps.Marker({
                position: new google.maps.LatLng( latitude, longitude ),
                map: google_map,
                animation: google.maps.Animation.DROP
            });

            var content_string = [
                "<div>",
                "<h3>",
                app.locations[iterator].name,
                "</h3>",
                "</div>"
            ];

            new_marker.custom_infowindow_text = content_string.join("");
            app.markers.push( new_marker );
            iterator++;
        }

        for ( var i = 0; i < app.locations.length; i++ ) {
            setTimeout(function() {
                addMarker();
            }, i * self.marker_drop_lag);
        }
    };

    this.renderInfoWindows = function() {
        app.markers.forEach(function(marker) {
            var infowindow = new google.maps.InfoWindow({
                content: marker.custom_infowindow_text
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open( google_map, marker );

                // close all currently open infowindows
                app.my_infowindows.forEach(function(info_obj) {
                    if ( info_obj.opened == true ) {
                        info_obj.close();
                    }
                });

                infowindow.opened = true;
            });

            google.maps.event.addListener(google_map, 'click', function() {
                infowindow.close();
                infowindow.opened = false;
            });

            infowindow.opened = false;

            app.my_infowindows.push( infowindow );
        });
    };
    app.my_infowindows = [];
};



var app = app || {
    initialize: function() {
        app.locations = [];
        app.db_locations = [];
        app.views = [];
        app.markers = [];
        app.constants = {
            // designated the maximum amount of locations that
            //can be added for midpoint calculation  (excluding user's location)
            MAX_LOCATION_INPUTS: 2
        };

        app.elements = {
            $results_map_div: $("#results_map")
        };
    }
};

$(function() {
    app.initialize();
});
