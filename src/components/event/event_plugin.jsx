

//note: 事件插件机制
/**
 note: 
 registrationNameModules 记录了 React 事件（比如 onBlur ）和与之对应的处理插件的映射，比如上述的 onClick ，
 就会用 SimpleEventPlugin 插件处理，onChange 就会用 ChangeEventPlugin 处理。应用于事件触发阶段，根据不同事件使用不同的插件。
 */
export const registrationNameModules = {
    onBlur: 'SimpleEventPlugin',
    onClick: 'SimpleEventPlugin',
    onClickCapture: 'SimpleEventPlugin',
    onChange: 'ChangeEventPlugin',
    onChangeCapture: 'ChangeEventPlugin',
    onMouseEnter: 'EnterLeaveEventPlugin',
    onMouseLeave: 'EnterLeaveEventPlugin',
    // ...
}
/** 
notice:
为什么要用不同的事件插件处理不同的 React 事件?
答：首先对于不同的事件，有不同的处理逻辑；对应的事件源对象也有所不同，
React 的事件和事件源是自己合成的，所以对于不同事件需要不同的事件插件处理。
*/


/**
 mark:
 这个对象保存了 React 事件和原生事件对应关系，这就解释了为什么上述只写了一个 onChange ，
 会有很多原生事件绑定在 document 上。在事件绑定阶段，如果发现有 React 事件，比如 onChange ，
 就会找到对应的原生事件数组，逐一绑定。 
 */
export const registrationNameDependencies = {
    onBlur: ['blur'],
    onClick: ['click'],
    onClickCapture: ['click'],
    onChange: ['blur', 'change', 'click', 'focus', 'input', 'keydown', 'keyup', 'selectionchange'],
    onMouseEnter: ['mouseout', 'mouseover'],
    onMouseLeave: ['mouseout', 'mouseover'],
    //...
}

