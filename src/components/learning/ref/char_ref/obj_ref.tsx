import React from 'react';

class Son extends React.PureComponent<{
  toFather: any;
}> {
  state = {
    fatherMes: '',
    sonMes: ''
  };
  fatherSay = (fatherMes: string) =>
    this.setState({ fatherMes }); /* 提供给父组件的API */
  render() {
    const { fatherMes, sonMes } = this.state;
    return (
      <div className="sonbox">
        <div className="title">子组件</div>
        <p>父组件对我说：{fatherMes}</p>
        <div className="label">对父组件说</div>{' '}
        <input
          onChange={(e) => this.setState({ sonMes: e.target.value })}
          className="input"
        />
        <button
          className="searchbtn"
          onClick={() => this.props.toFather(sonMes)}
        >
          to father
        </button>
      </div>
    );
  }
}
/* 父组件 */
export default function ObjRefChatFather() {
  const [sonMes, setSonMes] = React.useState('');
  const sonInstance: any = React.useRef(null); /* 用来获取子组件实例 */
  const [fatherMes, setFatherMes] = React.useState('');
  const toSon = () =>
    sonInstance.current != null &&
    sonInstance.current.fatherSay(
      fatherMes
    ); /* 调用子组件实例方法，改变子组件state */
  return (
    <div className="box">
      <div className="title">父组件</div>
      <p>子组件对我说：{sonMes}</p>
      <div className="label">对子组件说</div>{' '}
      <input onChange={(e) => setFatherMes(e.target.value)} className="input" />
      <button className="searchbtn" onClick={toSon}>
        to son
      </button>
      <Son ref={sonInstance} toFather={setSonMes} />
    </div>
  );
}
