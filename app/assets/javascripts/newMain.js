$(function() {

	//MAPNIFICENT

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

