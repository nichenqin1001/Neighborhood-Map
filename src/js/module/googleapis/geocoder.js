gapi.geocoder = (function () {
    var geocoder = new google.maps.Geocoder();

    function onListClick(location) {
        geocoder.geocode({
            'location': location
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    view.map.map.setCenter(location);
                    view.map.map.setZoom(15);
                    var marker = new google.maps.Marker({
                        position: location,
                        map: view.map.map
                    });
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
