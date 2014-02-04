function fetchAllYelpLocations(){
    $.ajax({
        url: "/yelp_locations",
        type: "get",
        dataType: "json",
        success: function(data){
            var location_array = data;
            location_array.forEach(function(location){
                var new_location = new Location(location);
            });
        }
    });
};


var YelpLocation = function(object){
    var self = this;
    this.name = object.name || null;
    this.tag = object.tag || null;
    this.address = object.address || object.location.display_address.join(" "); 
    this.id = object.id || null;
    this.distance_from_mid_meters = object.distance || null;
    this.rating = object.rating || null;
    this.image_url = object.image_url || null;

    this.geocode = function() {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': self.address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                self.lat = results[0].geometry.location.lat();
                self.lng = results[0].geometry.location.lng();
            }
        });
    };
    this.geocode();

    self.create = function(){
        var params = {
            location: {
                "tag": self.tag,
                "address": self.address,
                "long": self.lng,
                "lat": self.lat
            }
        };
        $.ajax({
            url: "/yelp_locations",
            data: params,
            type: "post",
            dataType: "json",
            success: function(data){
                console.log(data);
                self.id = data.id;
            }
        });
    };
    self.destroy = function(){
        $.ajax({
            url: "/yelp_locations/"+ this.id,
            type: "delete",
            dataType: "json",
            success: function(data){
                var deleted_locations = data;
                app.locations = app.locations.splice(deleted_locations, 1);
            }
        });

    };
    app.locations.push(self);
};
