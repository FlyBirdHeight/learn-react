/**
 analysis: 分析一下MessageChannel在react实现requestIdleCallback时的具体工作流程
 1. 在一次更新中，React 会调用 requestHostCallback ，把更新任务赋值给 scheduledHostCallback ，然后 port2 向 port1 发起 postMessage 消息通知。
 2. port1 会通过 onmessage ，接受来自 port2 消息，然后执行更新任务 scheduledHostCallback ，然后置空 scheduledHostCallback ，借此达到异步执行目的。
 */

let scheduledHostCallback = null 
/* 建立一个消息通道 */
var channel = new MessageChannel();
/* 建立一个port发送消息 */
var port = channel.port2;

channel.port1.onmessage = function(){
    /* 执行任务 */
    scheduledHostCallback() 
    /* 执行完毕，清空任务 */
    scheduledHostCallback = null
};
/* 向浏览器请求执行更新任务 */
requestHostCallback = function (callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);
  }
};