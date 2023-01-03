import React from 'react';
import { Component, RefObject } from 'react';

/**
 * NOTE: 类组件获取ref对象的方式
 */
class Children extends Component {
  render = () => <div>hello, world</div>;
}

class GetRef01 extends Component {
  componentDidMount() {
    // console.log(this.refs);
  }

  render() {
    return (
      <div>
        {/* <div ref="stringCurrentDom">字符串模式获取元素或组件</div>
        <Children ref="currentComInstance" /> */}
      </div>
    );
  }
}
/**
 * NOTE: 类组件中ref可以是一个回调函数，通过函数执行设置对应变量值
 */
class GetRef02 extends Component {
  currentDom = null;
  currentComponentInstance = null;
  componentDidMount() {
    console.log(this.currentDom);
    console.log(this.currentComponentInstance);
  }
  render = () => (
    <div>
      <div ref={(node) => ((this.currentDom as unknown) = node)}>
        Ref模式获取元素或组件
      </div>
      <Children
        ref={(node) => ((this.currentComponentInstance as unknown) = node)}
      />
    </div>
  );
}

class GetRef03 extends Component {
  currentDom: RefObject<HTMLDivElement> = React.createRef();
  currentComponentInstance: RefObject<Children> = React.createRef();
  componentDidMount() {
    console.log(this.currentDom);
    console.log(this.currentComponentInstance);
  }
  render = () => (
    <div>
      <div ref={this.currentDom}>Ref对象模式获取元素或组件</div>
      <Children ref={this.currentComponentInstance} />
    </div>
  );
}

export { GetRef01, GetRef02, GetRef03 };
