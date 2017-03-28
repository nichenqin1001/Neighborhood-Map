app.view = app.view || {};

app.view.list = (function () {
    // 使用knockout渲染HTML
    ko.applyBindings(new app.module.list.ListModule());
}());