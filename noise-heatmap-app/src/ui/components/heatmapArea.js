/*global google*/
// smart component (container)

import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import firebase from 'firebase'
var GoogleMapsLoader = require('google-maps'); // only for common js environments 


export class HeatmapArea extends React.Component {
  constructor(props) {
    super(props);
  }

  dataPoints;
  map;
  mapStyle = {
    'position': 'absolute',
    'width': '100%',
    'height': '100%',
    'marginLeft': '200px',
  };

  render() {
    return ( 
        <div id="heatmapArea" style={this.mapStyle}></div>            
     );
  }

  componentDidMount() {
    var compRef = this;
    GoogleMapsLoader.KEY = 'AIzaSyAaafUiCMIxXy1uy70THVGRZfIQQ4q9yRA';    
    GoogleMapsLoader.LIBRARIES = ['visualization', 'geometry'];
    GoogleMapsLoader.load(function(google) {
      compRef.map = new google.maps.Map(document.getElementById('heatmapArea'), compRef.getMapOptions());
      compRef.loadData()
    });
  }

  getMapOptions() {
    var hackWestern = new google.maps.LatLng(42.9993152,	-81.2784599); // geolocation feature      
    return {
      center: hackWestern,
      zoom: 20,
      // styles: [{
      //   featureType: 'poi',
      //   stylers: [{ visibility: 'off' }]  // Turn off points of interest.
      // }, {
      //   featureType: 'transit.station',
      //   stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
      // }],
      disableDoubleClickZoom: true
    };
  }

  applyHeadMap(data) {
    // create the heatmap overlay
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: data
    });
    heatmap.setMap(this.map);
  }



  loadData() {
    // connect to firebase
    var config = {
      apiKey: "AIzaSyBWxP2O5cTKispWRieHmN2DAvE-WysD9vc",
      authDomain: "noisepollutiondetection-74011.firebaseapp.com",
      databaseURL: "https://noisepollutiondetection-74011.firebaseio.com",
      projectId: "noisepollutiondetection-74011",
      storageBucket: "",
      messagingSenderId: "1047190133742"
    };
    firebase.initializeApp(config);

    // create infowindow to display noise type
    var infowindow =  new google.maps.InfoWindow({
      content: "TYPE",
    });
    const compRef = this;
    google.maps.event.addListener(this.map, 'click', function(event) {
      var clickLocation = {lat: parseFloat(event.latLng.lat()), lng: parseFloat(event.latLng.lng())};
      console.log('click location:', clickLocation);
      
      // check for closest noise in acceptable range
      var closestNoise = {type: ''};
      for (var pos = 0; pos < compRef.dataPoints.length; pos++) {
        var eucDist = calcCrow(clickLocation, compRef.dataPoints[pos].location);
        if (pos === 0 || eucDist < closestNoise.dist) {
          closestNoise = {
            type: compRef.dataPoints[pos].type, 
            dist: eucDist,
            loc: compRef.dataPoints[pos].location
          }
        }
      }

      // update infowindow
      console.log('closest noise:', closestNoise)
      if (closestNoise.type != '') {
        infowindow.setContent(closestNoise.type);      
        infowindow.setPosition(closestNoise.loc);
        infowindow.open(compRef.map);
      }
    });
    
    // get point data and parse it
    var starCountRef = firebase.database().ref('EventObj');
    starCountRef.on('value', function(result) {
      console.log("db call:", result.val());
      compRef.dataPoints = [];
      var heatPoints = [];
      if (result.val()) {
        // database map to info object array
        compRef.dataPoints = Object.values(result.val()).map((row) => {
          return {location: {lat: row.Location.latitude, lng: row.Location.longitude}, amplitude: row.amplitude, time: row.time, type: row.type}
        });
        // info object array map to heatmap array
        heatPoints = compRef.dataPoints.map((item) => {
          return {location: new google.maps.LatLng(item.location.lat, item.location.lng), weight: item.amplitude}
        });
      }
      compRef.applyHeadMap(heatPoints);
    });
  };
};

function loadJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
};

function calcCrow(click, point) 
{
  var lat1 = click.lat;
  var lat2 = point.lat;
  var lon1 = click.lng;
  var lon2 = point.lng;
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}


