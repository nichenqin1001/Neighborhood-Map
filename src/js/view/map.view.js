app.view = app.view || {};

app.view.map = (function () {
    var map;

    /**
     * 供google map api调用
     * 
     */
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), app.googleapi.map.mapOptions);
        app.googleapi.geocoder.codeAddress();
    }

    initMap();
}());