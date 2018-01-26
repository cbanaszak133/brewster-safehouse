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



		            	//var lat = beers[i].breweries[0].locations[0].latitude;
	            		//var lng = beers[i].breweries[0].locations[0].longitude;
                        createMarker(beers[i]);
	            		//var latLng = new google.maps.LatLng(lat, lng);
	            		
					}
        	}
    	});

	}); 

	

    //Code for the Google Map and Places is here
    var map;
    var markers = [];

    var infowindow;
    var service;
    var geocoder;
    var placeID;

    

    function createMarker(beer) {
        var lat = beer.breweries[0].locations[0].latitude;
        var lng = beer.breweries[0].locations[0].longitude;
        console.log(beer.breweries[0].locations[0])
        var place = new google.maps.LatLng(lat, lng);
        //var placeLoc = latLng.geometry.location;

        var streetAddress = beer.breweries[0].locations[0].streetAddress;
        var website = beer.breweries[0].locations[0].website;
        var name = beer.breweries[0].name;
        var city = beer.breweries[0].locations[0].locality;
        var state = beer.breweries[0].locations[0].region;

        var formatted_address = streetAddress + ", " + city + ", " + state;


        
        var marker = new google.maps.Marker({
          map: map,
          position: place
        });

        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent('<div><strong>' + name + '</strong><br>' 
             + formatted_address + '<br>' + "<a href='"+ website + "' >" + website + "</a>" + '</div>');
          infowindow.open(map, this);
        });
          
        }

        // console.log(placeLoc);
        // var marker = new google.maps.Marker({
        //   position: place.geometry.location,
        //   map: map
        // });
        // markers.push(marker);

        // var request = { reference: place.reference };

        // service.getDetails(request, function(details, status) {
        //     google.maps.event.addListener(marker, 'click', function() {
        //         infowindow.setContent(details.name + "<br />" + details.formatted_address);
        //         infowindow.open(map, this);
        //     });
        // });

        // google.maps.event.addListener(marker, 'click', function() {
        //   console.log(location.name);
        //   infowindow.setContent(location.name);
        //   infowindow.open(map, this);
        // });

    

    function callback(place, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){
            createMarker(place);
        }
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

    // function callback(results, status) {
    //     if (status == google.maps.places.PlacesServiceStatus.OK) {
    //     for (var i = 0; i < results.length; i++) {
    //         console.log(results[i]);
    //         createMarker(results[i]);
    //         }
    //     }
    // }


	function initMap() {
        
	    map = new google.maps.Map(document.getElementById('map'), {
	      zoom: 3,
	      center: new google.maps.LatLng(2.8,-187.3),
	      mapTypeId: 'terrain'
	    });
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
        geocoder = new google.maps.Geocoder;
        
	}; 

    
 
            

	