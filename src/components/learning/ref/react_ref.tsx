import React from 'react';
import { RefObject } from 'react';

class ReactRef extends React.Component {
  currentDom: RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.currentDom = React.createRef();
  }

  componentDidMount() {
    console.log(this.currentDom);
  }

  render() {
    return <div ref={this.currentDom}> ref对象模式获取元素或组件</div>;
  }
}

export default ReactRef;
