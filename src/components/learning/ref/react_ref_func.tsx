import React from 'react';
import { RefObject } from 'react';
const render = 1;
export default function RefFunc() {
  //NOTE: 因为函数对象每一次更新组件内容之后，都会被重新执行，所以每一次ref实际上都是一个新的ref(被重置了)，所以不能使用
  // React.createRef的形式去创建一个ref对象。
  /**
   * NOTE: 为了解决这个问题，hooks 和函数组件对应的 fiber 对象建立起关联，将 useRef 产生的 ref 对象挂到函数组件对应的
   * fiber 上，函数组件每次执行，只要组件不被销毁，函数组件对应的 fiber 对象一直存在，
   * 所以 ref 等信息就会被保存下来。对于 hooks 原理，后续章节会有对应的介绍。
   */
  const currentDom: RefObject<HTMLDivElement | null> = React.useRef(null);
  React.useEffect(() => {
    console.log('refFunc:', currentDom.current);
  }, []);
  return <div ref={currentDom}>ref函数模式获取元素或组件</div>;
}
