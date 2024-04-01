function getCoordinates() {
    var geocoder = new google.maps.Geocoder();
    var address = "New York, NY"; // Replace with the desired location

    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            console.log("Latitude: " + latitude);
            console.log("Longitude: " + longitude);
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}