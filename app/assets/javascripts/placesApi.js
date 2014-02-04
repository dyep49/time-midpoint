$(function() {
	var button = $('#search-midpoint');
	var userLocation = $("#user-location");
	var friendLocation = $("#friend-location")
	$(friendLocation).geocomplete().bind("geocode:result", function(event, result){
		var latitude = result.geometry.location.d;
		var longitude = result.geometry.location.e;
    console.log(latitude);
    console.log(longitude);
  });
	$(userLocation).geocomplete().bind("geocode:result", function(event, result){
		var latitude = result.geometry.location.d;
		var longitude = result.geometry.location.e;
    console.log(latitude);
    console.log(longitude);
  });
});