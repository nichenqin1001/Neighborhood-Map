gapi.geocoder = (function () {
    var geocoder = new google.maps.Geocoder();

    function onListClick(location) {
        geocoder.geocode({
            'location': location
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    view.map.map.panTo(location);
                    view.map.map.setZoom(15);
                    gapi.marker.tempMarker.setPosition(location);
                    gapi.marker.tempMarker.setMap(view.map.map);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    return {
        onListClick: onListClick
    };
}());