//note: 时间分片原理
// requestIdleCallback 是谷歌浏览器提供的一个 API， 在浏览器有空余的时间，浏览器就会调用 requestIdleCallback 的回调。首先看一下 requestIdleCallback的基本用法：

requestIdleCallback(callback,{ timeout })
/**
 1. callback 回调，浏览器空余时间执行回调函数。
 2. timeout 超时时间。如果浏览器长时间没有空闲，那么回调就不会执行，为了解决这个问题，可以通过 requestIdleCallback 的第二个参数指定一个超时时间。
 */

/**
note: React 为了防止 requestIdleCallback 中的任务由于浏览器没有空闲时间而卡死，所以设置了 5 个优先级。
1. Immediate -1 需要立刻执行。
2. UserBlocking 250ms 超时时间250ms，一般指的是用户交互。
3. Normal 5000ms 超时时间5s，不需要直观立即变化的任务，比如网络请求。
4. Low 10000ms 超时时间10s，肯定要执行的任务，但是可以放在最后处理。
5. Idle 一些没有必要的任务，可能不会执行。

conclusion: React 的异步更新任务就是通过类似 requestIdleCallback 去向浏览器做一帧一帧请求，等到浏览器有空余时间，去执行 React 的异步更新任务，这样保证页面的流畅。
 */