require('knockout');
require('jquery');
require('iscroll');

// namespace
(function () {

    'use strict';

    var Location = function (name, locationObj, type) {
        this.name = name;
        this.location = locationObj;
        this.type = type;
        this.placeID = ko.observable('');
        this.formatted_address = ko.observable('');
        this.active = ko.observable(false);
        this.streetViewImageSrc = ko.observable('');
    };

    var data = {
        API_KEY: 'AIzaSyBCTcVF27rnK-9_vovt47HzeUIQtUAYZCU',

        neighborList: [
            new Location('京都格蘭比亞大酒店', {
                lat: 34.9859964,
                lng: 135.7597823
            }, '酒店'),
            new Location('近鐵京都車站酒店', {
                lat: 34.9848259,
                lng: 135.756949
            }, '酒店'),
            new Location('京都八條口大和皇家酒店', {
                lat: 34.981614,
                lng: 135.760011
            }, '酒店'),
            new Location('京都甘樂酒店', {
                lat: 34.993566,
                lng: 135.759435
            }, '酒店'),
            new Location('京都銀門酒店', {
                lat: 35.010481,
                lng: 135.762213
            }, '酒店'),
            new Location('京都法华俱乐部酒店', {
                lat: 34.9873951,
                lng: 135.7588398
            }, '酒店'),
            new Location('京都四條百夫長膠囊溫泉酒店', {
                lat: 35.0034593,
                lng: 135.7616023
            }, '酒店'),
            new Location('京阪京都格蘭德飯店', {
                lat: 34.9836324,
                lng: 135.7608894
            }, '酒店'),
            new Location('日本寧酒店', {
                lat: 34.99219,
                lng: 135.755778
            }, '酒店'),
            new Location('京都格兰德酒店', {
                lat: 34.985864,
                lng: 135.758957
            }, '酒店'),
            new Location('京都新阪急酒店', {
                lat: 34.987463,
                lng: 135.757591
            }, '酒店'),
            new Location('老香港酒家京都', {
                lat: 35.0032389,
                lng: 135.7591703
            }, '餐厅'),
            new Location('菊乃井 露庵', {
                lat: 35.0034513,
                lng: 135.7706684
            }, '餐厅'),
            new Location('らーめん千の風京都', {
                lat: 35.004578,
                lng: 135.76753
            }, '餐厅'),
            new Location('おおつか', {
                lat: 35.018877,
                lng: 135.677635
            }, '餐厅'),
            new Location('三条大宮公', {
                lat: 35.0083099,
                lng: 135.748546
            }, '公园'),
            new Location('新京極六角公園', {
                lat: 35.0073235,
                lng: 135.7672234
            }, '公园'),
            new Location('円山公園', {
                lat: 35.0038803,
                lng: 135.7809168
            }, '公园'),
            new Location('岡崎公園', {
                lat: 35.0142667,
                lng: 135.7828559
            }, '公园'),
            new Location('梅小路公園', {
                lat: 34.9866391,
                lng: 135.7453352
            }, '公园'),
            new Location('東山山頂公園', {
                lat: 35.0000875,
                lng: 135.7886096
            }, '公园'),
        ]
    };

    var ListViewModule = function () {
        var self = this;
        var smallScreenSize = 500;
        var mq = window.matchMedia('(max-width: ' + smallScreenSize + 'px)');

        // 渲染列表数据，使用数组的复制防止remove方法修改原始数据
        this.locations = ko.observableArray(o.getNeighborList().slice());
        // 筛选列表数据
        this.inputText = ko.observable('');
        // 响应式侧边栏
        this.listHide = ko.observable(mq.matches);
        // 使用iscroll插件代替滚动条
        this.setIScrollPlugin = function (elements) {
            var scroll = new IScroll(elements[0].parentElement, {
                mouseWheel: true
            });
        };
        // 点击列表项目事件
        this.onListClick = function () {
            // 点击后先设置所有formatted_address为空值
            // active属性设置为false
            self.locations().forEach(function (location) {
                location.placeID('');
                location.formatted_address('');
                location.active(false);
                location.streetViewImageSrc('');
            });
            // 设置active为ture
            // 添加active类
            this.active(true);
            // 小尺寸屏幕中隐藏侧边栏
            if (mq.matches) self.listHide(true);
            // 隐藏所有标记
            o.hideMarkers(o.getMarkers());
            o.setListDetails(this);
        };
        this.resetData = function () {
            this.locations.removeAll();
            var dataCopy = o.getNeighborList().slice();
            this.locations(dataCopy);
        };
        this.resetMapView = function () {
            o.hideMarkers(o.getMarkers());
            o.hideMarkers(o.getTempMarker());
            mapView.neighborMarkers = o.setMarkers(this.locations());
            // 根据新的locations数组重新设置标记
            o.showMarkers(o.getMarkers());
        };
        // 筛选事件
        this.onFilter = function () {
            this.resetData();
            var inputText = this.inputText();
            if (!inputText) return;
            // 如果location的type值于输入不同，则删除该记录
            this.locations.remove(function (location) {
                return location.type !== inputText;
            });
            if (mq.matches) self.listHide(true);
            // 隐藏所有标记
            this.resetMapView();

        };
        // 重置
        this.reSet = function () {
            this.resetData();
            if (mq.matches) self.listHide(true);
            // 重新渲染列表为数据的复制
            this.resetMapView();
        };
        // 切换list
        this.toggleList = function () {
            // 重新绘制地图
            google.maps.event.trigger(o.getMap(), 'resize');
            // 切换列表显示隐藏
            this.listHide(!this.listHide());

        };
        // 窗口变换大小重新计算
        this.onWindowResize = (function () {
            window.addEventListener('resize', function () {
                self.listHide(mq.matches);
            });
        }());
    };

    var mapModule = {

        Map: function (node) {
            this.mapOption = {
                center: o.getNeighborList()[0].location,
                zoom: 14
            };
            this.map = new google.maps.Map(node, this.mapOption);
        },

        Marker: function () {
            this.marker = new google.maps.Marker();
            this.marker.addListener('click', function () {
                o.getMarkerDetails(this);
            });
        },

        /**
         * 根据传入的数据dataList生成相同个数的markers数组
         * 
         * @param {array} dataList 
         */
        Markers: function (dataList) {
            var self = this;
            this.markers = [];
            this.markerOption = {
                animation: google.maps.Animation.DROP
            };
            var marker;
            dataList.forEach(function (data) {
                marker = new google.maps.Marker(self.markerOption);
                marker.setPosition(data.location);
                marker.setTitle(data.name);
                marker.addListener('click', function () {
                    o.getMarkerDetails(this);
                });
                self.markers.push(marker);
            });
        },

        InfoWindow: function () {
            this.infoWindowOptions = {
                maxWidth: 200
            };
            this.infoWindow = new google.maps.InfoWindow(this.infoWindowOptions);
        },

        Geocoder: function () {
            this.geocoder = new google.maps.Geocoder();
        },

        StreetViewService: function () {
            this.streetViewService = new google.maps.StreetViewService();
        },

        StreetViewPanorama: function (node) {
            this.panoramaOptions = {
                zoomControl: false,
                addressControl: false,
                fullscreenControl: false,
                linksControl: false,
                panControl: false,
                pov: {
                    heading: 34,
                    pitch: 10
                }
            };
            this.streetViewPanorama = new google.maps.StreetViewPanorama(node, this.panoramaOptions);
        },

        PlaceService: function () {
            var map = o.getMap();
            this.placeService = new google.maps.places.PlacesService(map);
        }

    };

    var mapView = {

        initMap: function () {
            var self = this;
            // 初始化并显示neighborMap
            this.neighborMap = o.setMap(document.getElementById('map'));
            // 初始化infoWindow
            this.neighborInfoWindow = o.setInfoWindow();
            // infoWindow点击事件
            this.neighborInfoWindow.addListener('closeclick', function () {
                this.marker = null;
            });
            // 初始化neighborMarkers
            this.neighborMarkers = o.setMarkers(o.getNeighborList().slice());
            // 初始化geocoder
            this.neighborGeocoder = o.setGeocoder();
            // 在neighborMap上显示neighborMarkers
            o.showMarkers(this.neighborMarkers);
            // 初始化一个临时marker
            this.tempMarker = o.setTempMarker();
            this.streetViewService = o.setStreetViewService();
        },

    };

    var o = {

        initApp: function () {
            ko.applyBindings(new ListViewModule());
            mapView.initMap();
        },

        API_KEY: data.API_KEY,

        getNeighborList: function () {
            return data.neighborList;
        },

        setMap: function (node) {
            return new mapModule.Map(node).map;
        },

        getMap: function () {
            return mapView.neighborMap;
        },

        setMarkers: function (dataList) {
            return new mapModule.Markers(dataList).markers;
        },

        getMarkers: function () {
            return mapView.neighborMarkers;
        },

        setTempMarker: function () {
            return new mapModule.Marker().marker;
        },

        getTempMarker: function () {
            return mapView.tempMarker;
        },

        setInfoWindow: function () {
            return new mapModule.InfoWindow().infoWindow;
        },

        getInfoWindow: function () {
            return mapView.neighborInfoWindow;
        },

        setGeocoder: function () {
            return new mapModule.Geocoder().geocoder;
        },

        getGeocoder: function () {
            return mapView.neighborGeocoder;
        },

        setStreetViewService: function () {
            return new mapModule.StreetViewService().streetViewService;
        },

        getStreetViewService: function () {
            return mapView.streetViewService;
        },

        setStreetViewPanorama: function (node) {
            return new mapModule.StreetViewPanorama(node).streetViewPanorama;
        },

        setPlaceService: function () {
            return new mapModule.PlaceService().placeService;
        },

        /**
         * 显示传入的参数Marker
         * 
         * @param {Marker} markers 
         * @param {Map} map 
         */
        showMarkers: function (markers) {
            markers.forEach(function (marker) {
                marker.setMap(o.getMap());
            });
        },

        hideMarkers: function (m) {
            if (m instanceof Array) {
                m.forEach(function (marker) {
                    marker.setMap(null);
                });
            } else {
                m.setMap(null);
            }
        },

        /**
         * 显示infoWindow
         * 
         * @param {Marker} marker 被点击的marker
         * @param {string} content 显示在infoWindow中的内容
         */
        showNeighborInfoWindow: function (marker, content) {
            this.getInfoWindow().setContent(content);
            this.getInfoWindow().open(this.getMap(), marker);
        },

        showStreetView: function (marker, node) {
            var panorama = this.setStreetViewPanorama(node);
            panorama.setPosition(marker.position);
            this.getMap().setStreetView(panorama);
        },

        setInfoWindowContent: function (marker, data) {
            return marker.title +
                '<div id="formatted_address" class="infowindow__text">' +
                '地址：' +
                data.formatted_address +
                '</div>' +
                '<div id="pano">' +
                '</div>' +
                '<input id="more" type="button" value="Flickr图片"><span id="flickrInfo"></span>';
        },

        /**
         * 通过geocoder获取marker的position属性队形地点的详细信息
         * 并使用infoWindow来显示信息获取到的信息
         * 
         * @param {Marker} marker 
         */
        getMarkerDetails: function (marker) {
            var self = this;
            var content, pano;
            this.getGeocoder().geocode({
                // 根据marker的position获取数据
                location: marker.position
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        console.log(results[0]);
                        // 根据返回的数据生成显示在infowindow中的content
                        content = self.setInfoWindowContent(marker, results[0]);
                        // 显示infowindow
                        self.showNeighborInfoWindow(marker, content);
                        // 移动地图中心
                        self.getMap().setCenter(marker.position);
                        // 显示streetview
                        pano = document.getElementById('pano');
                        self.showStreetView(marker, pano);
                        document.getElementById('more').addEventListener('click', function () {
                            o.http(marker.position);
                        });
                    } else {
                        content = 'No results found';
                        self.showNeighborInfoWindow(marker, content);
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        },

        placeServiceDetails: function (neighbor) {
            var self = this;
            var placeService = o.setPlaceService();
            var request = {
                placeId: neighbor.placeID()
            };
            placeService.getDetails(request, function (result, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    if (result) {
                        console.log(result);
                        neighbor.formatted_address(result.formatted_address);
                        var tempMarker = o.getTempMarker();
                        // 为临时标记设置属性
                        tempMarker.setOptions({
                            icon: result.icon,
                            position: result.geometry.location,
                            title: result.name,
                            animation: google.maps.Animation.DROP,
                            map: o.getMap()
                        });
                        // 获取位置所在信息，
                        // 在地图中渲染标记和infowindow
                        // 在infowindow中显示获取到的信息，
                        // 在列表中显示该位置相应信息
                        self.getMarkerDetails(tempMarker);
                    } else {
                        window.alert('No result found!');
                    }
                } else {
                    window.alert('PlaceService failed due to: ' + status);
                }
            });
        },

        setListDetails: function (neighbor) {

            var self = this;
            var position = neighbor.location;
            var url = 'https://maps.googleapis.com/maps/api/streetview?size=48x48&location=' +
                position.lat + ',' + position.lng +
                '&fov=90&heading=235&pitch=10' +
                '&key=' + o.API_KEY;

            neighbor.streetViewImageSrc(url);

            var geocoder = o.setGeocoder();
            geocoder.geocode({
                location: position
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        neighbor.placeID(results[0].place_id);
                        self.placeServiceDetails(neighbor);
                    } else {
                        window.alert('No result found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });

        },

        http: function (location) {

            var options = {
                "api_key": "6e4f689c112876a5aa5164dceee734af",
                "method": "flickr.photos.search",
                "format": "json",
                "nojsoncallback": "1",
                "lat": location.lat(),
                "lon": location.lng(),
                "radius": 5,
            };

            var makeFlickrRequest = function (options, cb) {
                var url, item, first;

                url = "https://api.flickr.com/services/rest/";
                first = true;
                $.each(options, function (key, value) {
                    url += (first ? "?" : "&") + key + "=" + value;
                    first = false;
                });

                $.get(url, cb)
                    .fail(function () {
                        window.alert('ajax fail');
                    });

            };

            makeFlickrRequest(options, function (data) {
                var image = document.getElementById('image');
                var info = document.getElementById('flickrInfo');
                if (data.photos.photo[0]) {
                    var photo = data.photos.photo[0];
                    var url = 'http://c1.staticflickr.com/' +
                        photo.farm + '/' +
                        photo.server + '/' +
                        photo.id + '_' + photo.secret +
                        '.jpg';
                    image.style.display = 'block';
                    image.setAttribute('src', url);
                } else {
                    image.style.display = 'none';
                    info.innerHTML = 'No photo found on Flickr!';
                }

            });
        }
    };

    google.maps.event.addDomListener(window, 'load', o.initApp());

}());