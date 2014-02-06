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
  var midpoint_blobs = coordinates[coordinates.length-1]
  $.each(midpoint_blobs, function(index, coordinates){
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
    find_max_distance();
    console.log(distances_array);


    var UrbanDistanceUI = function(mapnificent, that, $, window, undefined){
      that.bind("setup", function(){
        alert('testing' + minutes + 'minutes');
        var intersect = that.getOption("intersect");
        that.setOption("intersection", true);
        console.log("setup complete");
      });

      that.bind("loadProgress", function(progress){
        $('#loading').text(progress);
        if(progress >= 100){
          $('#loading').text("Almost done...");
        }
      });

      that.bind("dataLoaded", function(){
        console.log(coordinates_array);
        $.each(coordinates_array, function(index, coordinate){
          var geopos = {lat: coordinate.latitude, lng: coordinate.longitude};
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
        console.log("calc finished");
        mapnificent.trigger('redraw');
        getBlobs();
      });

      var getBlobs = function(){
        var blobs = that.search.detectBlobs();
        i += 1;
        coordinates.push(blobs);
        if (i === Object.keys(coordinates_array).length) {
          get_coordinates();
          if (latlng_array.length === 0){
            minutes +=5;
            mapnificent.destroy();
            $('iframe').remove();
            initialize();
          }
          else {
            var coordinate_string = get_midpoint();
            mapnificent.destroy();
            $('#map').remove();
            $('iframe').remove();
            YELP(coordinate_string, 'cafe')();
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

function appendInput(){
  var input = "<input class='location input form-control'>"
  var inputs = $('.location');
  var last_input = inputs.last();
  $(input).insertAfter(".add-friend");
  $('.add-friend').remove();
  var new_last_input = $('.location').last();
  $("<button class='add-friend'>Add</button>").insertAfter(new_last_input);
  addAutocomplete(new_last_input);
     $('.add-friend').click(function(){
    appendInput();
  })
}

function Location(latitude, longitude){
    this.latitude = latitude;
    this.longitude = longitude;
  }

    
    
function addAutocomplete(location){
  $(location).geocomplete().bind("geocode:result", function(event, result){
    var latitude = result.geometry.location.d;
    var longitude = result.geometry.location.e;
    $('#search-midpoint').click(function(){
      coordinates_array.push(new Location(result.geometry.location.d, result.geometry.location.e))
      initialize()
;    })
    console.log(coordinates_array);
  });
}

  coordinates_array = []

$(document).ready(function(){

  addAutocomplete('.location');

   $('.add-friend').click(function(){
    appendInput();
  })


});











// var inputs = $('.location')

// coordinates_array = []

// function fetchLocations(locationInputs){
//   $.each(locationInputs, function(index, input){
//     console.log(input);
//     input = input.val();



//   })
// }


// var friendLocation = $("#friend-location");



distances_array = []


function callback(response, status){
  var distance = response.rows[0].elements[0].distance.text;
  var parsed_distance = distance.match(/\d*[.]\d*/g)
  if (parsed_distance === null) {
    parsed_distance = distance.match(/\d+/g);
  }
  var distance_float = parseFloat(parsed_distance[0])
  distances_array.push(distance_float);
}

function find_max_distance(){
  $.each(coordinates_array, function(index, coordinates){
    var coordinates = coordinates;
    $.each(coordinates_array, function(index, other_coordinates){
      var origin = new google.maps.LatLng(coordinates.latitude, coordinates.longitude)
      var destination = new google.maps.LatLng(other_coordinates.latitude, other_coordinates.longitude);
      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.WALKING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, callback);
    });
  });
}
