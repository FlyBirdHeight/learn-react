import React, { useEffect } from 'react';

/**
 * 函数组件每一次 render ，函数上下文会重新执行，那么有一种情况就是，在执行一些事件方法改变数据或者保存新数据的时候，
 * 有没有必要更新视图，有没有必要把数据放到 state 中。如果视图层更新不依赖想要改变的数据，
 * 那么 state 改变带来的更新效果就是多余的。这时候更新无疑是一种性能上的浪费。

 * 这种情况下，useRef 就派上用场了，上面讲到过，useRef 可以创建出一个 ref 原始对象，只要组件没有销毁，
 * ref 对象就一直存在，那么完全可以把一些不依赖于视图更新的数据储存到 ref 对象中。这样做的好处有两个：

 * 第一个能够直接修改数据，不会造成函数组件冗余的更新作用。

 * 第二个 useRef 保存数据，如果有 useEffect ，useMemo 引用 ref 对象中的数据，
 * 无须将 ref 对象添加成 dep 依赖项，因为 useRef 始终指向一个内存空间，所以这样一点好处是可以随时访问到变化后的值。
 */
const toLearn = [
  { type: 1, mes: 'let us learn React' },
  { type: 2, mes: 'let us learn Vue3.0' }
];
export default function Index(id: number) {
  const typeInfo = React.useRef(toLearn[0]);
  const changeType = (info: { type: number; mes: string }) => {
    typeInfo.current = info; /* typeInfo 的改变，不需要视图变化 */
  };
  useEffect(() => {
    if (typeInfo.current.type === 1) {
      /* ... */
    }
  }, [id]); /* 无须将 typeInfo 添加依赖项  */
  return (
    <div>
      {toLearn.map((item) => (
        <button key={item.type} onClick={changeType.bind(null, item)}>
          {item.mes}
        </button>
      ))}
    </div>
  );
}
/**
 *1.  用一个 useRef 保存 type 的信息，type 改变不需要视图变化。
 *2. 按钮切换直接改变 useRef 内容。
 *3. useEffect 里面可以直接访问到改变后的 typeInfo 的内容，不需要添加依赖项。
 * README: 这样做的好处是：state声明的变量更新后会自动刷新组件，
 * 但是在ref中的数据更新后不会刷新组件，那么在无需刷新处使用ref承载变量，可以提升页面效率，减少不必要刷新
 */
