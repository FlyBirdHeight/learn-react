import AysncComponent from './sync_component';
import React, {Suspense} from 'react';
const getData = () => {
  return new Promise((resolve) => {
    //模拟异步
    setTimeout(() => {
      resolve({
        name: 'alien',
        say: 'let us learn React!'
      });
    }, 1000);
  });
};
/* 测试异步组件 */
function Test({ rdata, age }) {
  const { name, say } = rdata;
  console.log('组件渲染');
  return (
    <div>
      <div> hello , my name is {name} </div>
      <div>age : {age} </div>
      <div> i want to say {say} </div>
    </div>
  );
}
/* 父组件 */
export default class UsingSyncComponent extends React.Component {
  LazyTest = AysncComponent(
    Test,
    getData
  ); /* 需要每一次在组件内部声明，保证每次父组件挂载，都会重新请求数据 ，防止内存泄漏。 */
  render() {
    const { LazyTest } = this;
    return (
      <div>
        <Suspense fallback={<div>loading...</div>}>
          <LazyTest age={18} />
        </Suspense>
      </div>
    );
  }
}
