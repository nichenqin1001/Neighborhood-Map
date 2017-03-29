window.gapi = app.module.googleapi = app.module.googleapi || {};

gapi.map = (function () {
    var mapOptions = {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    };

    return {
        mapOptions: mapOptions
    };

}());
