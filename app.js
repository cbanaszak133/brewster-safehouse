	jQuery.ajaxPrefilter(function(options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });


	$("#run-search").on("click", function(){
		event.preventDefault();

		$("#beer-body").empty();
		clearMarkers();
		deleteMarkers();

		var beer = $("#beer-style").val().trim();

        var queryURL =  "https://api.brewerydb.com/v2/search?q=" + beer + 
        "&withBreweries=Y&type=beer&key=3be3e987ffecfe82a589838b384c138f&format=json";

        $.ajax({
            url: queryURL,
            method: "GET"
          }).done(function(response) {
            console.log(response);
            var beers = response.data;



            console.log(beers[0].breweries[0].name);
          
            

            for(var i = 0; i < beers.length; i++){
            	//console.log(!beers[i].glass.name.equals("undefined"));
            	if(beers[i].hasOwnProperty('glass') && 
            		beers[i].breweries[0].hasOwnProperty('locations')){
		            	$("#beer-table > tbody").append("<tr><td>" + beers[i].name + "</td><td>" + beers[i].breweries[0].name + "</td><td>" 
		            		+ beers[i].abv + "%</td><td>" + beers[i].style.name + 
		            		 "</td><td>" + beers[i].glass.name + "</td></tr>");



		            	var lat = beers[i].breweries[0].locations[0].latitude;
	            		var lng = beers[i].breweries[0].locations[0].longitude;

	            		var latLng = new google.maps.LatLng(lat, lng);
	            		addMarker(latLng);
					}
        	}
    	});

	}); 

	//api key: AIzaSyBRoBFgQ8l2qx8Q5JVqkyWcqc3SqcGBuBY
    var map;
    var markers = [];

    function addMarker(location) {
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });
        markers.push(marker);
    } 

    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
    }

    function clearMarkers() {
        setMapOnAll(null);
    }

    function showMarkers() {
        setMapOnAll(map);
    }

    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }


	function initMap() {
	    map = new google.maps.Map(document.getElementById('map'), {
	      zoom: 2,
	      center: new google.maps.LatLng(2.8,-187.3),
	      mapTypeId: 'terrain'
	    });
	}; 
 
            

	