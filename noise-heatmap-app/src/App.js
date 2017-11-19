import React, { Component } from 'react';
import './App.css';
import logo from './NoisePollutionLogo.png';
import { HeatmapArea } from './ui/components/heatmapArea'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-sidebar">
          <img src={logo} className="App-logo"/>
          <h1 className="App-title">City Vibes</h1>
          <h1 className="App-sub-title">A Noise Pollution Heatmap</h1>
        </div>
        <HeatmapArea/>
      </div>
    );
  }
}

export default App;
