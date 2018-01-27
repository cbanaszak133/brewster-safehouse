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
		beerList = [];
		latArr = [];

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
          
            var count = 0;

            for(var i = 0; i < beers.length; i++){
            	//console.log(!beers[i].glass.name.equals("undefined"));
            	var glass;
            	if(beers[i].breweries[0].hasOwnProperty('locations')){
            			if(typeof beers[i].glass == "undefined"){
            				glass = "N/A";
            			}
		            	$("#beer-table > tbody").append("<tr id='"+ count + "'><td>" + beers[i].name + "</td><td>" + beers[i].breweries[0].name + "</td><td>" 
		            		+ beers[i].abv + "%</td><td>" + beers[i].style.name + 
		            		 "</td><td>" + glass + "</td></tr>");

		            	beerList.push(beers[i]);
                        createMarker(beers[i]);
                        count++;
	            		
	            		
					}
        	}
    	});
        $("#beer-style").val("");
        initMap();

	}); 

	

	

    //Code for the Google Map is below, used brwery location information from
    //the BreweryDB

    var map;
    var markers = [];

    var infowindow;
    var service;
    var geocoder;
    var placeID;
    var beerList = [];
    var latArr = [];

    

    function createMarker(beer) {
        var lat = beer.breweries[0].locations[0].latitude;
        var lng = beer.breweries[0].locations[0].longitude;
        //console.log(beer.breweries[0].locations[0])
        var place = new google.maps.LatLng(lat, lng);
       	latArr.push(place);

        var streetAddress = beer.breweries[0].locations[0].streetAddress;
        var website = beer.breweries[0].locations[0].website;
        var name = beer.breweries[0].name;
        var city = beer.breweries[0].locations[0].locality;
        var state = beer.breweries[0].locations[0].region;

        var formatted_address = streetAddress + ", " + city + ", " + state;

        if(typeof website == "undefined"){
        	website = "";
        }
        
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

	function initMap() {
        
	    map = new google.maps.Map(document.getElementById('map'), {
	      zoom: 3,
	      center: new google.maps.LatLng(37.09024,-95.712891),
	      mapTypeId: 'terrain'
	    });
        infowindow = new google.maps.InfoWindow();
        
        geocoder = new google.maps.Geocoder;
        
	}; 

	//Zoom in on clicked beer in results table
	$(document).on("mouseover", "tr", function(){
	
		var id = $(this).attr('id');
		console.log(id);
		var place = latArr[id];
		map.setCenter(place);
		map.setZoom(10);


	});

	$(document).on("click", "tr", function(){
		$("#beer-info").empty();
		var id = $(this).attr('id');
		var beer = beerList[id];
		console.log(beer.name);	

		var beerName = $("<h2>");
		beerName.text(beer.name);
		$('#beer-info').append(beerName);

		if(typeof beer.labels != 'undefined'){
			var beerImg = $("<img>");
			beerImg.attr('src', beer.labels.medium);
			$('#beer-info').append(beerImg);
		}	

		var beerDsc = $("<p>");
		beerDsc.text(beer.description);
		$('#beer-info').append(beerDsc);


		document.getElementById('beer-popup').style.display = 'block';
		

		

	});

	$(document).on("click", "#beer-close", function(){
		document.getElementById('beer-popup').style.display = 'none'
	});

	// Get the user login modal
	var modal = document.getElementById('id01');
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}

    
 
            

	