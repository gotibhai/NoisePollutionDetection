import React, { Component } from 'react';
import './App.css';
import { HeatmapArea } from './ui/components/heatmapArea'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Noise Pollution Heatmap</h1>
        </header>
        <p className="App-intro">
          Using <code>heatmap.js</code> and a gmaps plugin.
          <HeatmapArea/>
        </p>
      </div>
    );
  }
}

export default App;
