require('knockout');

// namespace
window.initApp = function () {

    var Location = function (address, locationObj) {
        this.address = address;
        this.location = locationObj;
    };

    var data = {
        API_KEY: 'AIzaSyBCTcVF27rnK-9_vovt47HzeUIQtUAYZCU',

        parkList: [
            new Location('静安公园', {
                lat: 31.2215488,
                lng: 121.4460741
            }),
            new Location('中山公园', {
                lat: 31.220946,
                lng: 121.420322
            }),
            new Location('人民公园', {
                lat: 31.232226,
                lng: 121.473219
            }),
            new Location('徐家汇公园', {
                lat: 31.196934,
                lng: 121.44232
            }),
            new Location('长风公园', {
                lat: 31.224667,
                lng: 121.3968941
            }),
            new Location('长寿公园', {
                lat: 31.243379,
                lng: 121.439498
            }),
            new Location('天山公园', {
                lat: 31.2102345,
                lng: 121.4162046
            }),
            new Location('川沙公园', {
                lat: 31.1914997,
                lng: 121.700226
            }),
            new Location('上海植物园', {
                lat: 31.150018,
                lng: 121.449875
            }),
            new Location('世博公园', {
                lat: 31.1873611,
                lng: 121.4867197
            }),
            new Location('浦东体育公园', {
                lat: 31.2311054,
                lng: 121.5376228
            }),
            new Location('世纪公园', {
                lat: 31.212134,
                lng: 121.543724
            })
        ]
    };

    var octopus = {

        initApp: function () {
            ko.applyBindings(new ListViewModule());
            mapView.initMap();
        },

        getParkList: function () {
            return data.parkList;
        },

        setMap: function (node) {
            return new mapModule.Map(node);
        },

        getMap: function () {
            return mapView.parkMap;
        },

        setMarkers: function (dataList) {
            return new mapModule.Markers(dataList);
        },

        setInfoWindow: function () {
            return new mapModule.InfoWindow();
        },

        setGeocoder: function () {
            return new mapModule.Geocoder();
        },

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
         * @param {InfoWindow} infoWindow 要显示信息的infoWindow
         */
        showParkInfoWindow: function (marker, infoWindow, content) {
            infoWindow.setContent(content);
            infoWindow.open(this.getMap(), marker);
        }

    };

    var ListViewModule = function () {
        this.locations = ko.observableArray(octopus.getParkList());
        this.showMarker = function () {
            var location = this.location;
        };
    };

    var mapView = {

        initMap: function () {
            var self = this;
            var parkList = octopus.getParkList();
            // 初始化并显示parkMap
            this.parkMap = octopus.setMap(document.getElementById('map')).map;
            // 初始化parkMarkers
            this.parkMarkers = octopus.setMarkers(parkList).markers;
            // 根据数据为每一个parkMarker添加属性
            for (var i = 0; i < parkList.length; i++) {
                var park = parkList[i];
                var parkMarker = this.parkMarkers[i];
                parkMarker.setPosition(park.location);
                parkMarker.setTitle(park.address);
                parkMarker.addListener('click', function () {
                    var content = '<div>' + this.title + '</div>';
                    octopus.showParkInfoWindow(this, self.parkInfoWindow, content);
                });
            }
            // 初始化infoWindow
            this.parkInfoWindow = octopus.setInfoWindow().infoWindow;
            // 初始化geocoder
            this.parkGeocoder = octopus.setGeocoder().geocoder;
            // 在parkMap上显示parkMarkers
            octopus.showMarkers(this.parkMarkers, this.parkMap);
        },

    };

    var mapModule = {

        Map: function (node) {
            this.mapOption = {
                center: octopus.getParkList()[0].location,
                zoom: 11
            };
            this.map = new google.maps.Map(node, this.mapOption);
        },

        Marker: function () {
            this.marker = new google.maps.Markers();
        },

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
            this.infoWindow = new google.maps.InfoWindow();
        },

        Geocoder: function () {
            this.geocoder = new google.maps.Geocoder();
        }

    };

    octopus.initApp();

};
