view.map = (function () {
    var map;

    /**
     * 供google map api调用
     * 
     */
    function initMap() {
        // 在id为map的页面元素中插入地图
        map = new google.maps.Map(document.getElementById('map'), gapi.map.mapOptions);

        // 放置标记
        gapi.marker.setMarkers(map);

        // 为标记添加点击事件
        // 每个标记被点击后都会显示一个infowindow
        for (var i = 0; i < gapi.marker.markers.length; i++) {
            var marker = gapi.marker.markers[i];
            marker.addListener('click', function () {
                gapi.infowindow.showInfoWindow(this, gapi.infowindow.mainInfoWindow);
            });
        }
    }


    initMap();

    return {
        map: map
    };
}());
