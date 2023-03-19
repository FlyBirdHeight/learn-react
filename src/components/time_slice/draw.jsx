import React, { useState, componentDidMount } from 'react';
import Circle from './circle';
import './draw.css';
class Index extends React.Component {
  state = {
    dataList: [], // 数据源列表
    renderList: [], // 渲染列表
    position: { width: 0, height: 0 }, // 位置信息
    eachRenderNum: 500
  };
  box = React.createRef();
  componentDidMount() {
    const { offsetHeight, offsetWidth } = this.box.current;
    const originList = new Array(20000).fill(1);
    const times = Math.ceil(
      originList.length / this.state.eachRenderNum
    ); /* 计算需要渲染此次数*/
    let index = 1;
    this.setState(
      {
        dataList: originList,
        position: { height: offsetHeight, width: offsetWidth }
      },
      () => {
        this.toRenderList(index, times);
      }
    );
  }
  toRenderList = (index, times) => {
    if (index > times) return; /* 如果渲染完成，那么退出 */
    const { renderList } = this.state;
    renderList.push(
      this.renderNewList(index)
    ); /* 通过缓存element把所有渲染完成的list缓存下来，下一次更新，直接跳过渲染 */
    this.setState({
      renderList
    });
    requestIdleCallback(() => {
      /* 用 requestIdleCallback 代替 setTimeout 浏览器空闲执行下一批渲染 */
      this.toRenderList(++index, times);
    });
  };
  renderNewList(index) {
    /* 得到最新的渲染列表 */
    const { dataList, position, eachRenderNum } = this.state;
    const list = dataList.slice(
      (index - 1) * eachRenderNum,
      index * eachRenderNum
    );
    return (
      <React.Fragment key={`fragment-${index}`}>
        {list.map((item, i) => (
          <Circle key={i} position={position} />
        ))}
      </React.Fragment>
    );
  }
  render() {
    //mark: 这里利用了diff算法的oldFiber复用的原理，所以使用renderList缓存的时候就不会重复渲染了
    return (
      <div className="bigData_index" ref={this.box}>
        {this.state.renderList}
      </div>
    );
  }
}
/* 控制展示Index */
export default () => {
  const [show, setShow] = useState(false);
  const [btnShow, setBtnShow] = useState(true);
  const handleClick = () => {
    setBtnShow(false);
    setTimeout(() => {
      setShow(true);
    }, []);
  };
  const styler = {
    height: '100%',
    width: '100%'
  };
  return (
    <div style={styler}>
      {btnShow && <button onClick={handleClick}>show</button>}
      {show && <Index />}
    </div>
  );
};
