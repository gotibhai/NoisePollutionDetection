import React, { Component } from 'react';
import './App.css';
import logo from './NoisePollutionLogo.png';
import { HeatmapArea } from './ui/components/heatmapArea';
import SelectMenu from './ui/features/selectMenu';
import { DropdownButton, MenuItem } from 'react-bootstrap';

// enum obj to hold time filter select menu items
export const timeFilterValues = {
  ALL: 0,
  MINUTE: 1,
  HOUR: 2,
  DAY: 3,
  WEEK: 4
}

class App extends Component {
  constructor(props) {
    super(props);
    this.changeSelection = this.changeSelection.bind(this);
    this.state = {
      timeFilterState: timeFilterValues.ALL,
      title: this.getTimeFilterString(timeFilterValues.ALL)
    };
  }

  changeSelection(eventKey, event) {
    console.log(eventKey);
    console.log(event);
    this.setState({timeFilterState: eventKey, title: this.getTimeFilterString(eventKey)});
  }

  getTimeFilterString(key) {
    switch (key) {
      case timeFilterValues.ALL:
        return "All Times";
      case timeFilterValues.MINUTE:
        return "Last minute";
        case timeFilterValues.HOUR:
        return "Last hour";
        case timeFilterValues.DAY:
        return "Last day";
        case timeFilterValues.WEEK:
        return "Last week";
    }
  } 

  render() {
    return (
      <div className="App">
        <div className="App-sidebar">
          <img src={logo} className="App-logo"/>
          <h1 className="App-title">City Vibes</h1>
          <h1 className="App-sub-title pad">A Noise Pollution Heatmap</h1>
          <hr className="pad"/>
          <div className="App-select-menu">
          <DropdownButton id="dropdown-btn-menu" bsStyle="success" 
          title={this.state.title} onSelect={this.changeSelection}>
            <MenuItem eventKey={timeFilterValues.ALL}>All Times</MenuItem>
            <MenuItem eventKey={timeFilterValues.MINUTE}>Last minute</MenuItem>
            <MenuItem eventKey={timeFilterValues.HOUR}>Last hour</MenuItem>
            <MenuItem eventKey={timeFilterValues.DAY}>Last day</MenuItem>
            <MenuItem eventKey={timeFilterValues.WEEK}>Last week</MenuItem>
          </DropdownButton>
          </div>
          <div className="App-select-menu">
          {/* <DropdownButton id="dropdown-btn-menu" bsStyle="success" 
          title={this.state.title} onSelect={this.changeSelection}>
            refs.heatMap.getTypes().map((el) => <MenuItem eventKey={el}>el</MenuItem>)
          </DropdownButton> */}
          </div>
        </div>
        <HeatmapArea ref="heatMap" timeFilter={this.state.timeFilterState}/>
      </div>
    );
  }
}

export default App;
