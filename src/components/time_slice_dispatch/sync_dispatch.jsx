//analysis: workLoopSync，workLoopConcurrent
/**
 note: 每一次workLoop中都会对所有需要更新的fiber进行执行，区别在于shouldYield()的调用
 mark: 如果当前浏览器没有空余时间， shouldYield 会中止循环，直到浏览器有空闲时间后再继续遍历，从而达到终止渲染的目的。
 conclusion: 这样就解决了一次性遍历大量的 fiber ，导致浏览器没有时间执行一些渲染任务，导致了页面卡顿。
 */
function workLoopSync() {
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function workLoopConcurrent() {
  //analysis: shouldYield函数用来判断是否需要进行等待，这里针对的是低优先的任务
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

/**
 note: 无论是上述正常更新任务 workLoopSync 还是低优先级的任务 workLoopConcurrent ，都是由调度器 scheduleCallback 统一调度的
 */
//analysis: 分析两者区别
//todo: 正常任务
scheduleCallback(Immediate, workLoopSync);
//todo: 异步任务
/* 计算超时等级，就是如上那五个等级 */
var priorityLevel = inferPriorityFromExpirationTime(
  currentTime,
  expirationTime
);
scheduleCallback(priorityLevel, workLoopConcurrent);
//note： scheduleCallback具体执行
function scheduleCallback(timeout, task) {
  /* 
  计算过期时间：超时时间  = 开始时间（现在时间） + 任务超时的时间（上述设置那五个等级） 
  mark: startTime = currentTime + delay(配置中的延迟时间)    
  */
  const expirationTime = startTime + timeout;
  /* 创建一个新任务 */
  const newTask = {};
  //判断任务开始事件是否大于当前时间
  if (startTime > currentTime) {
    /* 通过开始时间排序 */
    newTask.sortIndex = startTime;
    /* 把任务放在timerQueue中 */
    //mark: timerQueue中存放的是未过期任务，根据任务开始时间进行排序，然后再调度workLoop中使用advanceTimers检查任务是否过期，如果过期放入taskQueue
    push(timerQueue, newTask);
    /*  执行setTimeout ， */
    requestHostTimeout(handleTimeout, startTime - currentTime);
  } else {
    /* 通过 expirationTime过期时间对任务进行排序  */
    newTask.sortIndex = expirationTime;
    /* 把任务放入taskQueue */
    //mark: taskQueue中存放的都是过期任务,需要在调度的 workLoop 中循环执行完这些任务
    push(taskQueue, newTask);
    /*没有处于调度中的任务， 然后向浏览器请求一帧，浏览器空闲执行 flushWork */
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }
}
/**
 analysis: scheduleCallback 流程如下。
 1. 创建一个新的任务 newTask。
 2. 通过任务的开始时间( startTime ) 和 当前时间( currentTime ) 比较:当 startTime > currentTime, 说明未过期, 存到 timerQueue，当 startTime <= currentTime, 说明已过期, 存到 taskQueue。
 3. 如果任务过期，并且没有调度中的任务，那么调度 requestHostCallback。本质上调度的是 flushWork。
 4. 如果任务没有过期，用 requestHostTimeout 延时执行 handleTimeout。
 */

/**
 上述当一个任务，没有超时，那么 React 把它放入 timerQueue中了，但是它什么时候执行呢 ？
这个时候 Schedule 用 requestHostTimeout 让一个未过期的任务能够到达恰好过期的状态， 
note: requestHostTimeout的作用就是将一个还没有过期的任务调度成为一个恰好过期的状态的一个函数，使用setTimeout进行实现
那么需要延迟 startTime - currentTime 毫秒就可以了。requestHostTimeout 就是通过 setTimeout 来进行延时指定时间的。
*/
requestHostTimeout = function (cb, ms) {
  _timeoutID = setTimeout(cb, ms);
};

cancelHostTimeout = function () {
  clearTimeout(_timeoutID);
};
//conclusion: requestHostTimeout 延时执行 handleTimeout，cancelHostTimeout 用于清除当前的延时器。
//analysis: handleTimeout就是传入到requestHostTimeout的callback函数
function handleTimeout() {
  //mark: isHostTimeoutScheduled的作用就是判断当前主线程中是否有正在进行调度中执行的任务
  isHostTimeoutScheduled = false;
  /* 将 timeQueue 中过期的任务，放在 taskQueue 中 。 */
  advanceTimers(currentTime);
  /* 如果没有处于调度中 */
  if (!isHostCallbackScheduled) {
    /* 判断有没有过期的任务， */
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      /* 开启调度任务 */
      requestHostCallback(flushWork);
    }
  }
}
/**
 conclusion: 通过 advanceTimers 将 timeQueue 中过期的任务转移到 taskQueue 中。然后调用 requestHostCallback 调度过期的任务。
 */
function advanceTimers() {
  //analysis: 用来获取timerQueue中过期的任务
  var timer = peek(timerQueue);
  while (timer !== null) {
    //analysis: 如果这个任务的callback不存在，直接弹出，不放入到taskQueue中
    if (timer.callback === null) {
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      /* 如果任务已经过期，那么将 timerQueue 中的过期任务，放入taskQueue，并且从timerQueue中弹出，然后再为这个调度任务添加一个sortIndex是他的过期时间 */
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
    }
  }
}

/**
 conclusion: 综上所述要明白两件事：
 1. 第一件是 React 的更新任务最后都是放在 taskQueue 中的。
 2. 第二件是 requestHostCallback ，放入 MessageChannel 中的回调函数是flushWork。
 */
function flushWork() {
  if (isHostTimeoutScheduled) {
    /* 如果有延时任务，那么先暂定延时任务*/
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }
  try {
    /* 执行 workLoop 里面会真正调度我们的事件  */
    workLoop(hasTimeRemaining, initialTime);
  } catch (error) {}
}
//note: flushWork 如果有延时任务执行的话，那么会先暂停延时任务，然后调用 workLoop ，去真正执行超时的更新任务。
/**
 notice: workLoop 是调度中的 workLoop，不要把它和调和中的 workLoop 弄混淆了
 */
function workLoop() {
  var currentTime = initialTime;
  advanceTimers(currentTime);
  /* 获取任务列表中的第一个 */
  currentTask = peek();
  while (currentTask !== null) {
    /* 真正的更新函数 callback */
    var callback = currentTask.callback;
    if (callback !== null) {
      /* 执行更新 */
      callback();
      /* 先看一下 timeQueue 中有没有 过期任务。 */
      advanceTimers(currentTime);
    }
    /* 再一次获取任务，循环执行 */
    currentTask = peek(taskQueue);
  }
}
