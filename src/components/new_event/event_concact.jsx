// mark: dispatchEvent 保留核心的代码如下
function dispatchEvent() {
  //....
  batchedUpdates(function () {
    return dispatchEventsForPlugins(
      domEventName,
      eventSystemFlags,
      nativeEvent,
      ancestorInst
    );
  });
  //....
}
/**
 dispatchEvent 如果是正常的事件，就会通过 batchedUpdates 来处理 dispatchEventsForPlugins ，batchedUpdates 是批量更新的逻辑，
 在之前的章节中已经讲到通过这种方式来让更新变成可控的。所有的矛头都指向了 dispatchEventsForPlugins ，这个函数做了些什么呢？
 */
function dispatchEventsForPlugins(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer
) {
  /* 找到发生事件的元素——事件源 */
  var nativeEventTarget = getEventTarget(nativeEvent);
  /* 待更新队列 */
  var dispatchQueue = [];
  /* 找到待执行的事件 */
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags
  );
  /* 执行事件 */
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}
/**
 note: 上述代码流程
 这个函数非常重要，首先通过 getEventTarget 找到发生事件的元素，也就是事件源。然后创建一个待更新的事件队列，
 接下来通过 extractEvents 找到待更新的事件，然后通过 processDispatchQueue 执行事件。
 */

//notice: 举例说明
function Index() {
  const handleClick = () => {
    console.log('冒泡阶段执行');
  };
  const handleCaptureClick = () => {
    console.log('捕获阶段执行');
  };
  const handleParentClick = () => {
    console.log('div 点击事件');
  };
  return (
    <div onClick={handleParentClick}>
      <button onClick={handleClick} onClickCapture={handleCaptureClick}>
        点击
      </button>
    </div>
  );
}

//note: extractEvents函数中的一段处理逻辑
function extractEvents() {
  var SyntheticEventCtor = SyntheticEvent;
  /* 针对不同的事件，处理不同的事件源 */
  switch (domEventName) {
    case 'keydown':
    case 'keyup':
      SyntheticEventCtor = SyntheticKeyboardEvent;
      break;
    case 'focusin':
      reactEventType = 'focus';
      SyntheticEventCtor = SyntheticFocusEvent;
      break;
    //....
  }
  /* 找到事件监听者，也就是我们 onClick 绑定的事件处理函数 */
  var _listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    inCapturePhase,
    accumulateTargetOnly
  );
  /* 向 dispatchQueue 添加 event 和 listeners  */
  if (_listeners.length > 0) {
    var _event = new SyntheticEventCtor(
      reactName,
      reactEventType,
      null,
      nativeEvent,
      nativeEventTarget
    );
    dispatchQueue.push({
      event: _event,
      listeners: _listeners
    });
  }
}
/**
  notice: 上面还有一个细节就是 _listeners 是什么？ _listeners 本质上也是一个对象，里面有三个属性。
  1. currentTarget：发生事件的 DOM 元素。 
  2. instance ： button 对应的 fiber 元素。 
  3. listener ：一个数组，存放绑定的事件处理函数本身，上面 demo 中就是绑定给 onClick，onClickCapture 的函数。
 */
/* 如果在捕获阶段执行。 */
function dispatchEvent() {
  if (inCapturePhase) {
    for (var i = dispatchListeners.length - 1; i >= 0; i--) {
      var _dispatchListeners$i = dispatchListeners[i],
        instance = _dispatchListeners$i.instance,
        currentTarget = _dispatchListeners$i.currentTarget,
        listener = _dispatchListeners$i.listener;

      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }

      /* 执行事件 */
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  } else {
    for (var _i = 0; _i < dispatchListeners.length; _i++) {
      var _dispatchListeners$_i = dispatchListeners[_i],
        _instance = _dispatchListeners$_i.instance,
        _currentTarget = _dispatchListeners$_i.currentTarget,
        _listener = _dispatchListeners$_i.listener;

      if (_instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      /* 执行事件 */
      executeDispatch(event, _listener, _currentTarget);
      previousInstance = _instance;
    }
  }
}
