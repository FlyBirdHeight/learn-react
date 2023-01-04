## ref 原理揭秘

对于 Ref 标签引用，React 是如何处理的呢？ 接下来先来看看一段 demo 代码 （称之为 DemoRef ，请大家记住，下文中还会提及此 demo 代码片段 ） ：

```jsx
export default class Index extends React.Component {
  state = { num: 0 };
  node = null;
  render() {
    return (
      <div>
        <div
          ref={(node) => {
            this.node = node;
            console.log('此时的参数是什么：', this.node);
          }}
        >
          ref元素节点
        </div>
        <button onClick={() => this.setState({ num: this.state.num + 1 })}>
          点击
        </button>
      </div>
    );
  }
}
```
用回调函数方式处理 Ref ，如果点击一次按钮，会打印几次 console.log ？ 来打印一下试试？

*会打印两次，一次是null，一次是获取到的ref对象*

## ref 执行时机和处理逻辑
在上一节生命周期，提到了一次更新的两个阶段- render 阶段和 commit 阶段，后面的 fiber 章节会详细介绍两个阶段。**对于整个 Ref 的处理，都是在 commit 阶段发生的**。之前了解过 commit 阶段会进行真正的 Dom 操作，此时 ref 就是用来获取真实的 DOM 以及组件实例的，所以需要 commit 阶段处理。

但是对于 Ref 处理函数，React 底层用两个方法处理：**`commitDetachRef`** 和 **`commitAttachRef`** ，上述两次 console.log 一次为 null，一次为div 就是分别调用了上述的方法。
> 相当于会先清除一次上一次的ref对象，然后重新赋予一次新的ref对象

这两次正正好好，**一次在 DOM 更新之前，一次在 DOM 更新之后**。

第一阶段：一次更新中，在 **commit 的 mutation 阶段, 执行`commitDetachRef`, `，commitDetachRef` 会清空之前ref值，使其重置为 null**。 源码先来看一下。
`react-reconciler/src/ReactFiberCommitWork.js`
```js
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref;
  if (currentRef !== null) {
    if (typeof currentRef === 'function') { /* function 和 字符串获取方式。 */
      currentRef(null); 
    } else {   /* Ref对象获取方式 */
      currentRef.current = null;
    }
  }
}
```
第二阶段：DOM 更新阶段，这个阶段会根据不同的 effect 标签，真实的操作 DOM 。

第三阶段：layout 阶段，在更新真实元素节点之后，此时需要更新 ref 。

`react-reconciler/src/ReactFiberCommitWork.js`
```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent: //元素节点 获取元素
        instanceToUse = getPublicInstance(instance);
        break;
      default:  // 类组件直接使用实例
        instanceToUse = instance;
    }
    if (typeof ref === 'function') {
      ref(instanceToUse);  //* function 和 字符串获取方式。 */
    } else {
      ref.current = instanceToUse; /* ref对象方式 */
    }
  }
}
```
这一阶段，主要判断 ref 获取的是组件还是 DOM 元素标签，如果 DOM 元素，就会获取更新之后最新的 DOM 元素，如果是组件元素，就会获取更新之后的最新的组件实例。上面流程中讲了三种获取 ref 的方式。 如果是字符串 `ref="node"` 或是 函数式 `ref={(node)=> this.node = node }` 会执行 ref 函数，重置新的 ref 。

如果是 ref 对象方式。（下面这种形式就是对象方式）
```jsx
node = React.createRef()
<div ref={ node } ></div>
```
会更新 ref 对象的 current 属性。达到更新 ref 对象的目的。

｜--------问与答---------｜
问： 上面很多同学可能会产生疑问，为什么 ref="node" 字符串，最后会按照函数方式处理呢。

答： 因为**当 ref 属性是一个字符串的时候，React 会自动绑定一个函数，用来处理 ref 逻辑。**

`react-reconciler/src/ReactChildFiber.js`

```jsx
const ref = function(value) {
    let refs = inst.refs;
    if (refs === emptyRefsObject) {
        refs = inst.refs = {};
    }
    if (value === null) {
        delete refs[stringRef];
    } else {
        refs[stringRef] = value;
    }
};
```
所以当这样绑定ref="node"，会被绑定在组件实例的refs属性下面。比如

```jsx
<div ref="node" ></div>
```
ref 函数 在 commitAttachRef 中最终会这么处理：
`ref(<div>)`等于 `inst.refs.node = <div>`
> 这里的`<div>`相当于是一个HTMLDivElement对象
｜-------end---------｜

Ref 的处理特性
接下来看一下 ref 的一些特性，首先来看一下，上述没有提及的一个问题，React 被 ref 标记的 fiber，那么每一次 fiber 更新都会调用 commitDetachRef 和 commitAttachRef 更新 Ref 吗 ？

**答案是否定的，只有在 ref 更新的时候，才会调用如上方法更新 ref ，究其原因还要从如上两个方法的执行时期说起**

### 更新 ref
在 commit 阶段 commitDetachRef 和 commitAttachRef 是在什么条件下被执行的呢 ？ 来一起看一下：

commitDetachRef 调用时机

`react-reconciler/src/ReactFiberWorkLoop.js`

```js
function commitMutationEffects(){
     if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }
}
```
`commitAttachRef` 调用时机

```js
function commitLayoutEffects(){
     if (effectTag & Ref) {
      commitAttachRef(nextEffect);
    }
}
```

从上可以清晰的看到只有含有 Ref tag 的时候，才会执行更新 ref，那么是每一次更新都会打 Ref tag 吗？ 跟着我的思路往下看，什么时候标记的 Ref 。
`react-reconciler/src/ReactFiberBeginWork.js`

```js
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref;
  if (
    (current === null && ref !== null) ||      // 初始化的时候
    (current !== null && current.ref !== ref)  // ref 指向发生改变
  ) {
    workInProgress.effectTag |= Ref;
  }
}
```
首先 markRef 方法执行在两种情况下：
1. 第一种就是类组件的更新过程中。
2. 第二种就是更新 HostComponent 的时候，什么是 HostComponent 就不必多说了，比如 `<div /> `等元素。
> 必须是标记了Ref，才会触发`commitDetachRef`与`commitAttachRef`
markRef 会在以下两种情况下给 effectTag 标记 Ref，只有标记了 Ref tag 才会有后续的 commitAttachRef 和 commitDetachRef 流程。（ current 为当前调和的 fiber 节点 ）
1. 第一种 `current === null && ref !== null`：就是在 *fiber 初始化的时候，第一次 ref 处理的时候，是一定要标记 Ref 的*。
2. 第二种 `current !== null && current.ref !== ref`：就是 *fiber 更新的时候，但是 ref 对象的指向变了*。
只有在 Ref tag 存在的时候才会更新 ref ，那么回到最初的 DemoRef 上来，为什么每一次按钮，都会打印 ref ，那么也就是 ref 的回调函数执行了，ref 更新了。

```jsx
<div ref={(node)=>{
               this.node = node
               console.log('此时的参数是什么：', this.node )
}}  >ref元素节点</div>
```
如上很简单，每一次更新的时候，都给 ref 赋值了新的函数，那么 markRef 中就会判断成 `current.ref !== ref`，所以就会重新打 Ref 标签，那么在 commit 阶段，就会更新 ref 执行 ref 回调函数了。
> 这里还有一个原因就是因为修改的是state中的num，会触发组件更新，所以current.ref !== ref
如果给 DemoRef 做如下修改：
```jsx
export default class Index extends React.Component{
    state={ num:0 }
    node = null
    getDom= (node)=>{
        this.node = node
        console.log('此时的参数是什么：', this.node )
     }
    render(){
        return <div >
            <div ref={this.getDom}>ref元素节点</div>
            <button onClick={()=> this.setState({ num: this.state.num + 1  })} >点击</button>
        </div>
    }
}
```
这个时候，在点击按钮更新的时候，由于此时 ref 指向相同的函数 getDom ，所以就不会打 Ref 标签，不会更新 ref 逻辑，直观上的体现就是 getDom 函数不会再执行。
> 也就是说，如果是
### 卸载 ref
上述讲了 ref 更新阶段的特点，接下来分析一下当组件或者元素卸载的时候，ref 的处理逻辑是怎么样的。

`react-reconciler/src/ReactFiberCommitWork.js`

```jsx
this.state.isShow && <div ref={()=>this.node = node} >元素节点</div>
```
如上，在一次更新的时候，改变 isShow 属性，使之由 true 变成了 false， 那么 div 元素会被卸载，那么 ref 会怎么处理呢？
**被卸载的 fiber 会被打成 Deletion effect tag** ，然后在 commit 阶段会进行 commitDeletion 流程。对于有 ref 标记的 ClassComponent （类组件） 和 HostComponent （元素），会统一走 safelyDetachRef 流程，这个方法就是用来卸载 ref。

`react-reconciler/src/ReactFiberCommitWork.js`
```js
function safelyDetachRef(current) {
  const ref = current.ref;
  if (ref !== null) {
    if (typeof ref === 'function') {  // 函数式 ｜ 字符串
        ref(null)
    } else {
      ref.current = null;  // ref 对象
    }
  }
}
```
对于字符串 ref="dom" 和函数类型 ref={(node)=> this.node = node } 的 ref，会执行传入 null 置空 ref 。
对于 ref 对象类型，会清空 ref 对象上的 current 属性。
借此完成卸载 ref 流程。