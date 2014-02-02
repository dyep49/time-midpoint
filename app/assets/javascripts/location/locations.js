var app = app || {
    initialize: function() {
        app.elements = {
            $add_location_btn: $("#add_location_btn"),
            $non_user_location_inputs: $("#non_user_location_inputs")
        };
        app.addEventListeners();
    },

    addEventListeners: function() {
        app.elements.$add_location_btn.on("click", function(e) {
            e.preventDefault(); // prevent page from refreshing and such
            var $first_destination_input =  app.elements.$non_user_location_inputs.children().first();
            var $new_location_input = $first_destination_input.clone();
            $new_location_input.attr( "placeholder", "Enter Destination " + ( app.elements.$non_user_location_inputs.children().length + 1 ) );
            app.elements.$non_user_location_inputs.append( $new_location_input );
        });
    }
};

$(function() {
    app.initialize();
});
