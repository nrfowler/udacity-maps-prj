var map

var toggleActive = function (place){
  // if active, close infowindow and animation
  if(place.isActive){
    infoWindow.close()
    //marker.setAnimation(null)
    place.isActive = false
    return
  }
  else
    infoWindow.close()
  place.isActive = true

  let marker = place.marker
  // if (marker.getAnimation() !== null) {
  //   marker.setAnimation(null)
  // } else {
  //   marker.setAnimation(google.maps.Animation.BOUNCE)
  // }

            marker.isActive = true
            contentString = '<h1>'+(place.name || "") +'</h1>'
            +'<h3>'+ (place.description || "")+'</h3>'
                            +'<div> Phone: '+(place.phone|| "N/A") +'</div>'
+'<div> Address: '+(place.address || "N/A") +'</div>'
 infoWindow = new google.maps.InfoWindow({
            content: contentString})
            infoWindow.open(map, marker)


}

var infoWindow
var initMap = function () {
  console.log("init map")
   infoWindow = new google.maps.InfoWindow({
  content: null})
map = new google.maps.Map(document.getElementById('map'), {
center: {"lat": 41.58989350941445,
        "lng": -93.61109381248022},
zoom: 13})
var placeItemModel = function(marker,name,description, phone, address, venueId, isActive){
  this.marker = ko.observable(marker)
  this.name = ko.observable(name)
  this.description = ko.observable(description)
  this.phone = ko.observable(phone)
  this.address = ko.observable(address)
  this.venueId = ko.observable(venueId)
  this.isActive = ko.observable(isActive)
}
    var listVenueIds=[
'524dc775498e350c4418dc7b'
,
'4b8f2be4f964a520244c33e3'
,
'4aa8662af964a520205120e3'
,
'4b46baddf964a5207c2726e3'
,
'4b4658aff964a520371e26e3'
]
var listPlaces = []
    for (let id of listVenueIds) {

      let urlString = 'https://api.foursquare.com/v2/venues/'+id+'?v=20171010&client_id='+
      'SEHUEOSE3XRMJMKEK5SZVIQE3DKILVAKUJMAMQQAUWQSHWSY&client_secret=21PN43B0IGHQJNHUEHXEAAKA1VTBA5WPXEZD3MRKNXP0ZRRK'
      $.ajax({
        url: urlString,
        method: "GET",
      success: function(data){
        var element = new placeItemModel({},'','','','',id, false)
        element.name = data.response.venue.name
        element.description = data.response.venue.description
        element.phone = data.response.venue.contact.formattedPhone
        element.address = data.response.venue.location.address
        element.marker = new google.maps.Marker({
        position: {lat: data.response.venue.location.lat, lng: data.response.venue.location.lng},
        map: map,
        animation: google.maps.Animation.DROP,
        title: data.response.venue.name})
        element.marker.addListener('click',function(){toggleActive(element)})
        listPlaces.push(element)


      },
      error: function(data){
        console.log("error retrieving data ")
      }})
    }
  console.log(listPlaces)
  
ko.applyBindings( new ViewModel(listPlaces))
 }
