/**
 note： requestIdleCallback 目前只有谷歌浏览器支持 ，为了兼容每个浏览器，React需要自己实现一个 requestIdleCallback
 */
/**
 mark: 实现所需要具备的两个条件：
 1. 实现的这个 requestIdleCallback ，可以主动让出主线程，让浏览器去渲染视图。
 2. 一次事件循环只执行一次，因为执行一个以后，还会请求下一次的时间片。

 conclusion: 能够满足上述条件的，就只有 宏任务，宏任务是在下次事件循环中执行，不会阻塞浏览器更新。而且浏览器一次只会执行一个宏任务。
 */

//TODO: 首先可以使用setTimeout(fn, 0)
/**
 mark: setTimeout(fn, 0) 可以满足创建宏任务，让出主线程，为什么 React 没选择用它实现 Scheduler 呢？原因是递归执行 setTimeout(fn, 0) 时，
 最后间隔时间会变成 4 毫秒左右，而不是最初的 1 毫秒。所以 React 优先选择的并不是 setTimeout 实现方案。
*/
let time = 0;
let nowTime = +new Date();
let timer;
const poll = function () {
  timer = setTimeout(() => {
    const lastTime = nowTime;
    nowTime = +new Date();
    console.log('递归setTimeout(fn,0)产生时间差：', nowTime - lastTime);
    poll();
  }, 0);
  time++;
  if (time === 20) clearTimeout(timer);
};
poll();
