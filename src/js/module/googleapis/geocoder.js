window.gapi = app.module.googleapi = app.module.googleapi || {};

gapi.geocoder = (function () {
    function codeAddress() {
        var geocoder = new google.maps.Geocoder();
        app.data.parkList.forEach(function (park) {
            geocoder.geocode({
                address: park
            }, function (response, statue) {});
        });
    }

    return {
        codeAddress: codeAddress
    };
}());
