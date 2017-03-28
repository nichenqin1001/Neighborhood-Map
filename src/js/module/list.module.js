// 使用knockout库渲染HTML模板
require('knockout');

// 将list和map数据放置在app.module命名空间中
app.module = app.module || {};

app.module.list = (function () {
    // knockout绑定的对象
    var ListModule = function () {
        // 存放渲染HTML文件的公园对象
        this.locations = ko.observableArray([]);
        // 将app.data中的partList数组推到locations数组中
        this.pushParkList();
    };

    /**
     * 从app.data.parkList中获取每个park的name值
     * 使用knockout的observableArray方法渲染HTML
     */
    ListModule.prototype.pushParkList = function () {
        var self = this;
        app.data.parkList.forEach(function (park) {
            self.locations.push(new app.data.Location(park));
        });
    };

    return {
        ListModule: ListModule
    };

}());