var app = app || {
    initialize: function() {
        app.constants = {
            // Designated the maximum amount of locations that
            //can be added for midpoint calculation  (excluding user's location)
            MAX_LOCATION_INPUTS: 2
        };

        app.elements = {
            $add_location_btn: $("#add_location_btn"),
            $non_user_location_inputs: $("#non_user_location_inputs")
        };
        app.addEventListeners();
    },

    addEventListeners: function() {
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
});
