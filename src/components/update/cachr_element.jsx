import React, { useMemo, useState } from 'react';
/* 子组件 */
function Children({ number }) {
  console.log('子组件渲染');
  return <div>let us learn React! {number} </div>;
}
/* 父组件 */
// export default class Index extends React.Component{
//     constructor(props) {
//         super(props);
//         this.state={
//             numberA:0,
//             numberB:0,
//         }
//         this.component = <Children number={this.state.numberA} />
//     }

//     controlComponentRender = () => {
//         const {props} = this.component;
//         if(props.number !== this.state.numberA) {
//             return this.component = React.cloneElement(this.component, {number: this.state.numberA});
//         }

//         return this.component;
//     }
//     render(){
//         return (<div>
//            {this.controlComponentRender()}
//            <button onClick={ ()=> this.setState({ numberA:this.state.numberA + 1 }) } >改变numberA -{ this.state.numberA } </button>
//            <button onClick={ ()=> this.setState({ numberB:this.state.numberB + 1 }) } >改变numberB -{ this.state.numberB }</button>
//         </div>)
//      }

// }

export default function CacheElement() {
  const [numberA, setNumberA] = useState(0);
  const [numberB, setNumberB] = useState(0);
  //note memo用法： const cacheSomething = useMemo(create,deps)
  /**
1. create：第一个参数为一个函数，函数的返回值作为缓存值，如上 demo 中把 Children 对应的 element 对象，缓存起来。
2. deps： 第二个参数为一个数组，存放当前 useMemo 的依赖项，在函数组件下一次执行的时候，会对比 deps 依赖项里面的状态，是否有改变，如果有改变重新执行 create ，得到新的缓存值。
3. cacheSomething：返回值，执行 create 的返回值。如果 deps 中有依赖项改变，返回的重新执行 create 产生的值，否则取上一次缓存值。
mark
useMemo原理：
useMemo 会记录上一次执行 create 的返回值，并把它绑定在函数组件对应的 fiber 对象上，只要组件不销毁，缓存值就一直存在，
但是 deps 中如果有一项改变，就会重新执行 create ，返回值作为新的值记录到 fiber 对象上。
 */
  return (
    <div>
      {useMemo(
        () => (
          <Children number={numberA} />
        ),
        [numberA]
      )}
      <button onClick={() => setNumberA(numberA + 1)}>
        改变numberA -{numberA}{' '}
      </button>
      <button onClick={() => setNumberB(numberB + 1)}>
        改变numberB -{numberB}
      </button>
    </div>
  );
}
