import React from 'react';
/* 获取随机颜色 */
function getColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return 'rgba(' + r + ',' + g + ',' + b + ',0.8)';
}
/* 获取随机位置 */
function getPostion(position) {
  const { width, height } = position;
  return {
    left: Math.ceil(Math.random() * width) + 'px',
    top: Math.ceil(Math.random() * height) + 'px'
  };
}
/* 色块组件 */
function Circle({ position }) {
  const style = React.useMemo(() => {
    //mark: 用useMemo缓存，计算出来的随机位置和色值,避免重复render。
    return {
      background: getColor(),
      ...getPostion(position),
      position: 'absolute',
      height: '10px',
      width: '10px',
      borderRadius: '50%'
    };
  }, []);
  return <div style={style} className="circle" />;
}

export default Circle;
