gapi.geocoder = (function () {
    var parkLocations = [];
    var geocoder = new google.maps.Geocoder();
    app.data.parkList.forEach(function (park) {
        geocoder.geocode({
            address: park
        }, function (response, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                parkLocations.push(response[0]);
            }
        });
    });

    return {
        parkLocations: parkLocations
    };
}());
