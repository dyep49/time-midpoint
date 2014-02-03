var location_model = {
    Location: function( yelp_obj ) {
        var self = this;

        this.name = yelp_obj.name;
        this.address = yelp_obj.location.display_address.join(" ");
        this.rating = yelp_obj.rating;
        this.category = yelp_obj.categories[0][0];
        this.distance_from_mid_meters = yelp_obj.distance;
        this.image_url = yelp_obj.image_url;

        app.locations.push( this );
    }
};
