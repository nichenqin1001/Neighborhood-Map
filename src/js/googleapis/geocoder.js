app.googleapi = app.googleapi || {};

app.googleapi.geocoder = (function () {
    function codeAddress() {
        var geocoder = new google.maps.Geocoder();
        app.data.parkList.forEach(function (park) {
            geocoder.geocode({
                address: park
            }, function (response, statue) {
                console.log(response);
            });
        });
    }

    return {
        codeAddress: codeAddress
    };
}());