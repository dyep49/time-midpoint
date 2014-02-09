Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

var map_div = $('#map')[0]
var mapOptions = {
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  zoom: 12,
  center: new google.maps.LatLng(40.7577, -73.9857),
  disableDefaultUI: true,
  disableDoubleClickZoom: true,
  draggable: false,
  scrollwheel: false
};

var map = new google.maps.Map(map_div, mapOptions);

var coordinates = [];


var mapnificent, urbanDistance, positions = {};

var latlng_array = []

var activity;

var max_distance;

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

    var minutes = 10;


  function initialize(){
    $('.progress').show();
    var i = 0

    var UrbanDistanceUI = function(mapnificent, that, $, window, undefined){
      that.bind("setup", function(){
        console.log('testing' + minutes + 'minutes');
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
        $('#loading').text("Starting calculation " + (i+1) + " of " + coordinates_array.length + " (Searching for intersections within " + minutes + " minutes" + ")");
        $('#loading').fadeIn(1000);
        // $('#calc-map').fadeIn(3000);
      });

      that.bind("calculationUpdated", function(position){
        var percent = position.calculationProgress /
          that.getOption("estimatedMaxCalculateCalls") * 100;
          if (percent < 100) {
            $('#loading').text("Calculating: "+percent+"%");
            $('.progress-bar').css('width', percent + '%');
          } else {
            $('#loading').text("Almost Done");
          }
      });

      that.bind("calculationDone", function(position){
        $('.progress-bar').css('width', '100%');
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
             $('#loading').remove();
            YELP(coordinate_string, activity)();
            $('#results_map').fadeIn("slow");
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
      console.log(distances_array.max());
      if (distances_array.max() > 10) {
        minutes = 15;
      };

      if (distances_array.max() <= 1) {
        minutes = 5;
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
  var div_clone = $('.location-div').last().clone()
  $('.add-friend').remove();
  var last_div = $('.location-div').last()
  div_clone.insertAfter(last_div);
  var last_input = $('.location').last();
  addAutocomplete(last_input);
  last_input.val('');
  setSelect();
  clickFavorite();

  $('.add-friend').click(function(){
    appendInput();
  })
}

function My_Location(latitude, longitude){
    this.latitude = latitude;
    this.longitude = longitude;
  }

    
    
function addAutocomplete(location){
  $(location).geocomplete().bind("geocode:result", function(event, result){
    var latitude = result.geometry.location.d;
    var longitude = result.geometry.location.e;
    $('#search-midpoint').click(function(){
      var inputDiv = $('.input-container').children();
      coordinates_array.push(new My_Location(result.geometry.location.d, result.geometry.location.e));
      activity = $('.activity').val();
      find_max_distance();
      initialize();

    // fades out slowly

      inputDiv.slideUp()
      

      //We need to see how to show it without lagging
      
    })
    console.log(coordinates_array);
  });
}

  coordinates_array = []

$(document).ready(function(){

  //Hides everything excep input field

  $('#calc-map').hide();
  $('#results_map').hide();
  $('table').hide();
  $('.progress').hide();

  addAutocomplete('.location');

   $('.add-friend').click(function(){
    appendInput();
  })


});


distances_array = []


function callback(response, status){
  var distance = response.rows[0].elements[0].distance.text;
  console.log(distance);
  if (distance.match(/(km)/) === null) {
    parsed_distance = "0"
  }
  else {
    var parsed_distance = distance.match(/\d*[.]\d*/g)
    if (parsed_distance === null) {
      parsed_distance = distance.match(/\d+/g);
    } 
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
