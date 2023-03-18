import React from "react";
/**
note ref获取实例
对于属性代理虽然不能直接获取组件内的状态，但是可以通过 ref 获取组件实例，
获取到组件实例，就可以获取组件的一些状态，或是手动触发一些事件，进一步强化组件，
notice：类组件才存在实例，函数组件不存在实例。
 */
function Hoc(Component: any) {
  return class WrapComponent extends React.Component {
    node: any;
    constructor() {
      super({});
      this.node = null; /* 获取实例，可以做一些其他的操作。 */
    }
    render() {
      return <Component {...this.props} ref={(node: any) => (this.node = node)} />;
    }
  };
}
