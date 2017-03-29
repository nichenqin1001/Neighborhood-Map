view.map = (function () {
    var map;

    /**
     * 供google map api调用
     * 
     */
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), gapi.map.mapOptions);
    }

    initMap();
}());
