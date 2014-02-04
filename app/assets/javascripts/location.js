

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


var Location = function(tag, address, lat, lng, id){
  var self = this;
  self.lat = lat;
  self.lng = lng;
  self.tag = tag;
  self.address = address;
  self.id = id;

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
 app.locations.push(self);
};


