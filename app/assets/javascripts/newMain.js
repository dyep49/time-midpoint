var map_div = $('#map')[0]
var mapOptions = {
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  zoom: 12,
  center: new google.maps.LatLng(40.7577, -73.9857)
};

var map = new google.maps.Map(map_div, mapOptions);

var coordinates = [];
var minutes = 10;        

var mapnificent, urbanDistance, positions = {};

var latlng_array = []

var get_coordinates = function(){
  var coordinate_array = coordinates[coordinates.length-1]
  $.each(coordinate_array, function(index, coordinates){
    var midx = coordinates.midx;
    var midy = coordinates.midy;
    var sqkm = coordinates.sqkm;
    latlng = mapnificent.getLatLngFromCanvasXY(midx, midy)
    latlng.sqkm = sqkm;
    latlng_array.push(latlng);
  });
  console.log(latlng_array);
};

function get_midpoint(){
  largest_blob = ''
  $.each(latlng_array, function(index, latlng){
    if (largest_blob.length === 0)
      {
        largest_blob = latlng;
      } 
    else if (latlng.sqkm > largest_blob.sqkm) 
      {
        largest_blob = latlng;
      }
    else {
      return;
    };
  });
  console.log(largest_blob);
  return largest_blob.lat.toString() + "," + largest_blob.lng.toString()
};



  function initialize(){
    var i = 0


    var UrbanDistanceUI = function(mapnificent, that, $, window, undefined){
      that.bind("setup", function(){
        var intersect = that.getOption("intersect");
        that.setOption("intersection", true);
        console.log("setup complete");
        alert("Testing" + minutes + "minutes");
      });

      that.bind("loadProgress", function(progress){
        $('#loading').text(progress);
        if(progress >= 100){
          $('#loading').text("Almost done...");
        }
      });

      that.bind("dataLoaded", function(){
        $.each(submit_stuff, function(index, stuff){
          var geopos = {lat: stuff.latitude, lng: stuff.longitude};
          var time = minutes * 60
          var pos = that.addPosition(geopos, time);
          positions[pos.index] = {position: pos, latlng: geopos};
          pos.startCalculation();
        })
      });

      that.bind("calculationStarted", function(position){
        $('#loading').text("Starting calculation");
      });

      that.bind("calculationUpdated", function(position){
        var percent = position.calculationProgress /
          that.getOption("estimatedMaxCalculateCalls") * 100;
          if (percent < 100) {
            $('#loading').text("Calculating: "+percent+"%");
          } else {
            $('#loading').text("Almost Done");
          }
      });

      that.bind("calculationDone", function(position){
        $('#loading').text("Calculation Done!");
        console.log("calc finished")
        mapnificent.trigger('redraw');
        getBlobs();
      });

      var getBlobs = function(){
        var blobs = that.search.detectBlobs();
        i += 1;
        coordinates.push(blobs);
        if (i === Object.keys(submit_stuff).length) {
          get_coordinates();
          if (latlng_array.length === 0){
            minutes +=5;
            mapnificent.destroy();
            $('iframe').remove();
            initialize();
          }
          else {
            var coordinate_string = get_midpoint();
            YELP(coordinate_string, 'cafe')();
            alert('yelp running');
          };
        };
      };
    };
  if(typeof Mapnificent !== "undefined" && Mapnificent.isBrowserSupported())
    {
    Mapnificent.forCoordinates({lat:40.7577,lng:-73.9857}, function(options){
      if(options == null){
        return;
      }

      mapnificent = Mapnificent(options);
      mapnificent.addLayer("urbanDistance", UrbanDistanceUI);
      mapnificent.bind("initDone", function(){
        // mapnificent.hide();
      });

      mapnificent.addToMap(map);
    });
  };
};

 
  $(document).ready(function(){
    $('#search-midpoint').click(function(){
      initialize();
    })
  });


var button = $('#search-midpoint');
var userLocation = $("#user-location");
var friendLocation = $("#friend-location");
var userCoordinate = {};
var friendCoordinate = {};
$(userLocation).geocomplete().bind("geocode:result", function(event, result){
  var latitude = result.geometry.location.d;
  var longitude = result.geometry.location.e;
    var locationInput = {};
    userCoordinate.latitude = latitude;
    userCoordinate.longitude = longitude;
    console.log(userCoordinate);
});
$(friendLocation).geocomplete().bind("geocode:result", function(event, result){
  var latitude = result.geometry.location.d;
  var longitude = result.geometry.location.e;
  friendCoordinate.latitude = latitude;
  friendCoordinate.longitude = longitude;
  console.log(friendCoordinate);
});

submit_stuff = {};
submit_stuff.user = userCoordinate;
submit_stuff.friend = friendCoordinate;
