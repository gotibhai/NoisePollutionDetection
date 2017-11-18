/*global google*/
// smart component (container)

import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import HeatmapOverlay from 'gmaps-heatmap';

class _HeatmapArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return ( 
      <div>
        {/* <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaafUiCMIxXy1uy70THVGRZfIQQ4q9yRA&callback=initMap"
        type="text/javascript"></script> */}
        <div id="heatmapArea" style="width:1024px;padding:0;height:768px;cursor:pointer;position:relative;"></div>            
      </div>
     );
  }

  componentDidMount() {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAaafUiCMIxXy1uy70THVGRZfIQQ4q9yRA&callback=initMap')
  }

  initMap() {
    // get data from Firebase ***
    var testData = {
      max: 100,
      data: [{
          lat: 48.3333,
          lng: 16.35,
          count: 100
      }, {
          lat: 51.465558,
          lng: 0.010986,
          count: 100
      }, {
          lat: 33.5363,
          lng: -5.044,
          count: 100
      }]
    };

    // initialize standard gmaps, define map properties
    var myLatlng = new google.maps.LatLng(48.3333, 16.35); // ***
    var myOptions = {
        zoom: 3,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        scrollwheel: true,
        draggable: true,
        navigationControl: true,
        mapTypeControl: false,
        scaleControl: true,
        disableDoubleClickZoom: false
    };

    // create heatmap and overlay with confic properties
    var map = new google.maps.Map($("#heatmapArea")[0], myOptions);
    var heatmap = new HeatmapOverlay(map, {
        "radius": 2,
        "maxOpacity": 1,
        "scaleRadius": true,
        "useLocalExtrema": true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count'
    });
    heatmap.setData(testData);
  }

};

function loadJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
};

export const HeatmapArea = connect(null, null)(_HeatmapArea);

