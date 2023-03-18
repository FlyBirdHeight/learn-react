import React from "react";

/*
mark 
渲染劫持
HOC 反向继承模式，可以通过 super.render() 得到 render 之后的内容，利用这一点，可以做渲染劫持 ，更有甚者可以修改 render 之后的 React element 对象。
*/
const HOC = (WrapComponent: any) => {
  class Index extends WrapComponent {
    render() {
      if (this.props.visible) {
        return super.render();
      } else {
        return <div>暂无数据</div>;
      }
    }
  }
};
//note 修改渲染树
class Index extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>react</li>
          <li>vue</li>
          <li>Angular</li>
        </ul>
      </div>
    );
  }
}
function HOC2(Component: any) {
  return class Advance extends Component {
    render() {
      const element = super.render();
      const otherProps = {
        name: 'alien'
      };
      /* 替换 Angular 元素节点 */
      const appendElement = React.createElement(
        'li',
        {},
        `hello ,world , my name  is ${otherProps.name}`
      );
      const newchild = React.Children.map(
        element.props.children.props.children,
        (child, index) => {
          if (index === 2) return appendElement;
          return child;
        }
      );
      return React.cloneElement(element, element.props, newchild);
    }
  };
}
export default HOC2(Index);
