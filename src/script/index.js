require('knockout');
require('jquery');
require('iscroll');

// namespace
$(function () {

    'use strict';

    var utils = (function () {
        var u = {};

        u.yelpHttp = function (location) {
            $.ajax({
                    type: "GET",
                    dataType: 'jsonp',
                    url: 'https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972',
                    caches: true,
                    beforeSend: function (xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + 'X9cUMiP6GQqkJPrSBHeBpqBt50FpakSneqO4JrqRxlhq3uh0_5Msca06DC6tITOHAuizl_lf8tANJpFZAfylFjJJ7q8NJ-stISsdvqwGgHMMolvaqGl3dDeZ8NXlWHYx');
                    },
                })
                .done(function (data) {
                    console.log(data);
                })
                .fail(function (e) {
                    console.log(e);
                });
        };
        return u;
    }());

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

        parkList: [
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
            }, '餐厅')
        ]
    };

    var ListViewModule = function () {
        var self = this;
        var smallScreenSize = 500;
        var mq = window.matchMedia('(max-width: ' + smallScreenSize + 'px)');
        // 渲染列表数据，使用数组的复制防止remove方法修改原始数据
        this.locations = ko.observableArray(o.getParkList().slice());
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
            var dataCopy = o.getParkList().slice();
            this.locations(dataCopy);
        };
        this.resetMapView = function () {
            o.hideMarkers(o.getMarkers());
            o.hideMarkers(o.getTempMarker());
            mapView.parkMarkers = o.setMarkers(this.locations());
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
                center: o.getParkList()[0].location,
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
            // 初始化并显示parkMap
            this.parkMap = o.setMap(document.getElementById('map'));
            // 初始化infoWindow
            this.parkInfoWindow = o.setInfoWindow();
            // infoWindow点击事件
            this.parkInfoWindow.addListener('closeclick', function () {
                this.marker = null;
            });
            // 初始化parkMarkers
            this.parkMarkers = o.setMarkers(o.getParkList().slice());
            // 初始化geocoder
            this.parkGeocoder = o.setGeocoder();
            // 在parkMap上显示parkMarkers
            o.showMarkers(this.parkMarkers);
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

        getParkList: function () {
            return data.parkList;
        },

        setMap: function (node) {
            return new mapModule.Map(node).map;
        },

        getMap: function () {
            return mapView.parkMap;
        },

        setMarkers: function (dataList) {
            return new mapModule.Markers(dataList).markers;
        },

        getMarkers: function () {
            return mapView.parkMarkers;
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
            return mapView.parkInfoWindow;
        },

        setGeocoder: function () {
            return new mapModule.Geocoder().geocoder;
        },

        getGeocoder: function () {
            return mapView.parkGeocoder;
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
        showParkInfoWindow: function (marker, content) {
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
                '<input id="more" type="button" value="查看更多信息">';
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
                        self.showParkInfoWindow(marker, content);
                        // 移动地图中心
                        self.getMap().setCenter(marker.position);
                        // 显示streetview
                        pano = document.getElementById('pano');
                        self.showStreetView(marker, pano);
                        // 如果传入了park参数，则设置其formatted_address
                        document.getElementById('more').addEventListener('click', function () {});
                    } else {
                        content = 'No results found';
                        self.showParkInfoWindow(marker, content);
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        },

        placeServiceDetails: function (park) {
            var self = this;
            var placeService = o.setPlaceService();
            var request = {
                placeId: park.placeID()
            };
            placeService.getDetails(request, function (result, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    if (result) {
                        console.log(result);
                        park.formatted_address(result.formatted_address);
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

        setListDetails: function (park) {
            var self = this;
            var position = park.location;
            var url = 'https://maps.googleapis.com/maps/api/streetview?size=48x48&location=' +
                position.lat + ',' + position.lng +
                '&fov=90&heading=235&pitch=10' +
                '&key=' + o.API_KEY;
            park.streetViewImageSrc(url);
            // TODO: query
            var geocoder = o.setGeocoder();
            geocoder.geocode({
                location: position
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        park.placeID(results[0].place_id);
                        self.placeServiceDetails(park);
                    } else {
                        window.alert('No result found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });

        }

    };

    utils.yelpHttp();

    o.initApp();

});