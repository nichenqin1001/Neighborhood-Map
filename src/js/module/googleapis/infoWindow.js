gapi.infowindow = (function () {
    var mainInfoWindow = new google.maps.InfoWindow();

    /**
     * 点击marker显示infowindow
     * 
     * @param {any} marker 被点击的marker
     * @param {any} infowindow 创建的实例infowindow
     */
    function showInfoWindow(marker) {
        console.log(marker);
        var content = '<div>' + marker.title + '</div>';
        if (mainInfoWindow.marker != marker) {
            mainInfoWindow.marker = marker;
            mainInfoWindow.setContent(content);
            mainInfoWindow.open(map, marker);
        }
    }

    return {
        showInfoWindow: showInfoWindow
    };
}());