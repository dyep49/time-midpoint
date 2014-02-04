var getMidpointCoords = function() {
    return "40.7278202,-73.9980006";
};

var getCategory = function() {
    return "cafe";
};

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
    parameters.push(['limit', "10"] );
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
                    new Location(business);
                });
            }
        });
    };
}( getMidpointCoords(), getCategory() );

var map = map || {
    render: function() {
        var midpoint_lat = parseFloat( getMidpointCoords().split(",")[0] );
        var midpoint_lng = parseFloat( getMidpointCoords().split(",")[1] );
        var mapOptions = {
            center: new google.maps.LatLng( midpoint_lat, midpoint_lng ),
            zoom: 12
        };
        var map = new google.maps.Map(document.getElementById("results_map"), mapOptions);

        var marker, i;

        for ( i = 0; i < app.locations.length; i++ ) {
            var latitude = app.locations[i].latitude;
            var longitude = app.locations[i].longitude;
            marker = new google.maps.Marker({
                position: new google.maps.LatLng( latitude, longitude ),
                map: map
            });
        }

        app.elements.$results_map_div.css("height", "500px");
    }
};

var app = app || {
    initialize: function() {
        app.locations = [];
        app.views = [];
        app.constants = {
            // Designated the maximum amount of locations that
            //can be added for midpoint calculation  (excluding user's location)
            MAX_LOCATION_INPUTS: 2
        };

        app.elements = {
            $add_location_btn: $("#add_location_btn"),
            $non_user_location_inputs: $("#non_user_location_inputs"),
            $results_map_div: $("#results_map")
        };
        app.addEventListeners();
    },

    addEventListeners: function() {
        // Adds a new location input box
        app.elements.$add_location_btn.on("click", function(e) {
            e.preventDefault(); // prevent page from refreshing and such
            var number_of_inputs = app.elements.$non_user_location_inputs.children().length;

            if ( number_of_inputs < app.constants.MAX_LOCATION_INPUTS ) {
                var $first_destination_input =  app.elements.$non_user_location_inputs.children().first();
                var $new_location_input = $first_destination_input.clone();
                $new_location_input.attr( "placeholder", "Enter Destination " + ( number_of_inputs + 1 ) );
                app.elements.$non_user_location_inputs.append( $new_location_input );
            } else {
                alert("Cannot add more locations");
            }
        });
    }
};

$(function() {
    app.initialize();
//    YELP();
//    map.render();
});
