var geocoder;
    var map;
    var infowindow = new google.maps.InfoWindow();
    var marker = null;
    var elevator;
    var countId=0;
    var countReal=0;
    var countRef=0;
    var max_poi=13;
    var indexManager = new Array();
    
    var directionsDisplay;
    var directionsService;
    var newLocation = null;
    var waypts = new Array();//["point0", "point1"];
    var stepPath = 0;
    var stepTimer = 0;
    var timerLoops = 0;

    var trafficLayer;

    var b1;
    var l1;
    var b2;
    var l2;
    var b3;
    var l3;
	

jQuery(document).ready(function() {
    b1 = document.getElementById( 'b1' );
    l1 = Ladda.create( b1 );
    b2 = document.getElementById( 'b2' );
    l2 = Ladda.create( b2 );
    b3 = document.getElementById( 'b3' );
    l3 = Ladda.create( b3 );
    
});
 
function initialize(x,y)
{
    var input = document.getElementById('address');
    var options = {
    };
    autocomplete = new google.maps.places.Autocomplete(input, options);  
    
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(x, y);
    var myOptions = {
        zoom: 10,
	panControl: false,
	zoomControl: true,
	mapTypeControl: true,
	zoomControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_BOTTOM
	},
        mapTypeControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_TOP,
	    mapTypeIds: [
		google.maps.MapTypeId.ROADMAP,
		google.maps.MapTypeId.SATELLITE
	      ]
	},
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	scrollwheel: false
    }
    
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    elevator = new google.maps.ElevationService();
    trafficLayer = new google.maps.TrafficLayer();
    
    // Try HTML5 geolocation
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(position) {
	    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	    
	    map.setCenter(pos);
	    map_recenter(0);
	    
	    geocoder.geocode({'latLng': pos}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		    if (results[0]) {
			if (marker != null) marker.setMap(null);
			marker = new google.maps.Marker({
			    position: pos,
			    map: map
			});
			
			infowindow.setContent('<div id="info_window">'+results[0].formatted_address+'<br/><strong>Latitude :</strong> ' + Math.round(position.coords.latitude*1000000)/1000000 + ' | <strong>Longitude :</strong> ' + Math.round(position.coords.longitude*1000000)/1000000 + '<br/><strong>URL</strong> : Proyecto UMG /' + locale + ' ' + Math.round(position.coords.latitude*1000000)/1000000 + '' + Math.round(position.coords.longitude*1000000)/1000000 + '<br/><br/>' + elevationButton() + addPoiButton(position.coords.latitude, position.coords.longitude, results[0].formatted_address) + '</div>');
			infowindow.open(map, marker);
						
			document.getElementById("address").value=results[0].formatted_address;
		    }
		}
		else {
		    if (marker != null) marker.setMap(null);
		    marker = new google.maps.Marker({
			position: pos,
			map: map
		    });
		    
		    infowindow.setContent('<div id="info_window">'+textNoGeocodingAddress+'<br/><strong>Latitude :</strong> ' + Math.round(position.coords.latitude*1000000)/1000000 + ' | <strong>Longitude :</strong> ' + Math.round(position.coords.longitude*1000000)/1000000 + '<br/><strong>URL</strong> : Proyecto UMG /' + locale + ' ' + Math.round(position.coords.latitude*1000000)/1000000 + '' + Math.round(position.coords.longitude*1000000)/1000000 + '<br/><br/>' + elevationButton() + addPoiButton(position.coords.latitude, position.coords.longitude, textNoGeocodingAddress) + '</div>');
		    infowindow.open(map, marker);
		   
		    document.getElementById("address").value=textNoGeocodingAddress;
		}
	    });
	    
	    document.getElementById("latitude").value=position.coords.latitude;
	    document.getElementById("longitude").value=position.coords.longitude;
	    ddversdms();
        }, function() {
	    map.setCenter(latlng);
	    
	    google.maps.event.addListenerOnce(map, 'idle', function(){
		map_recenter(0);
	    });	    
	    
	    marker = new google.maps.Marker({
		map: map,
		position: latlng
	    });
	    infowindow.setContent('Paris, France');
	    infowindow.setContent('<div id="info_window">Paris, France<br/><strong>Latitude :</strong> ' + Math.round(x*1000000)/1000000 + ' | <strong>Longitude :</strong> ' + Math.round(y*1000000)/1000000 + '<br/><strong>URL</strong> : Proyecto UMG ' + locale + ' ' + Math.round(x*1000000)/1000000 + ' ' + Math.round(y*1000000)/1000000 + '<br/><br/>' + elevationButton() + addPoiButton(x, y, 'Paris, France') + '</div>');
	    infowindow.open(map, marker);
	    ddversdms();
            
        });
    }
    else
    {
          // Browser doesn't support Geolocation
	    map.setCenter(latlng);

	google.maps.event.addListenerOnce(map, 'idle', function(){
	    map_recenter(latlng);
	});	    
	
	marker = new google.maps.Marker({
            map: map,
            position: latlng
        });
	infowindow.setContent(textBrowserNotGeo);
	infowindow.open(map, marker);
	ddversdms();
    }
    
    google.maps.event.addListener(map, 'click', codeLatLngfromclick);
    directionsDisplay = new DirectionsDisplay(map, document.getElementById("directionsPanel"));
    directionsService = new DirectionsRoute(directionsDisplay);
        
}

function initializeModify(x,y)
{
    var input = document.getElementById('address');
    var options = {
    };
    autocomplete = new google.maps.places.Autocomplete(input, options);  
    
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(x, y);
    var myOptions = {
        zoom: 10,
        center: latlng,
	panControl: false,
	zoomControl: true,
	mapTypeControl: true,
	zoomControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_BOTTOM
	},
        mapTypeControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_TOP,
	    mapTypeIds: [
		google.maps.MapTypeId.ROADMAP,
		google.maps.MapTypeId.SATELLITE
	      ]
	},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
	scrollwheel: false
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    
    elevator = new google.maps.ElevationService();
    google.maps.event.addListener(map, 'click', codeLatLngfromclick);
    directionsDisplay = new DirectionsDisplay(map, document.getElementById("directionsPanel"));
    directionsService = new DirectionsRoute(directionsDisplay);
    trafficLayer = new google.maps.TrafficLayer();

	var cleanWaypts = 0;
	var bounds = new google.maps.LatLngBounds();
	var Reorder = new Array();
	for(var i=0; i < indexManager.length; i++)
	{
	    y=indexManager[i];
	    if (document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_latitude') && document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_longitude') && document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_ordre'))
	    {
		Reorder[y]=new Array();
		Reorder[y][1] = parseFloat(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_ordre').value);
		Reorder[y][2] = y;
		cleanWaypts++;
	    }
	}	
	Reorder.sort(sortfunction);

	for(var i=0; i < cleanWaypts; i++)
	{
	    newLoc = new google.maps.LatLng(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_latitude').value, document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_longitude').value);
	    bounds.extend(newLoc);
	    placeMarker(newLoc, 2);
	    document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_ref').value = String.fromCharCode(65 + i);;
	}
	
	map.fitBounds(bounds);
    
    }

function initializeShow(x,y)
{
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(x, y);
    var myOptions = {
        zoom: 10,
        center: latlng,
	panControl: false,
	zoomControl: true,
	mapTypeControl: true,
	zoomControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_BOTTOM
	},
        mapTypeControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_TOP,
	    mapTypeIds: [
		google.maps.MapTypeId.ROADMAP,
		google.maps.MapTypeId.SATELLITE
	      ]
	},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
	scrollwheel: false
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    elevator = new google.maps.ElevationService();
    google.maps.event.addListener(map, 'click', codeLatLngfromclick);
    directionsDisplay = new DirectionsDisplay(map, document.getElementById("directionsPanel"));
    directionsService = new DirectionsRoute(directionsDisplay);
    trafficLayer = new google.maps.TrafficLayer();

	var cleanWaypts = 0;
	var bounds = new google.maps.LatLngBounds();
	var Reorder = new Array();
	for(var i=0; i < indexManager.length; i++)
	{
	    y=indexManager[i];
	    if (document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_latitude') && document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_longitude') && document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_ordre'))
	    {
		Reorder[y]=new Array();
		Reorder[y][1] = parseFloat(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_ordre').innerHTML);
		Reorder[y][2] = y;
		cleanWaypts++;
	    }
	}	
	Reorder.sort(sortfunction);

	for(var i=0; i < cleanWaypts; i++)
	{
	    newLoc = new google.maps.LatLng(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_latitude').innerHTML, document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_longitude').innerHTML);
	    bounds.extend(newLoc);
	    placeMarker(newLoc, 2);
	    document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_ref').innerHTML = String.fromCharCode(65 + i);;
	}
	
	map.fitBounds(bounds);
}
    
function initializeAdresse(x,y)
{
    var input = document.getElementById('address');
    var options = {
    };
    autocomplete = new google.maps.places.Autocomplete(input, options);  
    
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(x, y);
    var myOptions = {
        zoom: 10,
        center: latlng,
	panControl: false,
	zoomControl: true,
	mapTypeControl: true,
	zoomControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_BOTTOM
	},
        mapTypeControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_TOP,
	    mapTypeIds: [
		google.maps.MapTypeId.ROADMAP,
		google.maps.MapTypeId.SATELLITE
	      ]
	},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
	scrollwheel: false
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    elevator = new google.maps.ElevationService();
    
	marker = new google.maps.Marker({
            map: map,
            position: latlng
        });
	infowindow.setContent(adresseIvalid);
	infowindow.open(map, marker);
	ddversdms();
    
    google.maps.event.addListener(map, 'click', codeLatLngfromclick);
    directionsDisplay = new DirectionsDisplay(map, document.getElementById("directionsPanel"));
    directionsService = new DirectionsRoute(directionsDisplay);
    trafficLayer = new google.maps.TrafficLayer();
    
    $('#address_to_map').trigger('click');
    
}
    
function initializeGps(x,y)
{
    var input = document.getElementById('address');
    var options = {
    };
    autocomplete = new google.maps.places.Autocomplete(input, options);  
    
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(x, y);
    var myOptions = {
        zoom: 10,
        center: latlng,
	panControl: false,
	zoomControl: true,
	mapTypeControl: true,
	zoomControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_BOTTOM
	},
        mapTypeControlOptions: {
	    position: google.maps.ControlPosition.RIGHT_TOP,
	    mapTypeIds: [
		google.maps.MapTypeId.ROADMAP,
		google.maps.MapTypeId.SATELLITE
	      ]
	},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
	scrollwheel: false
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    google.maps.event.addListenerOnce(map, 'idle', function(){
	map_recenter(0);
    });	    
    elevator = new google.maps.ElevationService();
    
	marker = new google.maps.Marker({
            map: map,
            position: latlng
        });
	infowindow.setContent("latitude: " + x + ", longitude: " + y);
	infowindow.open(map, marker);
	ddversdms();
    
    google.maps.event.addListener(map, 'click', codeLatLngfromclick);
    directionsDisplay = new DirectionsDisplay(map, document.getElementById("directionsPanel"));
    directionsService = new DirectionsRoute(directionsDisplay);
    trafficLayer = new google.maps.TrafficLayer();
    
    infowindow.setContent('<div id="info_window"><strong>Latitude :</strong> ' + Math.round(x*1000000)/1000000 + ' | <strong>Longitude :</strong> ' + Math.round(y*1000000)/1000000 + '<br/><strong>URL</strong> : Proyecto UMG ' + locale + ' ' + Math.round(x*1000000)/1000000 + '/' + Math.round(y*1000000)/1000000 + '<br/><br/>' + elevationButton() + addPoiButton(x, y, "") + '</div>');
    infowindow.open(map, marker);
    
}

function placeMarker(location, origin) {
    waypts.push(waypts.length);
	newLocation = location;
	directionsDisplay.add_marker_(location, origin);
//	marker.setMap(null);
//	createDestinationTable();
	newLocation = null;
//	calcRoute();
  }

// Create list of destinations for editing.
function createDestinationTable() {
    var size = waypts.length;
    
    // Use the destinations in the text boxes.
    var locations = new Array();
    for(var x = 0; x < size && !(newLocation != null && x == size-1); x++)
	    locations.push((document.getElementById('dp_itibundle_itinerarytype_coordinates_'+x+'_latitude').value, document.getElementById('dp_itibundle_itinerarytype_coordinates_'+x+'_longitude').value));

    // Create table of destinations.
    // var htmlString = "<table id='tableWaypoints' cellspacing='0' cellpadding='2'>";
    // for(var x = 0; x < size; x++) {
    //	    (newLocation != null && x == size-1) ? loc = newLocation : loc = locations[x];
    //	    htmlString += "<tr id='" + x + "'>";
    //	    htmlString += "<td><b>" + String.fromCharCode(65 + x) + ": </b></td>";
    //	    htmlString += "<td><input type='text' id='point" + x + "' size=30 onchange='calcRoute();' value='" + loc + "'></td>";
    //	    htmlString += "</tr>";
    // }
    //htmlString += "</table>";
    //document.getElementById("waypointsPanel").innerHTML = htmlString;

    // Since the points were reorded, we need to make the new waypoints array in order.
    waypts = new Array();
    for(var i=0; i < size; i++)
	    waypts.push("point" + i)
}

// Calculate directions between a set of waypoints.
function calcRoute() {
	// Remove empty destinations.
	//for(var x = 0; x < waypts.length; x++)
	//	if(document.getElementById(waypts[x]).value == "") {
	//		waypts.splice(x,1);
	//		x--;
	//	}
	// createDestinationTable();
	// Get list of addresses from indexing array.
	
	l1.start();
	l2.start();
	l3.start();
	stepPath = 0;
	stepTimer = 0;
	timerLoops = 0;
	var cleanWaypts = 0;
	
	if (markers) {
	    for (i in markers)
	    {
		markers[i].setMap(null);
	    }
	    markers.length = 0;
	}
	infowindow.setMap(null);
	var all_points = new Array();
	var Reorder = new Array();
	var latWaypts;
	var lngWaypts;
	var addressWaypts;
	var orderWaypts;
	
	for(var i=0; i < indexManager.length; i++)
	{
	    y=indexManager[i];
	    if (document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_ordre') && (($.isNumeric(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_latitude').value) && $.isNumeric(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_longitude').value)) || document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_address')!="" ))
	    {
		Reorder[y]=new Array();
		Reorder[y][1] = parseFloat(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+y+'_ordre').value);
		Reorder[y][2] = y;
		cleanWaypts++;
	    }
	}	
	Reorder.sort(sortfunction);
	
	indexManager.length = 0;
	for(var i=0; i < cleanWaypts; i++)
	{
	    indexManager[i] = Reorder[i][2];
	    if ($.isNumeric(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_latitude').value) && $.isNumeric(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_longitude').value))
	    newLoc = new google.maps.LatLng(document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_latitude').value, document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_longitude').value);
	    else newLoc = '"' + document.getElementById('dp_itibundle_itinerarytype_coordinates_'+Reorder[i][2]+'_address').value + '"';
	    all_points.push({
		    location:newLoc,
		    stopover:true
	    });
	    placeMarker(newLoc, 2);
	}
  
	// Get which method of travel is to be used.
    var selectedMode = "DRIVING";
	
    if (cleanWaypts > 1)
    {
	countRef = all_points.length;
	    // Calculate directions and display results.
	marker.setMap(null);

	directionsService.route(all_points, selectedMode, false, false, false, "km");
    }
    else
    {
	alertPerso(textError, textNotEnoughPoi);
	l1.stop();
	l2.stop();
	l3.stop();
    }
}

function sortfunction(a, b)
{
    return (a[1] - b[1]) //causes an array to be sorted numerically and ascending
}
  
function codeAddress()
{
    var address = document.getElementById("address").value;
    var latres;
    var lngres;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
	map_recenter(0);
	if (marker != null) marker.setMap(null);
	marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
	latres = results[0].geometry.location.lat();;
	lngres = results[0].geometry.location.lng();
	infowindow.setContent('<div id="info_window">' + document.getElementById("address").value + '<br/><strong>Latitude :</strong> ' + Math.round(latres*1000000)/1000000 + ' | <strong>Longitude :</strong> ' + Math.round(lngres*1000000)/1000000 + '<br/><strong>URL</strong> : Proyecto UMG' + locale + ' ' + Math.round(latres*1000000)/1000000 + ' ' + Math.round(lngres*1000000)/1000000 + '<br/><br/>' + elevationButton() + addPoiButton(latres, lngres, document.getElementById("address").value) + '</div>');
        infowindow.open(map, marker);
	document.getElementById("latitude").value=latres;
	document.getElementById("longitude").value=lngres;
	ddversdms();
        }
        else
        {
	    alertPerso(textError, textGeocodingFail + ': ' + status);
        }
    });
}
  
function codeLatLng(origin)
{
    var lat = parseFloat(document.getElementById("latitude").value);
    var lng = parseFloat(document.getElementById("longitude").value);
    var latlng = new google.maps.LatLng(lat, lng);
    if (origin==1) ddversdms();
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
        { 
            if (results[0])
            {
                if (marker != null) marker.setMap(null);
                marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                infowindow.setContent('<div id="info_window">' + results[0].formatted_address + '<br/><strong>Latitude :</strong> ' + Math.round(lat*1000000)/1000000 + ' | <strong>Longitude :</strong> ' + Math.round(lng*1000000)/1000000 + '<br/><strong>URL</strong> : Proyecto UMG ' + locale + ' ' + Math.round(lat*1000000)/1000000 + ' ' + Math.round(lng*1000000)/1000000 + '<br/><br/>' + elevationButton() + addPoiButton(lat, lng, results[0].formatted_address) + '</div>');
                infowindow.open(map, marker);
                document.getElementById("address").value=results[0].formatted_address;
            }
        }
        else
        {
	    if (marker != null) marker.setMap(null);
	    marker = new google.maps.Marker({
		position: latlng,
		map: map
	    });
	    infowindow.setContent('<div id="info_window">' + textNoGeocodingAddress + '<br/><strong>Latitude :</strong> ' + Math.round(lat*1000000)/1000000 + ' | <strong>Longitude :</strong> ' + Math.round(lng*1000000)/1000000 + '<br/><strong>URL</strong> : Proyecto UMG ' + locale + ' ' + Math.round(lat*1000000)/1000000 + ' ' + Math.round(lng*1000000)/1000000 + '<br/><br/>' + elevationButton() + '<br/>' + addPoiButton(lat, lng, textNoGeocodingAddress) + '</div>');
	    infowindow.open(map, marker);
	    document.getElementById("address").value=textNoGeocodingAddress;
        }
    });
    map.setCenter(latlng);
    map_recenter(0);
}
  
function codeLatLngfromclick(event)
{
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var latlng = event.latLng;
    geocoder.geocode({'latLng': latlng}, function(results, status)
    {
        if (status == google.maps.GeocoderStatus.OK)
        {
            if (results[0])
            {
                if (marker != null) marker.setMap(null);
                marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                infowindow.setContent('<div id="info_window">' + results[0].formatted_address + '<br/><strong>Latitude :</strong> ' + Math.round(lat*1000000)/1000000 + ' | <strong>Longitude :</strong> ' + Math.round(lng*1000000)/1000000 + '<br/><strong>URL</strong> : Proyecto UMG /' + locale + ' ' + Math.round(lat*1000000)/1000000 + ' ' + Math.round(lng*1000000)/1000000 + '<br/><br/>' + elevationButton() + addPoiButton(lat, lng, results[0].formatted_address) + '</div>');
                infowindow.open(map, marker);
                document.getElementById("address").value=results[0].formatted_address;
                document.getElementById("latitude").value=lat;
                document.getElementById("longitude").value=lng;
                ddversdms();
            }
        }
        else
        {
	    if (marker != null) marker.setMap(null);
	    marker = new google.maps.Marker({
		position: latlng,
		map: map
	    });
	    infowindow.setContent('<div id="info_window">'+ textNoGeocodingAddress + '<br/><strong>Latitude :</strong> ' + Math.round(lat*1000000)/1000000 + ' | <strong>Longitude :</strong> ' + Math.round(lng*1000000)/1000000 + '<br/><strong>URL</strong> : Proyecto UMG ' + locale + ' ' + Math.round(lat*1000000)/1000000 + ' ' + Math.round(lng*1000000)/1000000 + '<br/><br/>' + elevationButton() + addPoiButton(lat, lng, textNoGeocodingAddress) + '</div>');
	    infowindow.open(map, marker);
	    document.getElementById("address").value=textNoGeocodingAddress;
        }
    });
}

function getElevation()
{
    var locations = [];
    
    var get_elevation = document.getElementById( 'get_elevation' );
    var get_elevation_ladda = Ladda.create( get_elevation );
    get_elevation_ladda.start();

    // Retrieve the clicked location and push it on the array
    var clickedLocation = new google.maps.LatLng(marker.position.lat(),marker.position.lng());
    locations.push(clickedLocation);

    // Create a LocationElevationRequest object using the array's one value
    var positionalRequest = {
        'locations': locations
    }

    // Initiate the location request
    elevator.getElevationForLocations(positionalRequest, function(results, status) {
        if (status == google.maps.ElevationStatus.OK) {

        // Retrieve the first result
        if (results[0]) {

        // Open an info window indicating the elevation at the clicked position
        document.getElementById("altitude").innerHTML = "<strong>" + textElevation + " :</strong> " + Math.floor(results[0].elevation) + " " + textMeter;
        } else {
        document.getElementById("altitude").innerHTML = textElevationNoResult;
      }
    } else {
      document.getElementById("altitude").innerHTML = textElevationError + ": " + status;
    }
  });
}  
  
function ddversdms()
{
    var lat, lng, latdeg, latmin, latsec, lngdeg, lngmin, lngsec;
    lat=document.getElementById("latitude").value;	
    lng=document.getElementById("longitude").value;
    if (lat>0) document.getElementById("nord").checked=true;
    if (lat<0) document.getElementById("sud").checked=true;
    if (lng>0) document.getElementById("est").checked=true;
    if (lng<0) document.getElementById("ouest").checked=true;
    lat=Math.abs(lat);	
    lng=Math.abs(lng);
    latdeg=Math.floor(lat);
    latmin=Math.floor((lat-latdeg)*60);
    latsec=Math.round((lat-latdeg-latmin/60)*1000*3600)/1000;
    lngdeg=Math.floor(lng);
    lngmin=Math.floor((lng-lngdeg)*60);
    lngsec=Math.floor((lng-lngdeg-lngmin/60)*1000*3600)/1000;
    document.getElementById("latitude_degres").value=latdeg;
    document.getElementById("latitude_minutes").value=latmin;
    document.getElementById("latitude_secondes").value=latsec;
    document.getElementById("longitude_degres").value=lngdeg;
    document.getElementById("longitude_minutes").value=lngmin;
    document.getElementById("longitude_secondes").value=lngsec;
}
  
function dmsversdd()
{
    var lat, lng, nordsud, estouest;
    if (document.getElementById("sud").checked) nordsud=-1;
    else nordsud=1;
    if (document.getElementById("ouest").checked) estouest=-1;
    else estouest=1;
    lat=nordsud * (parseFloat(document.getElementById("latitude_degres").value) + parseFloat(document.getElementById("latitude_minutes").value)/60 + parseFloat(document.getElementById("latitude_secondes").value)/3600);
    lng=estouest * (parseFloat(document.getElementById("longitude_degres").value) + parseFloat(document.getElementById("longitude_minutes").value)/60 + parseFloat(document.getElementById("longitude_secondes").value)/3600);
    document.getElementById("latitude").value=Math.round(lat*10000000)/10000000;
    document.getElementById("longitude").value=lng;
}

function elevationButton()
{
    return '<span id="altitude"><input id="get_elevation" type="button" class="submit_button btn btn-primary btn-xs" value="' + textGetElevation + '" onclick="getElevation()"></span>&nbsp;';
}

function addPoiButton(x,y,address)
{
    address=address.replace(/'/g, "&rsquo;");
    return '<span id="add_poi"><input type="button" class="add_poi btn btn-primary btn-xs" value="' + textAddPoi +'" onclick="addPOI(' + x + ',' + y + ',\'' + address +'\')"></span>';
}

function map_recenter(latlng) {

    var winWidth = $( window ).width();
    if (winWidth>=768)
    {
	var offsetx = $('#tools').width()/2;
	var offsety = 0;
	var point1 = map.getProjection().fromLatLngToPoint(
	    (latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
	);
	var point2 = new google.maps.Point(
	    ( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom()) ) || 0,
	    ( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom()) ) || 0
	);  
	map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(
	    point1.x - point2.x,
	    point1.y + point2.y
	)));
    }
}

function add_px_bound(latlng,offsetx,offsety) {
    var point1 = map.getProjection().fromLatLngToPoint(
        (latlng instanceof google.maps.LatLng) ? latlng : map.getBounds().getSouthWest()
    );
    var point2 = new google.maps.Point(
        ( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom()) ) || 0,
        ( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom()) ) || 0
    );  
    return map.getProjection().fromPointToLatLng(new google.maps.Point(
        point1.x - point2.x,
        point1.y + point2.y
    ));
}

function cleanMarkers() {
    if (markers) {
	for (i in markers)
	{
	    markers[i].setMap(null);
	}
	markers.length = 0;
    }
    var count = 1;
    $("ul#coordinates_sortable li").each(function(i){
	var order = $(this).find(".class_order").val();
	var latitude = $(this).find(".class_latitude").val();
	var longitude = $(this).find(".class_longitude").val();
	if ($.isNumeric(latitude) && $.isNumeric(longitude))
	{
	    var newMark = new google.maps.LatLng(latitude, longitude);
	    if (count>=100) count = 100;
	    var newMarkPath = markerPath + count + '.png';
	    markers.push(new google.maps.Marker({
		    position:  newMark,
		    map:  map,
		    icon: {
			url: newMarkPath,
			size: new google.maps.Size(48, 64),
			scaledSize: new google.maps.Size(24, 32),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(12, 32),
		    },
		    anchorPoint: new google.maps.Point(0, -32)
	    }));
	}
	count++;
    });
}

function alertPerso(modTitle, modBody) {
    $('#myModalLabel').html(modTitle);
    $('#myModalBody').html(modBody);
    $('#myModal').modal();
}