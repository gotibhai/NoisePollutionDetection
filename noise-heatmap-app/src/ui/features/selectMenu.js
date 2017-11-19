import React from 'react'
import Select from 'react-select';
import { connect } from 'react-redux';
// import 'react-select/dist/css/react-select.css'; ***


const timeOptions = [
  { label: 'All' , value: 'all', clearableValue: false },
  { label: 'Last minute', value: 'minute', clearableValue: false },
  { label: 'Last hour', value: 'hour', clearableValue: false },
  { label: 'Last day', value: 'day', clearableValue: false },
  { label: 'Last week', value: 'week', clearableValue: false }
];
// clearable value false not working ***

class SelectMenu extends React.Component {
  constructor(props) {
     super(props);
     //this.state = { value: "all" };
     this.handleSelectChange = this.handleSelectChange.bind(this);
   }

   handleSelectChange(value) {
    console.log('You have selected: ', value);
    if (value === 'all') {
      this.props.dispatch({ type: 'SELECT_ALL' });      
    } else if (value === 'minute') {
      this.props.dispatch({ type: 'SELECT_MINUTE' });      
    } else if (value === 'hour') {
      this.props.dispatch({ type: 'SELECT_HOUR' });      
    } else if (value === 'day') {
      this.props.dispatch({ type: 'SELECT_DAY' });      
    } else if (value === 'week') {
      this.props.dispatch({ type: 'SELECT_WEEK' });      
    }
  }

  render(){
    return (
      <div className="App-select-menu">
        <h3 className="App-sub-title">Select Time Interval:</h3>
        <Select 
          value={this.props.value} 
          placeholder = "Select your favourite(s)" // remove ***
          options = { timeOptions } 
          onChange = { this.handleSelectChange } 
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    select: state.value
  };
}

export default connect(mapStateToProps)(SelectMenu);

