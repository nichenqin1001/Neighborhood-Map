require('knockout');

// namespace
(function () {

    var Location = function (address, locationObj) {
        this.address = address;
        this.location = locationObj;
        this.formatted_address = ko.observable('');
        this.active = ko.observable(false);
    };

    var data = {
        API_KEY: 'AIzaSyBCTcVF27rnK-9_vovt47HzeUIQtUAYZCU',

        parkList: [
            new Location('京都格蘭比亞大酒店', {
                lat: 34.9859964,
                lng: 135.7597823
            }),
            new Location('近鐵京都車站酒店', {
                lat: 34.9848259,
                lng: 135.756949
            }),
            new Location('京都八條口大和皇家酒店', {
                lat: 34.981614,
                lng: 135.760011
            }),
            new Location('京都甘樂酒店', {
                lat: 34.993566,
                lng: 135.759435
            }),
            new Location('京都銀門酒店', {
                lat: 35.010481,
                lng: 135.762213
            }),
            new Location('京都翠嵐豪華精選酒店', {
                lat: 35.013628,
                lng: 135.673283
            }),
            new Location('京都法华俱乐部酒店', {
                lat: 34.9873951,
                lng: 135.7588398
            }),
            new Location('京都四條百夫長膠囊溫泉酒店', {
                lat: 35.0034593,
                lng: 135.7616023
            }),
            new Location('京阪京都格蘭德飯店', {
                lat: 34.9836324,
                lng: 135.7608894
            }),
            new Location('日本寧酒店', {
                lat: 34.99219,
                lng: 135.755778
            }),
            new Location('京都格兰德酒店', {
                lat: 34.985864,
                lng: 135.758957
            }),
            new Location('京都麗思卡爾頓酒店', {
                lat: 35.013768,
                lng: 135.770837
            }),
            new Location('京都新阪急酒店', {
                lat: 34.987463,
                lng: 135.757591
            }),
            new Location('灰姑娘酒店', {
                lat: 35.010901,
                lng: 135.785841
            })
        ]
    };

    var ListViewModule = function () {
        var self = this;
        this.locations = ko.observableArray(o.getParkList());
        this.onListClick = function () {
            // 点击后先设置所有formatted_address为空值
            // active属性设置为false
            self.locations().forEach(function (location) {
                location.formatted_address('');
                location.active(false);
            });
            // 设置active为ture
            // 添加active类
            this.active(true);
            // 隐藏所有标记
            o.hideMarkers(o.getMarkers());
            // 使用新的标记标识地图
            var tempMarker = o.getTempMarker();
            // 为临时标记设置属性
            tempMarker.setOptions({
                position: this.location,
                title: this.address,
                animation: google.maps.Animation.DROP,
                map: o.getMap()
            });
            // 获取位置所在信息，
            // 在地图中渲染标记和infowindow
            // 在infowindow中显示获取到的信息，
            // 在列表中显示该位置相应信息
            o.getMarkerDetails(tempMarker, this);
        };
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
        }

    };

    var mapView = {

        initMap: function () {
            var self = this;
            var parkList = o.getParkList();
            // 初始化并显示parkMap
            this.parkMap = o.setMap(document.getElementById('map'));
            // 初始化parkMarkers
            this.parkMarkers = o.setMarkers(parkList);
            // 初始化infoWindow
            this.parkInfoWindow = o.setInfoWindow();
            this.parkInfoWindow.addListener('closeclick', function () {
                this.marker = null;
            });
            // 初始化geocoder
            this.parkGeocoder = o.setGeocoder();
            // 根据数据为每一个parkMarker添加属性
            for (var i = 0; i < parkList.length; i++) {
                var park = parkList[i];
                var parkMarker = this.parkMarkers[i];
                // 设置position及title属性
                parkMarker.setPosition(park.location);
                parkMarker.setTitle(park.address);
                // 添加点击事件，为每个parkMarker添加infoWindow
                parkMarker.addListener('click', function () {
                    // 在parkMarker上显示parkInfoWindow
                    o.getMarkerDetails(this);

                });
            }
            // 在parkMap上显示parkMarkers
            o.showMarkers(this.parkMarkers, this.parkMap);
            // 初始化一个临时marker
            this.tempMarker = o.setTempMarker();
            // 为每个tempMarker添加点击事件
            this.tempMarker.addListener('click', function () {
                o.getMarkerDetails(this);
            });
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

        /**
         * 显示传入的参数Marker
         * 
         * @param {Marker} markers 
         * @param {Map} map 
         */
        showMarkers: function (markers, map) {
            markers.forEach(function (marker) {
                marker.setMap(map);
            });
        },

        hideMarkers: function (markers) {
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
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

        setContent: function (marker, data) {
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
        getMarkerDetails: function (marker, park) {
            var self = this;
            var content, pano;
            this.getGeocoder().geocode({
                // 根据marker的position获取数据
                location: marker.position
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        // 根据返回的数据生成显示在infowindow中的content
                        content = self.setContent(marker, results[0]);
                        // 显示infowindow
                        self.showParkInfoWindow(marker, content);
                        // 移动地图中心
                        self.getMap().panTo(marker.position);
                        // 显示streetview
                        pano = document.getElementById('pano');
                        self.showStreetView(marker, pano);
                        // 如果传入了park参数，则设置其formatted_address
                        if (park)
                            park.formatted_address(results[0].formatted_address);
                        document.getElementById('more').addEventListener('click', function () {

                        });
                    } else {
                        content = 'No results found';
                        self.showParkInfoWindow(marker, content);
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        },

    };

    o.initApp();

}());
