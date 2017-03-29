window.view = app.view = app.view || {};

view.list = (function () {
    // 使用knockout渲染HTML
    ko.applyBindings(new modules.list.ListModule());
}());
