gapi.map = (function () {
    var center = data.parkList[0].location;
    var mapOptions = {
        center: center,
        zoom: 14
    };

    return {
        mapOptions: mapOptions
    };

}());
