# Neighborhood-Map

## 开始使用

地图应用使用`webpack`构建，使用`webpack-dev-server`在`localhost:8080`端口使用

### 框架和依赖

- 使用`knockout`管理页面列表渲染
- 使用`Google Map`API渲染地图
- 使用`jQuery`进行ajax请求`flickr`图片
- 使用IScroll插件代替列表滚动

```bash
yarn install
```

运行地图应用

```bash
yarn run dev
```

或者打开`dist`文件夹中`index.html`文件在本地打开应用

## 功能和特点

### 响应式

- 使用css`media query`在`400px`以下屏幕设置更窄的列表框
- 使用浏览器`window.matchMedia`API设置在不同尺寸屏幕中列表是否默认显示

### 界面交互

- 点击列表内容时会`place service`获取详细地址及静态图片显示在列表中
- 点击列表或者`marker`显示在`infowindow`中显示地址、街景
- 点击`infowindow`中*Flickr图片*按钮在右下角显示该地点的`flickr`图片
- 筛选按钮可以筛选地点类型，并重置地图标记
- 重置按钮可以重设列表和地图
- 点击切换地图列表显示的按钮地图重新加载
