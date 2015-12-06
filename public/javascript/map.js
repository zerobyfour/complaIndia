var map;
function initMap() {
//	map = new google.maps.Map(document.getElementById('map'), {
//		center : {
//			lat : 22.000,
//			lng : 77.000
//		},
//		zoom : 5
//	});
	// Create the search box and link it to the UI element.
	autocompleteCom = new google.maps.places.Autocomplete(
		     (document.getElementById('search-map-auto-com')),
		      {types: ['geocode']});
	autocompleteReq = new google.maps.places.Autocomplete(
		     (document.getElementById('search-map-auto-req')),
		      {types: ['geocode']});
	autocompleteAd = new google.maps.places.Autocomplete(
		     (document.getElementById('search-map-auto-ad')),
		      {types: ['geocode']});
	var compScope = angular.element(
		    document.getElementById("complain_stuff")).scope();
	var reqScope = angular.element(
		    document.getElementById("request_stuff")).scope();
	var adScope = angular.element(
		    document.getElementById("advert_stuff")).scope();
	google.maps.event.addListener(autocompleteCom, 'place_changed', function() {
		var place = autocompleteCom.getPlace();
		compScope.$apply(function(){
			compScope.place = place.formatted_address;
			compScope.placeInfo = {};
			compScope.placeInfo.url = place.url;
			compScope.placeInfo.location = place.geometry.location;
			compScope.placeInfo.placeId = place.place_id;
			compScope.placeInfo.place = place.formatted_address;
		});
    });
	google.maps.event.addListener(autocompleteReq, 'place_changed', function() {
		var place = autocompleteReq.getPlace();
//		console.log(place);
		reqScope.$apply(function(){
			reqScope.place = place.formatted_address;
			reqScope.placeInfo = {};
			reqScope.placeInfo.url = place.url;
			reqScope.placeInfo.location = place.geometry.location;
			reqScope.placeInfo.placeId = place.place_id;
			reqScope.placeInfo.place = place.formatted_address;
		});
    });
	google.maps.event.addListener(autocompleteAd, 'place_changed', function() {
		var place = autocompleteAd.getPlace();
		adScope.$apply(function(){
			adScope.place = place;
			adScope.place = place.formatted_address;
			adScope.placeInfo = {};
			adScope.placeInfo.url = place.url;
			adScope.placeInfo.location = place.geometry.location;
			adScope.placeInfo.placeId = place.place_id;
			adScope.placeInfo.place = place.formatted_address;
		});
    });
}