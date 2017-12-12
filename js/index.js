var map

var toggleActive = function (place,listMarkers){
  // if active, close infowindow and animation
  var findPlaceIdx = function(place){
    for(let idx in listMarkers){
      if(place.name==listMarkers[idx].title){
        return idx
      }
    }
    return 0
  }
  let marker = listMarkers[findPlaceIdx(place)]
  //set all other markers to no BOUNCE
  for(var markeri of listMarkers){
    markeri.setAnimation(null)
  }

  if(place.isActive()){
    infoWindow.close()
    console.log("already active, shutting it down")
    place.isActive(false)
    //marker.setAnimation(null)
    return
  }
  else
    infoWindow.close()
  place.isActive(true)


  marker.setAnimation(google.maps.Animation.BOUNCE)

  //marker.isActive = true
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
  var ViewModel = function () {
    let self = this
    self.listPlaces = ko.observableArray([])
    self.mySearch = function(){
    console.log("my search "+document.getElementById("mySearch").value)
    var query = document.getElementById("mySearch").value
      setMapOnAll(null)
    console.log(self.listPlaces())
    for (var idx in self.listPlaces()) {
      var place = self.listPlaces()[idx]
      if(place.name.toLowerCase().indexOf(query.toLowerCase()) !== -1){
        place.isVisible(true)
        listMarkers[idx].setMap(map)
      }
      else {
        listMarkers[idx].setMap(null)
        place.isVisible(false)
      }
    }
  }
    self.myCancel = function(){
          setMapOnAll(map)
          for (var place of self.listPlaces()) {
              place.isVisible(true)
          }
          document.getElementById("mySearch").value=""

      }
    self.onClick = function (place){
      for (var placem of self.listPlaces()) {
        if(placem!=place)
          placem.isActive(false)
      }
        toggleActive(place,listMarkers)
    }
  }
   infoWindow = new google.maps.InfoWindow({
  content: null})
map = new google.maps.Map(document.getElementById('map'), {
center: {"lat": 41.58989350941445,
        "lng": -93.61109381248022},
zoom: 13})
var placeItemModel = function(name,description, phone,
  address, venueId, isActive, isVisible){
  this.name = ko.observable(name)
  this.description = ko.observable(description)
  this.phone = ko.observable(phone)
  this.address = ko.observable(address)
  this.venueId = ko.observable(venueId)
  this.isActive = ko.observable(isActive)
  this.isVisible = ko.observable(isVisible)
}
var listVenueIds=[
'524dc775498e350c4418dc7b',
'4b8f2be4f964a520244c33e3',
'4aa8662af964a520205120e3',
'4b46baddf964a5207c2726e3',
'4b4658aff964a520371e26e3'
]

var listMarkers =[]
var vm = new ViewModel()
var listPlaces = []
  for (let idx in listVenueIds) {
    let id = listVenueIds[idx]
    let urlString = 'https://api.foursquare.com/v2/venues/'+id+
    '?v=20171010&client_id='+
    'SEHUEOSE3XRMJMKEK5SZVIQE3DKILVAKUJMAMQQAUWQSHWSY&client_'+
    'secret=21PN43B0IGHQJNHUEHXEAAKA1VTBA5WPXEZD3MRKNXP0ZRRK'
    $.ajax({
      url: urlString,
      method: "GET",
  async: false,
    success: function(data){
      var element = new placeItemModel('','','','',id, false, true)
      element.name = data.response.venue.name
      element.description = data.response.venue.description
      element.phone = data.response.venue.contact.formattedPhone
      element.address = data.response.venue.location.address
      listMarkers[idx] = new google.maps.Marker({
        position: {lat: data.response.venue.location.lat,
        lng: data.response.venue.location.lng},
        map: map,
        animation: google.maps.Animation.DROP,
        title: data.response.venue.name})
      listMarkers[idx].addListener('click',function(){
        toggleActive(element,listMarkers)
        //set all markers to inactive
        for (var placem of vm.listPlaces()) {
          if(placem!=element)
            placem.isActive(false)
        }
      })
      listPlaces[idx]=element
      vm.listPlaces()[idx]=element
    },
    error: function(data){
      console.log("error retrieving data ")
    }})
  }
  ko.applyBindings(vm)

  function setMapOnAll(map) {
        for (var i = 0; i < listMarkers.length; i++) {
          listMarkers[i].setMap(map);
        }
      }
 }
