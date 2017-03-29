gapi.infowindow = (function () {
    var mainInfoWindow = new google.maps.InfoWindow();

    /**
     * 点击marker显示infowindow
     * 
     * @param {any} marker 被点击的marker
     * @param {any} infowindow 创建的实例infowindow
     */
    function showInfoWindow(marker, infowindow) {
        var content = '<div>' + marker.title + '</div>';
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }
    }

    return {
        mainInfoWindow: mainInfoWindow,
        showInfoWindow: showInfoWindow
    };
}());
