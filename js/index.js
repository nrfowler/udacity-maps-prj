var map

var toggleActive = function (place,listMarkers){
  //get the marker for this place
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
  //Deactivate if it is already active, else activate
  if(place.isActive()){
    infoWindow.close()
    place.isActive(false)
    return
  }
  else
    infoWindow.close()
  place.isActive(true)
  marker.setAnimation(google.maps.Animation.BOUNCE)
  //Create and open the infowindow
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
    self.query = ko.observable()
    self.mySearch = function(){
      setMapOnAll(null)
      for (var idx in self.listPlaces()) {
        var place = self.listPlaces()[idx]
        place.isVisible(false)
        for (word of self.query().split()){
          if(place.name.toLowerCase().indexOf(word.toLowerCase()) !== -1){
            place.isVisible(true)
            listMarkers[idx].setMap(map)
          }

        }

      }
    }
    self.myCancel = function(){
          setMapOnAll(map)
          for (var place of self.listPlaces()) {
              place.isVisible(true)
          }
          self.query("")
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
//Make calls to Foursquare API and create markers and places arrays. Return a promise.
function get4SquareData(idx,listVenueIds){
  return new Promise((resolve,reject)=>{
        let id = listVenueIds[idx]
        let urlString = 'https://api.foursquare.com/v2/venues/'+id+
        '?v=20171010&client_id='+
        'SEHUEOSE3XRMJMKEK5SZVIQE3DKILVAKUJMAMQQAUWQSHWSY&client_'+
        'secret=21PN43B0IGHQJNHUEHXEAAKA1VTBA5WPXEZD3MRKNXP0ZRRK'
        $.ajax({
          url: urlString,
          method: "GET",
          async: true,
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
            resolve()
          },
          error: function(data){
            alert("Error retrieving data: Foursquare connection failed.")
            reject()
        }})
  })

}
//wait for all asynchronous ajax calls to finish before applying bindings to VM.
async function getData(){
  let promises =[]
  for (let idx in listVenueIds) {
    promises.push(
      get4SquareData(idx,listVenueIds))
  }
  await Promise.all(promises)
  ko.applyBindings(vm)

  }
  getData()
//set the map attribute for all markers
  function setMapOnAll(map) {
        for (var i = 0; i < listMarkers.length; i++) {
          listMarkers[i].setMap(map);
        }
      }
 }
