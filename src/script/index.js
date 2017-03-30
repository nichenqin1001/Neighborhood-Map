require('knockout');

// namespace
(function () {

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

    var ListViewModule = function () {
        this.locations = ko.observableArray(octopus.getParkList());
        this.showMarker = function () {
            var location = this.location;
        };
    };

    var octopus = {

        init: function () {
            ko.applyBindings(new ListViewModule());
            mapView.initMap();
        },

        getParkList: function () {
            return data.parkList;
        }

    };

    var mapView = {

        initMap: function () {
            this.map = new google.maps.Map(document.getElementById('map'), mapModule.mapOption);

            this.markers = [];
            for (var i = 0; i < octopus.getParkList().length; i++) {
                var park = octopus.getParkList()[i];
                var position = park.location;
                var title = park.address;
                var marker = new google.maps.Marker({
                    position: position,
                    title: title,
                    animation: google.maps.Animation.DROP
                });
                this.markers.push(marker);
            }

            this.showMarkers();
        },

        showMarkers: function () {
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(this.map);
            }
        }

    };

    var mapModule = {

        mapOption: {
            center: octopus.getParkList()[0].location,
            zoom: 11
        }

    };

    octopus.init();

}());
