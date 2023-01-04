/**
 * 对于函数组件，本身是没有实例的，但是 React Hooks 提供了，
 * useImperativeHandle 一方面第一个参数接受父组件传递的 ref 对象，
 * 另一方面第二个参数是一个函数，函数返回值，作为 ref 对象获取的内容。
 * 一起看一下 useImperativeHandle 的基本使用。

useImperativeHandle 接受三个参数：

第一个参数 ref : 接受 forWardRef 传递过来的 ref 。
第二个参数 createHandle ：处理函数，返回值作为暴露给父组件的 ref 对象。
第三个参数 deps :依赖项 deps，依赖项更改形成新的 ref 对象。
 */

import React, { useImperativeHandle, useRef, useState } from 'react';
import { forwardRef } from 'react';

//NOTE: 函数组件 forwardRef + useImperativeHandle
function Son(props: any, ref: any) {
  const inputRef: any = React.useRef(null);
  const [inputValue, setInputValue] = React.useState('');
  /**
   * 流程分析：
    1. 父组件用 ref 标记子组件，由于子组件 Son 是函数组件没有实例，所以用 forwardRef 转发 ref。
    2. 子组件 Son 用 useImperativeHandle 接收父组件 ref，将让 input 聚焦的方法 onFocus 和 
改变 input 输入框的值的方法 onChangeValue 传递给 ref 。
    3. 父组件可以通过调用 ref 下的 onFocus 和 onChangeValue 控制子组件中 input 赋值和聚焦。
   */
  useImperativeHandle(
    ref,
    () => {
      const handleRefs = {
        onFocus() {
          /* 声明方法用于聚焦input框 */
          inputRef.current.focus();
        },
        onChangeValue(value: string) {
          /* 声明方法用于改变input的值 */
          setInputValue(value);
        }
      };
      return handleRefs;
    },
    []
  );
  return (
    <div>
      <input
        placeholder="请输入内容"
        ref={inputRef}
        value={inputValue}
        readOnly={true}
      />
    </div>
  );
}

const ForwarSon = forwardRef(Son);
// 父组件
class FuncRefChat extends React.Component {
  cur: any = null;
  handerClick() {
    const { onFocus, onChangeValue } = this.cur;
    onFocus(); // 让子组件的输入框获取焦点
    onChangeValue('let us learn React!'); // 让子组件input
  }
  render() {
    return (
      <div style={{ marginTop: '50px' }}>
        <ForwarSon ref={(cur) => (this.cur = cur)} />
        <button onClick={this.handerClick.bind(this)}>操控子组件</button>
      </div>
    );
  }
}

export default FuncRefChat;
