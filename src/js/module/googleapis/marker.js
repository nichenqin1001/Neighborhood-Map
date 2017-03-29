gapi.marker = (function () {
    var markerOptions = [];
    for (var i = 0; i < data.parkList.length; i++) {
        var park = data.parkList[i];
        var markerOption = {
            position: park.location,
            title: park.address,
            animation: google.maps.Animation.DROP
        };
        markerOptions.push(markerOption);
    }

    return {
        markerOptions: markerOptions
    };
}());
