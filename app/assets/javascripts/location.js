

function fetchAllLocations(){
  $.ajax({
    url: "/locations",
    type: "get",
    dataType: "json",
    success: function(data){
      console.log(data);
      var location_array = data;
      location_array.forEach(function(location){
        var new_location = new Location(location.lat, location.lng, location.tag, location.id)
      })
    }
  })
};


var Location = function(tag, address, id){
  var self = this;
  self.tag = tag;
  self.address = address;
  self.lng; 
  self.lat;
  self.id = id;


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
      "lat": self.lat,
    }
  }
    $.ajax({
      url: "/locations",
      data: params,
      type: "post",
      dataType: "json",
      success: function(data){
        console.log(data);
        self.id = data.id
      }
    })
  }
  self.destroy = function(){
    $.ajax({
      url: "/locations/"+ this.id,
      type: "delete",
      dataType: "json",
      success: function(data){
        var deleted_locations = data
        array = array.splice(deleted_locations, 1)
      }
    })

  }

  
  self.update = function(tag, address) {

      var params = {
        "tag": tag,
        "address": address,
        "long": lng,
        "lat": lat,
      }

    $.ajax({
      url: "/locations/"+ this.id,
      type: "put",
      dataType: "json",
      data: params,
      success: function(data){
        console.log(data);
      }
        //this needs also to update long anf lat 

    })

  }
 app.locations.push(self);
};


