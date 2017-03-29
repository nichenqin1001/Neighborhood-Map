app.data = (function () {
    var httpRequest;

    var API_KEY = 'AIzaSyBCTcVF27rnK-9_vovt47HzeUIQtUAYZCU';

    var parkList = [
        "静安公园",
        "西康公园",
        "静安雕塑公园",
        "上海玫瑰花园",
        "蝴蝶湾花园",
        "九子公园",
        "黄浦公园",
        "豫园",
        "人民公园",
        "蓬莱公园",
        "古城公园",
        "延中公园",
        "广场公园",
        "复兴公园",
        "绍兴公园",
        "淮海公园"
    ];

    var Location = function (name) {
        this.name = name;
    };

    var parkLocations = [];

    var request = function (apiKey, address) {
        httpRequest = new XMLHttpRequest();
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + apiKey;
        if (!httpRequest) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    parkLocations.push(JSON.parse(httpRequest.responseText).results[0]);
                } else {
                    alert('There was a problem with the request.');
                }
            }
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    };

    parkList.forEach(function (park) {
        request(API_KEY, park);
    });


    return {
        parkList: parkList,
        Location: Location,
        parkLocations: parkLocations
    };
}());
