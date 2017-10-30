var map


$.ajax({
  url:'https://api.yelp.com/oauth2/token',
  method: "POST",
  data: {
    client_secret:'5b6ocTuApDEJVkGqEjcDTi6mmY1OWno8SrUoqtkZsn2DKrxiBZMXPAKJQJPHd1FL',
    client_id:'2RvxPlh5KA2HdF8q0UVhVg',
    grant_type: 'client_credentials'

  },
  headers: { 'Content-Type': 'application/x-www-form-urlencoded',
    }
,
success: function(data){
  console.log(data.access_token)
},
error: function(data){
  console.log("error getting accesstoken: "+data.access_token)
}
})


var initMap = function () {
map = new google.maps.Map(document.getElementById('map'), {
center: {lat: 40.74, lng: -73.998},
zoom: 13})
var listYelpPlaces = [
  {
    title: "McDonalds",
    active: false
  },
  {
    title: "Subway",
    active: false
  }
]
    var listPlaces=[ new google.maps.Marker({
    position: {lat: 40.719526, lng: -74.0089934},
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'First Marker!'}),
    new google.maps.Marker({
    position: {lat: 40.723590, lng: -74.0089900},
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Second Marker!'})]
    var toggleBounce = function (marker){
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null)
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE)
            }
    }
    var toggleActive = function (marker){
            //marker.getTitle()

              $.ajax({
                url:'https://api.foursquare.com/v2/venues/49d51ce3f964a520675c1fe3',
                method: "GET",
                data: {
                  client_secret:'21PN43B0IGHQJNHUEHXEAAKA1VTBA5WPXEZD3MRKNXP0ZRRK',
                  client_id:'SEHUEOSE3XRMJMKEK5SZVIQE3DKILVAKUJMAMQQAUWQSHWSY'
                },

              success: function(data){
                console.log(data.name)
              },
              error: function(data){
                console.log("error retrieving data "+data)
              }})


    }
    for (let element of listPlaces) {
      element.addListener('click', function(){toggleBounce(element)})
      element.addListener('click',function(){toggleActive(element)})
    }

ko.applyBindings( new ViewModel(listPlaces))
// var infoWindow = new google.maps.InfoWindow({
// content: 'I am an info window!!'})
// marker.addListener('click', function () {
// infoWindow.open(map, marker) })
 }

var ViewModel = function (listPlaces) {
  this.observableArray(listPlaces)
}


// document.getElementById('cat1').addEventListener('click', function(){
//   document.getElementById('cat-container').innerHTML  = ;
// }, false);
