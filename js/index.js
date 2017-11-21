var map

var toggleBounce = function (place){
  console.log("on click "+place.marker.title)
  let marker = place.marker
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null)
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE)
        }
}
var toggleActive = function (place){
  //clear all infoWindows
  let urlString = 'https://api.foursquare.com/v2/venues/'+place.venueId+'?v=20171010&client_id='+
  'SEHUEOSE3XRMJMKEK5SZVIQE3DKILVAKUJMAMQQAUWQSHWSY&client_secret=21PN43B0IGHQJNHUEHXEAAKA1VTBA5WPXEZD3MRKNXP0ZRRK'
  let marker = place.marker
          $.ajax({
            url: urlString,
            method: "GET",
          success: function(data){
            marker.isActive = true
            console.log(data.response.venue.name)
            var infoWindow = new google.maps.InfoWindow({
            content: data.response.venue.name})

            infoWindow.open(map, marker)
          },
          error: function(data){
            marker.isActive = false
            console.log("error retrieving data "+place.ven)
          }})
}



var initMap = function () {
  console.log("init map")
map = new google.maps.Map(document.getElementById('map'), {
center: {"lat": 41.58989350941445,
        "lng": -93.61109381248022},
zoom: 13})

    var listPlaces=[
      {marker: new google.maps.Marker({
    position: {"lat": 41.58989350941445,
            "lng": -93.61109381248022},
    map: map,
    animation: google.maps.Animation.DROP,

    title: 'First Marker!'}),
    venueId: '524dc775498e350c4418dc7b',
isActive: false},
    {marker: new google.maps.Marker({
    position: {"lat": 41.590459968991404,
            "lng": -93.61162179575165},
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Second Marker!'}),
    venueId: '4b8f2be4f964a520244c33e3',
isActive: false},
{marker: new google.maps.Marker({
position: {"lat": 41.58515086613031,
        "lng": -93.62051625430041},
map: map,
animation: google.maps.Animation.DROP,
title: 'Johnnys Hall of Fame'}),
venueId: '4aa8662af964a520205120e3',
isActive: false}]

    for (let element of listPlaces) {
      element.marker.addListener('click', function(){toggleBounce(element)})
      element.marker.addListener('click',function(){toggleActive(element)})

    }

ko.applyBindings( new ViewModel(listPlaces))

 }

var ViewModel = function (listPlaces) {
  let self = this;
  this.listPlaces = listPlaces
  this.mySearch = function(){
    var query = document.getElementById("mySearch").placeholder
    //listPlaces match on title
    //set isVisible = true
    for (var place of self.listPlaces) {
      if(place.marker.title.indexOf(query) !== -1)
        place.isVisible = false

    }
  }
  this.myCancel = function(){
    for (var place of self.listPlaces) {
        place.isVisible = true

    }}

  this.onClick = function (place){
    console.log("on click "+place.marker.title)
      toggleBounce(place)
      toggleActive(place)
  }
}
