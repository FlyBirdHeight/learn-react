import React, { useEffect, useRef } from 'react';
/**
 * NOTE: forwardRef 让 ref 可以通过 props 传递，那么如果用 ref 对象标记的 ref ，
 * 那么 ref 对象就可以通过 props 的形式，提供给子孙组件消费，
 * 当然子孙组件也可以改变 ref 对象里面的属性，或者像如上代码中赋予新的属性，
 * 这种 forwardref + ref 模式一定程度上打破了 React 单向数据流动的原则。
 * 当然绑定在 ref 对象上的属性，不限于组件实例或者 DOM 元素，也可以是属性值或方法。
 */
// 表单组件
class Form extends React.Component {
  render() {
    return <div></div>;
  }
}
// index 组件
class Index extends React.Component<{
  forwardRef: any;
}> {
  componentDidMount() {
    const { forwardRef } = this.props;
    forwardRef.current = {
      form: this.form, // 给form组件实例 ，绑定给 ref form属性
      index: this, // 给index组件实例 ，绑定给 ref index属性
      button: this.button // 给button dom 元素，绑定给 ref button属性
    };
  }
  form: Form | null = null;
  button: HTMLButtonElement | null = null;
  render() {
    return (
      <div>
        <button ref={(button) => (this.button = button)}>点击</button>
        <Form ref={(form) => (this.form = form)} />
      </div>
    );
  }
}
const ForwardRefIndex = React.forwardRef((props, ref) => (
  <Index {...props} forwardRef={ref} />
));
// home 组件
export default function MergeForwardRefHome() {
  const ref = useRef(null);
  useEffect(() => {
    console.log(ref.current);
  }, []);
  return <ForwardRefIndex ref={ref} />;
}
