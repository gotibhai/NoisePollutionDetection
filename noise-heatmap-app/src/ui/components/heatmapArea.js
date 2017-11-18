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

  mapStyle = {
    width: '1024px',
    padding: '0', 
    height: '768px',
    cursor: 'pointer',
    position: 'relative'
  };

  map;

  render() {
    return ( 
      <div>
        <div id="heatmapArea" style={this.mapStyle}></div>            
      </div>
     );
  }

  componentDidMount() {
    var compRef = this;
    GoogleMapsLoader.KEY = 'AIzaSyAaafUiCMIxXy1uy70THVGRZfIQQ4q9yRA';    
    GoogleMapsLoader.LIBRARIES = ['visualization'];
    console.log("loading lib");
    GoogleMapsLoader.load(function(google) {
      console.log("creating map");
      compRef.map = new google.maps.Map(document.getElementById('heatmapArea'), compRef.getMapOptions());
      compRef.loadData()
    });
    // loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAaafUiCMIxXy1uy70THVGRZfIQQ4q9yRA&libraries=visualization&callback=libLoaded');
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
      disableDoubleClickZoom: false
    };
  }

  applyHeadMap(data) {
    // Create a heatmap.
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: data
    });
    heatmap.setMap(this.map);
  }

  loadData() {
    // set up firebase
    var config = {
      apiKey: "AIzaSyBWxP2O5cTKispWRieHmN2DAvE-WysD9vc",
      authDomain: "noisepollutiondetection-74011.firebaseapp.com",
      databaseURL: "https://noisepollutiondetection-74011.firebaseio.com",
      projectId: "noisepollutiondetection-74011",
      storageBucket: "",
      messagingSenderId: "1047190133742"
    };
    firebase.initializeApp(config);

    // get data
    var starCountRef = firebase.database().ref('EventObj');
    var compRef = this;
    starCountRef.on('value', function(result) {
      console.log("db call:", result.val());
      var data = Object.values(result.val()).map((row) => {
        return {location: new google.maps.LatLng(row.Location.latitude,	row.Location.longitude), weight: row.amplitude}
      })
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


