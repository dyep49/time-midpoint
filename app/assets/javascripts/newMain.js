$(function() {

	var map_div = $('#mapnificent-map')[0];

  var mapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 12,
    center: new google.maps.LatLng(40.7577, -73.9857)
  };

  var map = new google.maps.Map(map_div, mapOptions);

  var coordinates = [[]];
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
          else {};
        });
        console.log(largest_blob);
        return largest_blob;
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

          	//Times Square
            var geopos = {lat: 40.7577, lng: -73.9857};
            var time = minutes *60;
            var pos = that.addPosition(geopos, time);

            // 55th and 5th ave
            // var geopos_2 = {lat: 40.7618, lng: -73.9754};
            // var time_2 = minutes *60;
            // var pos_2 = that.addPosition(geopos_2, time_2);


            // 7th st and Ave B
            var geopos_3 = {lat: 40.724788, lng: -73.980721};
            var time_3 = minutes *60;
            var pos_3 = that.addPosition(geopos_3, time_3);


            //Myrtle Ave and Vanderbilt Ave
            // var geopos_3 = {lat: 40.693766, lng: -73.969960};
            // var time_3 = minutes * 60;
            // var pos_3 = that.addPosition(geopos_3, time_3);

            positions[pos.index] = {position: pos, latlng: geopos};
            // positions[pos_2.index] = {position: pos_2, latlng: geopos_2};
            positions[pos_3.index] = {position: pos_3, latlng: geopos_3};

            pos.startCalculation();
            // pos_2.startCalculation();
            pos_3.startCalculation();
          });

          that.bind("calculationStarted", function(position){
            $('#loading').text("Starting calculation: 0.0%");
          });

          that.bind("calculationUpdated", function(position){
            var percent = position.calculationProgress /
              that.getOption("estimatedMaxCalculateCalls") * 100;
            $('#loading').text("Calculating: "+percent+"%");
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
            if (i == 2) {
              get_coordinates();
              if (latlng_array.length === 0){
                minutes +=5;
                mapnificent.destroy();
                $('iframe').remove();
                initialize();
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
      initialize();
    });
	// MAPNIFICENT

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

});
