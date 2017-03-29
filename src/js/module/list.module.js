// 使用knockout库渲染HTML模板
require('knockout');

// 将list和map数据放置在app.module命名空间中
window.modules = app.module = app.module || {};

modules.list = (function () {
    // knockout绑定的对象
    var ListModule = function () {
        // 存放渲染HTML文件的公园对象
        // 渲染列表
        this.locations = ko.observableArray(data.parkList);
        this.showInfoWindow = function () {
            var location = this.location;
            console.log(location);
            // 隐藏地图上的默认标记
            gapi.marker.hideMarkers(gapi.marker.markers);
            // 隐藏地图上的临时标记
            gapi.marker.tempMarker.setMap(null);
            // 使用geocoder对象调取新的位置
            // 将地图中心移动到新的位置
            // 并创建一个临时标记
            gapi.geocoder.onListClick(location);
        };
    };

    return {
        ListModule: ListModule
    };

}());