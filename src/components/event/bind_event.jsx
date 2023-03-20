import {
  registrationNameDependencies,
  registrationNameModules
} from './event_plugin';

//mark: onChange 和 onClick 会保存在对应 DOM 元素类型 fiber 对象（ hostComponent ）的 memoizedProps 属性上
//mark: onClick会绑定在input fiber上，onClick绑定在button fiber上，button fiber是input fiber的sibling
export default function bindEvent() {
  const handleClick = () => {
    console.log('点击事件');
  };
  const handleChange = () => {
    console.log('change事件');
  };
  return (
    <div>
      <input onChange={handleChange} />
      <button onClick={handleClick}>点击</button>
    </div>
  );
}
//mark: 下一步React 根据事件注册事件监听器
//notice: diffProperties 函数在 diff props 如果发现是合成事件( onClick ) 就会调用 legacyListenToEvent 函数
function diffProperties() {
  /* 判断当前的 propKey 是不是 React合成事件,这里的propKey就是memoizedProps的key */
  if (registrationNameModules.hasOwnProperty(propKey)) {
    /* 这里多个函数简化了，如果是合成事件， 传入成事件名称 onClick ，向document注册事件  */
    legacyListenToEvent(registrationName, document);
  }
}

function legacyListenToEvent(registrationName, mountAt) {
  const dependencies = registrationNameDependencies[registrationName]; // 根据 onClick 获取  onClick 依赖的事件数组 [ 'click' ]。
  //mark: 然后将数组中每一个事件类型都绑定在document上
  for (let i = 0; i < dependencies.length; i++) {
    const dependency = dependencies[i];
    //  addEventListener 绑定事件监听器
    // ...
  }
}

/**
那么有一个疑问，绑定在 document 的事件处理函数是如上写的handleChange，handleClick 吗？

  答案是否定的，绑定在 document 的事件，是 React 统一的事件处理函数 dispatchEvent，
React 需要一个统一流程去代理事件逻辑，包括 React 批量更新等逻辑。

  只要是 React 事件触发，首先执行的就是 dispatchEvent ，那么有的同学会问，
dispatchEvent 是如何知道是什么事件触发的呢？实际在注册的时候，就已经通过 bind ，把参数绑定给 dispatchEvent 了。
 */
//note: 这里就是将事件传递给了DispatchEvent了
const listener = dispatchEvent.bind(null,'click',eventSystemFlags,document) 
/* TODO: 重要, 这里进行真正的事件绑定。*/
document.addEventListener('click',listener,false) 