gapi.map = (function () {
    // 设置初始化地图中心位置
    // 位置设置为data数据中parkList数组的第一个地点位置
    var center = data.parkList[0].location;
    var mapOptions = {
        center: center,
        zoom: 11
    };

    return {
        mapOptions: mapOptions
    };

}());
