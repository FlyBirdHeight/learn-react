import React from 'react';
type StateData = {
  //   name: string
  mes: string;
  body:
    | string
    | ((instance: HTMLDivElement | null) => void)
    | RefObject<HTMLDivElement>
    | null
    | undefined;
};
type PropsData = {
  name: string;
};
class LifeCycle extends React.Component<PropsData> {
  state: StateData;
  constructor(props: any) {
    super(props);
    this.state = {
      //   name: 'adsionli',
      mes: '',
      body: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(name: string) {
    // console.log(name)
    // this.setState({ name })
  }

  static getDerivedStateFromProps(newProps: StateData) {
    const { name }: { name: string } = newProps;
    console.log(name);

    switch (name) {
      case 'adsionli':
        return { mes: 'oh! adsionli' };
      default:
        return { mes: 'oh! shirley' };
    }
  }
  /**
   * NOTE: 执行在render之后的
   * @method getSnapshotBeforeUpdate 是在真实dom更新之前执行，可以用来获取dom的未更新时的内容
   * @param prevProps
   * @param preState
   */
  getSnapshotBeforeUpdate(prevProps: PropsData, preState: StateData) {
    console.log(prevProps, preState);
    return {
      oldName: prevProps.name,
      oldMes: preState.mes
    };
  }
  /**
   * NOTE: 执行在getSnapshotBeforeUpdate之后的
   * @method componentDidUpdate 真实dom更新之后，可以接受三个参数，分别是之前的props，state以及snapshot传递过来的数据
   * @param prevProps
   * @param preState
   * @param snapshot
   */
  componentDidUpdate(
    prevProps: PropsData,
    preState: StateData,
    snapshot: { oldName: string; oldMes: string }
  ) {
    console.log(prevProps, preState, snapshot);
    console.log(this.state);
  }
  /**
   * @method componentDidMount 真实组件挂载渲染完成之后，执行，适合做一些请求数据渲染视图
   */
  componentDidMount() {
    console.log(this.state.body);
  }
  shouldComponentUpdate(newProps: PropsData, newState: StateData) {
    if (newProps.name !== this.props.name) {
      /* props中a属性发生变化 渲染组件 */
      return true;
    } else {
      /* 否则组件不渲染 */
      return false;
    }
  }
  /**
   * NOTE: 执行在getDerivedStateFromProps之后
   */
  render() {
    return (
      <div className="button-group" ref={this.state.body}>
        <div>{this.props.name}</div>
        <p>{this.state.mes}</p>
        <button
          onClick={() => {
            this.handleClick('adsionli is strong');
          }}
        >
          点击测试生命周期
        </button>
      </div>
    );
  }
}

export default LifeCycle;
