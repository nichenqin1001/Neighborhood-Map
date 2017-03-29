view.map = (function () {
    var map,
        markers = [];

    /**
     * 供google map api调用
     * 
     */
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), gapi.map.mapOptions);

        for (var i = 0; i < data.parkList.length; i++) {
            var marker = new google.maps.Marker(gapi.marker.markerOptions[i]);
            markers.push(marker);
        }

        for (var j = 0; j < markers.length; j++) {
            markers[j].setMap(map);
        }


    }

    initMap();

    return {
        map: map,
        markers: markers
    };
}());
