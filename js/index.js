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
            contentString = '<h1>'+(place.title || "") +'</h1>'
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
    var listPlaces=[
      {marker: new google.maps.Marker({
    position: {"lat": 41.58989350941445,
            "lng": -93.61109381248022},
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Up-Down'}),
    description: '',
    phone: '',
    address: '',
    venueId: '524dc775498e350c4418dc7b',
isActive: false},
    {marker: new google.maps.Marker({
    position: {"lat": 41.590459968991404,
            "lng": -93.61162179575165},
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Lime Lounge'}),
    description: '',
    phone: '',
    address:'',
    venueId: '4b8f2be4f964a520244c33e3',
isActive: false},
{marker: new google.maps.Marker({
position: {"lat": 41.58515086613031,
        "lng": -93.62051625430041},
map: map,
animation: google.maps.Animation.DROP,
title: 'Johnnys Hall of Fame'}),
description: '',
phone: '',
address:'',
venueId: '4aa8662af964a520205120e3',
isActive: false}
,
{marker: new google.maps.Marker({
position: {"lat": 41.58515086613031,
        "lng": -93.62051625430041},
map: map,
animation: google.maps.Animation.DROP,
title: 'Court Avenue Brewing Company'}),
description: '',
phone: '',
address:'',
venueId: '4b46baddf964a5207c2726e3',
isActive: false}

,
{marker: new google.maps.Marker({
position: {"lat": 41.58515086613031,
        "lng": -93.62051625430041},
map: map,
animation: google.maps.Animation.DROP,
title: "Java Joe's Coffeehouse"}),
description: '',
phone: '',
address: '',
venueId: '4b4658aff964a520371e26e3',
isActive: false}

]

    for (let element of listPlaces) {
      element.marker.addListener('click',function(){toggleActive(element)})
      let urlString = 'https://api.foursquare.com/v2/venues/'+element.venueId+'?v=20171010&client_id='+
      'SEHUEOSE3XRMJMKEK5SZVIQE3DKILVAKUJMAMQQAUWQSHWSY&client_secret=21PN43B0IGHQJNHUEHXEAAKA1VTBA5WPXEZD3MRKNXP0ZRRK'
      $.ajax({
        url: urlString,
        method: "GET",
      success: function(data){
        element.title = data.response.venue.name
        element.description = data.response.venue.description
        element.phone = data.response.venue.contact.formattedPhone
        element.address = data.response.venue.location.address
        element.marker.setPosition(new google.maps.LatLng( parseInt(data.response.venue.location.lat), parseInt(data.response.venue.location.long)))
        
      },
      error: function(data){
        console.log("error retrieving data ")
      }})
    }
ko.applyBindings( new ViewModel(listPlaces))
 }
var ViewModel = function (listPlaces) {
  let self = this;
  this.listPlaces = ko.observableArray(listPlaces)
  function setMapOnAll(map) {
        for (var i = 0; i < self.listPlaces.length; i++) {
          self.listPlaces[i].marker.setMap(map);
        }
      }

  this.mySearch = function(){
    console.log("my search "+document.getElementById("mySearch").value)
    var query = document.getElementById("mySearch").value
    //listPlaces match on title
    //set isVisible = true
      setMapOnAll(null)
    for (var place of self.listPlaces) {
      if(place.marker.title.toLowerCase().indexOf(query.toLowerCase()) !== -1){

        place.marker.setMap(map)
      }

    }
  }
  this.myCancel = function(){

        setMapOnAll(map)
    }
  this.onClick = function (place){
    console.log("on click "+place.marker.title)
      toggleActive(place)
  }
}
