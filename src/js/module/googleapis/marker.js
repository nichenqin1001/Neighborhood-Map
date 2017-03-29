gapi.marker = (function () {
    var markers = [];
    for (var i = 0; i < data.parkList.length; i++) {
        var park = data.parkList[i];
        var position = park.location;
        var title = park.address;
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP
        });
        markers.push(marker);
    }

    /**
     * 在地图中放置标记
     * 
     * @param {any} map google map 对象
     */
    function setMarkers(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    /**
     * 在地图中清楚标记
     * 
     * @param {any} markers 
     */
    function hideMarkers(markers) {
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            marker.setMap(null);
        }
    }

    return {
        markers: markers,
        setMarkers: setMarkers
    };
}());
