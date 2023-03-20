/**
 mark: 老版本event执行顺序
 事件监听 -> 捕获阶段执行 -> 冒泡阶段执行
 mark: 新版本event执行顺序
 捕获阶段执行 -> 事件监听 -> 冒泡阶段执行

 notice: 主要区别：事件绑定与事件触发的修改
 */

//再创建root的时候就一口气向外层容器上注册完全部事件
function createRoot(container, options) {
  /* 省去和事件无关的代码，通过如下方法注册事件 */
  listenToAllSupportedEvents(rootContainerElement);
}
//note: 这里就会将浏览器中的事件进行注册
function listenToAllSupportedEvents(rootContainerElement) {
  /* allNativeEvents 是一个 set 集合，保存了大多数的浏览器事件 */
  allNativeEvents.forEach(function (domEventName) {
    if (domEventName !== 'selectionchange') {
      /* nonDelegatedEvents 保存了 js 中，不冒泡的事件 */
      if (!nonDelegatedEvents.has(domEventName)) {
        /* 在冒泡阶段绑定事件 */
        listenToNativeEvent(domEventName, false, rootContainerElement);
      }
      /* 在捕获阶段绑定事件 */
      listenToNativeEvent(domEventName, true, rootContainerElement);
    }
  });
}
/**
notice: 分析listenToAllSupportedEvents
listenToAllSupportedEvents 这个方法比较核心，主要目的就是通过 listenToNativeEvent 绑定浏览器事件，
这里引出了两个常量，allNativeEvents 和 nonDelegatedEvents ，它们分别代表的意思如下：

allNativeEvents：allNativeEvents 是一个 set 集合，保存了 81 个浏览器常用事件。 
nonDelegatedEvents ：这个也是一个集合，保存了浏览器中不会冒泡的事件，一般指的是媒体事件，比如 pause，play，playing 等，
还有一些特殊事件，比如 cancel ，close，invalid，load，scroll 。

mark: 接下来如果事件是不冒泡的，那么会执行一次，listenToNativeEvent，第二个参数为 true 。 如果是常规的事件，那么会执行两次 listenToNativeEvent，分别在冒泡和捕获阶段绑定事件。
*/
/**
 mark: listenToNativeEvent代码简单实现
 如下代码是源代码精简后的，并不是源码，isCapturePhaseListener 就是 listenToNativeEvent 的第二个参数，target 为 DOM 对象。dispatchEvent 为统一的事件监听函数。
 可以看到 listenToNativeEvent 本质上就是向原生 DOM 中去注册事件，上面还有一个细节，就是 dispatchEvent 已经通过 bind 的方式将事件名称等信息保存下来了。经过这第一步，在初始化阶段，就已经注册了很多的事件监听器了。
 */
function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
  var listener = dispatchEvent.bind(null, domEventName);
  if (isCapturePhaseListener) {
    target.addEventListener(eventType, dispatchEvent, true);
  } else {
    target.addEventListener(eventType, dispatchEvent, false);
  }
}
