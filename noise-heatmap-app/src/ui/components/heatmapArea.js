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
      content: "TYPE"
    });
    // add listener for mouse clicks on map
    google.maps.event.addListener(this.map, 'click', function(event) {
      //console.log('click at:', event.latLng)
      var pos = {lat: parseInt(event.latLng.lat()), lng: parseInt(event.latLng.lng())};
      console.log('pos', pos);
      infowindow.setPosition(pos);
      infowindow.open(this.map);
    });
    
    // get point data and parse it
    var starCountRef = firebase.database().ref('EventObj');
    var compRef = this;
    starCountRef.on('value', function(result) {
      console.log("db call:", result.val());
      var data = []
      if (result.val()) {
        data = Object.values(result.val()).map((row) => {
          return {location: new google.maps.LatLng(row.Location.latitude,	row.Location.longitude), weight: row.amplitude}
        });
      }
      compRef.applyHeadMap(data);
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


