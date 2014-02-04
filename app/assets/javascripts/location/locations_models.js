var location_model = {
    Location: function( yelp_obj ) {
        var self = this;

        this.name = yelp_obj.name;
        this.address = yelp_obj.location.display_address.join(" ");
        this.rating = yelp_obj.rating;
        this.category = yelp_obj.categories[0][0];
        this.distance_from_mid_meters = yelp_obj.distance;
        this.image_url = yelp_obj.image_url;

        this.geocode = function() {
            var geocoder = new google.maps.Geocoder();
            var address = self.address;
            geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    self.latitude = results[0].geometry.location.lat();
                    self.longitude = results[0].geometry.location.lng();
                }
            });
        };
        this.geocode();
        app.locations.push( this );

    }
};
