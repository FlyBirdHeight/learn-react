import React from 'react';
import ReactDOM from 'react-dom';

class StateSet extends React.Component {
  state: { num: number };
  constructor(props: any) {
    super(props);
    this.state = {
      num: 5
    };
    this.handerClick = this.handerClick.bind(this);
  }
  handerClick() {
    setTimeout(() => {
      this.setState({ num: 1 });
      console.log('sync: ', this.state.num);
    });
    this.setState({ num: 2 });
    console.log('first: ', this.state.num);
    ReactDOM.flushSync(() => {
      this.setState({ num: 3 });
      console.log('second: ', this.state.num);
    });
    this.setState({ num: 4 });
    console.log('end: ', this.state.num);
  }

  render() {
    console.log(this.state.num);
    return <button onClick={this.handerClick}>click</button>;
  }
}

export default StateSet;
