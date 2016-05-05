// Get the div that holds the collection of coordinates
var sitios=[];
var collectionHolder = $('ul.coordinates');
var $newLinkLi=$("#new_link_li");
// setup an "add a coordinate" link
//var $addCoordinateLink = $('<div class="row"><div class="col-sm-12 text-right"><button class="btn btn-primary">Add a POI</button></div></div>');
//var $newLinkLi = $('<li class="ui-state-disabled"></li>').append($addCoordinateLink);

jQuery(document).ready(function() {
    // add a delete link to all of the existing coordinate form li elements
    $('.directions_button').on('click', function(e) {
        e.preventDefault();
    });
    
    collectionHolder.find('li.coordinate_container').each(function() {
        
        addCoordinateFormDeleteLink($(this), countId);
        indexManager.push(countId);
        
        var newAddressInput = document.getElementById('dp_itibundle_itinerarytype_coordinates_'+countId+'_address');
        var newAddrInput = $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_address');
        var newLatInput = $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_latitude');
        var newLngInput = $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_longitude');
        var newOptions = {
        };
        var newAutocomplete = new google.maps.places.Autocomplete(newAddressInput, newOptions);
    
        google.maps.event.addListener(newAutocomplete, 'place_changed', function() {
            newAddrInput.attr('data-place', 1);
            
            var place = newAutocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            
            newLatInput.val(place.geometry.location.lat());
            newLngInput.val(place.geometry.location.lng());
            
            var newMarkerLoc = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
            cleanMarkers();
        });

        countId++; countReal++; countRef++;
    });
    $('#coordinates_sortable').sortable({
        update: function() { reorder() },
        items: "li:not(.ui-state-disabled)",
        axis: "y"
    });
    
    // add the "add a coordinate" anchor and li to the coordinates ul
    //collectionHolder.append($newLinkLi);

    $('#add_poi_li').on('click', function(e) {
        // prevent the link from creating a "#" on the URL
        e.preventDefault();
      
        // add a new coordinate form (see next code block)
        addCoordinateForm(collectionHolder, $newLinkLi, "", "", "");
    });

    $('#itiform').on('input', '.class_address', function(e) {
        var $li = $(this).closest('li');
        $li.find('.class_latitude').val("");
        $li.find('.class_longitude').val("");
        $(this).attr('data-place', 0);
    });

    $('#itiform').on('input', '.class_latitude', function(e) {
        var $li = $(this).closest('li');
        $li.find('.class_address').val("").attr('data-place', 0);
    });
    
    $('#itiform').on('input', '.class_longitude', function(e) {
        var $li = $(this).closest('li');
        $li.find('.class_address').val("").attr('data-place', 0);
    });
    
    $('#itiform').on('keypress', '.class_coordinate', function(e) {
        //Enter key
        if (e.which == 13) {
            e.preventDefault();
            var latEntered = $(this).closest('li').find('.class_latitude').val();
            var lngEntered = $(this).closest('li').find('.class_longitude').val();
            var addrEntered = $(this).closest('li').find('.class_address');
            var inputs = $(this).closest('li').find('input');
            if ($.isNumeric(latEntered) && $.isNumeric(lngEntered))
            {
                inputs.attr("readonly", true);
                var latlngEntered = new google.maps.LatLng(latEntered, lngEntered);
                geocoder.geocode( {'latLng': latlngEntered}, makeCallback(addrEntered, inputs));
            }
            return false;
        }
    });

    $('#itiform').on('keypress', '.class_address', function(e) {
        //Enter key
        if (e.which == 13) {
            e.preventDefault();
            var latEntered = $(this).closest('li').find('.class_latitude');
            var lngEntered = $(this).closest('li').find('.class_longitude');
            var addrEntered = $(this).closest('li').find('.class_address').val();
            var inputs = $(this).closest('li').find('input');
            if (addrEntered!="")
            {
                inputs.attr("readonly", true);
                geocoder.geocode( {'address': addrEntered}, makeCallbackAddr(latEntered, lngEntered, inputs));
            }
            return false;
        }
    });
    
});

function makeCallback(addrEntered, inputs) {
    var geocodeCallBack = function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
        { 
            if (results[0])
            {
                addrEntered.val(results[0].formatted_address);
                cleanMarkers();
            }
        }
        else
        {
            //addrEntered.val(textNoResolvedAddress);
        }
        inputs.attr("readonly", false);
    }
    return geocodeCallBack;
}

function makeCallbackAddr(latEntered, lngEntered, inputs) {
    var geocodeCallBack = function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
        { 
            if (results[0])
            {
                latEntered.val(results[0].geometry.location.lat());
                lngEntered.val(results[0].geometry.location.lng());
                cleanMarkers();
            }
        }
        else
        {
        }
        inputs.attr("readonly", false);
    }
    return geocodeCallBack;
}

function addCoordinateForm(collectionHolder, $newLinkLi, lat, lng, address) {
    // Get the data-prototype we explained earlier
    var prototype = collectionHolder.attr('data-prototype');

    // Replace '__name__' in the prototype's HTML to
    // instead be a number based on the current collection's length.
    var newForm = prototype.replace(/__name__/g, countId);

    // Display the form in the page in an li, before the "Add a coordinate" link li
    var $newGroup1 = $('<div class="input-group"></div>').append(newForm);
    var $newGroup2 = $('<div class="form-group"></div>').append($newGroup1);
    var $newGroup3 = $('<div class="form-inline"></div>').append($newGroup2);

    var $newFormLi = $('<li class="coordinate_container"></li>').append($newGroup3);
	    
    $newLinkLi.before($newFormLi);
    // add a delete link to the new form
    addCoordinateFormDeleteLink($newFormLi, countId);
    $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_address').val(address);
    $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_latitude').val(lat);
    $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_longitude').val(lng);
    $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_ordre').val($newFormLi.index()+1);
    $newFormLi.find('span.order_marker').html($newFormLi.index()+1);
    
    var newAddressInput = document.getElementById('dp_itibundle_itinerarytype_coordinates_'+countId+'_address');
    var newAddrInput = $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_address');
    var newLatInput = $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_latitude');
    var newLngInput = $('#dp_itibundle_itinerarytype_coordinates_'+countId+'_longitude');
    
    var newOptions = {
    };
    var newAutocomplete = new google.maps.places.Autocomplete(newAddressInput, newOptions);

    google.maps.event.addListener(newAutocomplete, 'place_changed', function() {
        newAddrInput.attr('data-place', 1);
        
        var place = newAutocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        
        newLatInput.val(place.geometry.location.lat());
        newLngInput.val(place.geometry.location.lng());
        var newMarkerLoc = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
        cleanMarkers();
    });
    
    indexManager.push(countId);
    countId++; countReal++; countRef++;
}

function geocodeAddress(inp)
{
    //alert( inp.attr('data-place') );
}

function addCoordinateFormDeleteLink($coordinateFormLi, removeId) {
    var $contenant=$coordinateFormLi.find('div.input-group');
    var $removeFormA = $('<button type="button" data-countid="'+removeId+'" class="btn btn-danger" aria-label="Delete"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
    var $target=$('<div class="input-group-btn"></div>').append($removeFormA);
    var $dragAndDrop = $('<a class="btn btn-primary" aria-label="Reorder" title="Drag & Drop"><span class="glyphicon glyphicon-sort draggable_icon" aria-hidden="true"></span></a>');
    
    $target.append($dragAndDrop);
    $contenant.append($target);

    $removeFormA.on('click', function(e) {       
        // prevent the link from creating a "#" on the URL
        e.preventDefault();

        // remove the li for the coordinate form
        $coordinateFormLi.remove();
        countReal--;
        reorder();
        //var indexDel = indexManager.indexOf(parseInt($(this).attr('data-countid')));
        //markers[indexDel].setMap(null);
        //markers.splice(indexDel,1);
        //indexManager.splice(indexDel,1);
        //marker.setMap(null);
    });
}

function reorder() {
    $("ul#coordinates_sortable li").each(function(i){
     $(this).find(".class_ordre").val($(this).index()+1);
     $(this).find(".order_marker").html($(this).index()+1);
    });
    cleanMarkers();
}

function addPOI(x,y,address)
{

    var lastLi = $("#coordinates_sortable li:last").prev("li");
    if (lastLi.length)
    {
        var lastLat = lastLi.find('.class_latitude');
        var lastLng = lastLi.find('.class_longitude');
        var lastAddr = lastLi.find('.class_address');
        if(lastLat.val()=="" && lastLng.val()=="" && lastAddr.val()=="")
        {
            lastLat.val(x);
            lastLng.val(y);
            lastAddr.val(address);
        }
        else
        {
            addCoordinateForm(collectionHolder, $newLinkLi, x, y, address);

        }
    }
    else
    {
        addCoordinateForm(collectionHolder, $newLinkLi, x, y, address);

    }
    cleanMarkers();
    marker.setMap(null);
    infowindow.open(map, markers[markers.length-1]);
    var nowid=countId-1;
    document.getElementById("add_poi").innerHTML = "&nbsp;&nbsp;" + textPoiAdded;
}
