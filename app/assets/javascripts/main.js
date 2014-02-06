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
                console.log(data);

                
                
                data.businesses.forEach(function(business) {
                    // we do this because the yelp id is not the id we want to use
                    // in the Location constructor
                    delete business["id"];
                    //var location_view = new LocationView( business );
                    var yelp_model = new YelpLocation(business);
                    var yelp_view = new YelpView(yelp_model);
                    yelp_view.render();

                });
                // KILL THE MAGNIFICENT MAP
                //$("#mapnificent-map").remove();

                setTimeout(function(){
                    var map = new Map(ll);
                    map.initialize();
                    google.maps.event.trigger(map, 'resize');
                }, 1000);
            }
        });
    };
};

var google_map;
var iterator = 0;

var Map = function(ll) {
    var self = this;
    this.marker_drop_lag = 300;

    this.magnificent_lat = ll.split(",")[0];
    this.magnificent_lon = ll.split(",")[1];

    this.initialize = function() {
        self.renderMap();
        self.renderMarkers();

        // only run the infowindow creator after all the markers have dropped
        setTimeout(function() {
            self.renderInfoWindows();
        }, (app.locations.length + 1) * self.marker_drop_lag );

        self.renderInfoWindows();
    };

    this.renderMap = function() {

        var midpoint_lat = app.locations[1].lat;
        var midpoint_lng = app.locations[1].lng;

        var mapOptions = {
            center: new google.maps.LatLng( midpoint_lat, midpoint_lng ),
            zoom: 14
        };
        google_map = new google.maps.Map(document.getElementById("results_map"), mapOptions);
        app.elements.$results_map_div.css("height", "500px");
        app.elements.$results_map_div.css("width", "500px");

    };

    this.renderMagnificentMarker = function() {

        var midpoint_marker = new google.maps.Marker({
            position: new google.maps.LatLng( self.magnificent_lat, self.magnificent_lon ),
            map: google_map,
            animation: google.maps.Animation.DROP,
//            icon: "/point.png"
            icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|009ACD"
            });

        google.maps.event.addListener(midpoint_marker, 'click', toggleBounce);

        function toggleBounce() {
            if (midpoint_marker.getAnimation() != null) {
                midpoint_marker.setAnimation(null);
            } else {
                midpoint_marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        }

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
            // var street_address_pattern = new RegExp(/ (.+)\(/ );
            //  var street_address = app.locations[iterator].address.match( street_address_pattern )[1];


//            var street_address_pattern = new RegExp(/ (.+)\(/ );
//            var street_address = app.locations[iterator].address.match( street_address_pattern )[1];

//            var city_state_zip_pattern = new RegExp(/[a-zA-Z0-9]+,.+/);
//            var city_state_zip = app.locations[iterator].address.match( city_state_zip_pattern )[0];


            // var city_state_zip_pattern = new RegExp(/[a-zA-Z0-9]+,.+/);
            // var city_state_zip = app.locations[iterator].address.match( city_state_zip_pattern )[0];


            var content_string = [
                "<div class='infowindow'>",
                "<h4>",
                app.locations[iterator].name,
                "</h4>",
                "<img class='rating-pic' src='" + app.locations[iterator].rating_img + "'>",
                "<img class='yelp-pic' src='" + app.locations[iterator].image_url + "'>",

//                "<p class='street_address'>",
  //              street_address,
//                "</p>",
//                "<p class='city_state_zip_address'>",
//                city_state_zip,
//                "</p>",

                //                "<p class='street_address'>",
                //              street_address,
                //                "</p>",
                //                "<p class='city_state_zip_address'>",
                //                city_state_zip,
                //                "</p>",

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
        self.renderMagnificentMarker();
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
                    if ( info_obj.opened == true && info_obj != infowindow ) {
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
