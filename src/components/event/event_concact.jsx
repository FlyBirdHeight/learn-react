export default function Index() {
  const handleClick1 = () => console.log(1);
  const handleClick2 = () => console.log(2);
  const handleClick3 = () => console.log(3);
  const handleClick4 = () => console.log(4);
  return (
    <div onClick={handleClick3} onClickCapture={handleClick4}>
      <button onClick={handleClick1} onClickCapture={handleClick2}>
        点击
      </button>
    </div>
  );
}
/**
 * 1. 批量更新
 * 首先上面讲到执行 dispatchEvent ，dispatchEvent 执行会传入真实的事件源 button 元素本身。通过元素可以找到 button 对应的 fiber ，fiber 和原生 DOM 之间是如何建立起联系的呢？
 * React 在初始化真实 DOM 的时候，用一个随机的 key internalInstanceKey 指针指向了当前 DOM 对应的 fiber 对象，fiber 对象用 stateNode 指向了当前的 DOM 元素。
 * 然后就是给fiber添加memoizedProps属性，里面会放入对应的onClick或者其他定义的事件
 * 2. 合成事件源
 * 接下来会通过 onClick 找到对应的处理插件 SimpleEventPlugin ，合成新的事件源 e ，里面包含了 preventDefault 和 stopPropagation 等方法。
 mark: 这一步其实就是通过fiber获取到对应的onClick内容，然后再通过registrationNameModules来获取对应onClick的处理插件，然后进行合成
 * 3. 形成事件执行队列
 mark: 
 (1) 如果遇到捕获阶段事件 onClickCapture ，就会 unshift 放在数组前面。以此模拟事件捕获阶段。
 (2) 如果遇到冒泡阶段事件 onClick ，就会 push 到数组后面，模拟事件冒泡阶段。
 (3) 一直收集到最顶端 app ，形成执行队列，在接下来阶段，依次执行队列里面的函数。
 notice: 这里要注意，我们每一次收集的fiber都是一条分支走到根部的，然后根据是否是捕获还是冒泡来区分放在数组的位置。而且这个递归过程是叶子节点的Fiber开始的
 */
function generateQueue() {
  while (instance !== null) {
    const { stateNode, tag } = instance;
    if (tag === HostComponent && stateNode !== null) {
      /* DOM 元素 */
      const currentTarget = stateNode;
      if (captured !== null) {
        /* 事件捕获 */
        /* 在事件捕获阶段,真正的事件处理函数 */
        const captureListener = getListener(instance, captured); // onClickCapture
        if (captureListener != null) {
          /* 对应发生在事件捕获阶段的处理函数，逻辑是将执行函数unshift添加到队列的最前面 */
          dispatchListeners.unshift(captureListener);
        }
      }
      if (bubbled !== null) {
        /* 事件冒泡 */
        /* 事件冒泡阶段，真正的事件处理函数，逻辑是将执行函数push到执行队列的最后面 */
        const bubbleListener = getListener(instance, bubbled); //
        if (bubbleListener != null) {
          dispatchListeners.push(bubbleListener); // onClick
        }
      }
    }
    instance = instance.return;
  }
}
