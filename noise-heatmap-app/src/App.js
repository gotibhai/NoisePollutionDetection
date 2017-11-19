import React, { Component } from 'react';
import './App.css';
import logo from './NoisePollutionLogo.png';
import { HeatmapArea } from './ui/components/heatmapArea';
import SelectMenu from './ui/features/selectMenu';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-sidebar">
          <img src={logo} className="App-logo"/>
          <h1 className="App-title">City Vibes</h1>
          <h1 className="App-sub-title pad">A Noise Pollution Heatmap</h1>
          <hr className="pad"/>
        </div>
        <HeatmapArea/>
      </div>
    );
  }
}

export default App;
