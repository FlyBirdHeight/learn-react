import React from "react"
/*
note 反向继承和属性代理有一定的区别，在于包装后的组件继承了原始组件本身，所以此时无须再去挂载业务组件。
优点：

① 方便获取组件内部状态，比如 state ，props ，生命周期，绑定的事件函数等。
② es6继承可以良好继承静态属性。所以无须对静态属性和方法进行额外的处理。
缺点：

① 函数组件无法使用。
② 和被包装的组件耦合度高，需要知道被包装的原始组件的内部状态，具体做了些什么？
③ 如果多个反向继承 HOC 嵌套在一起，当前状态会覆盖上一个状态。这样带来的隐患是非常大的，比如说有多个 componentDidMount ，当前 componentDidMount 会覆盖上一个 componentDidMount 。这样副作用串联起来，影响很大。
*/
class Index extends React.Component{
    render(){
      return <div> hello,world  </div>
    }
  }
  function HOC(Component: any){
      return class wrapComponent extends Component{ /* 直接继承需要包装的组件 */
          
      }
  }
  export default HOC(Index) 