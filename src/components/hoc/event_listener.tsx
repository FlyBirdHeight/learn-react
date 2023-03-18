import React from "react";
import { useEffect, useRef } from "react";

function ClickHoc(Component: any): any {
  return function Wrap(props: any) {
    const dom = useRef(null);
    useEffect(() => {
      const handerClick = () => console.log('发生点击事件');
      dom!.current.addEventListener('click', handerClick);
      return () => dom!.current.removeEventListener('click', handerClick);
    }, []);
    return (
      <div ref={dom}>
        <Component {...props} />
      </div>
    );
  };
}

// @ClickHoc
class Index extends React.Component {
  render() {
    return (
      <div className="index">
        <p>hello, world</p>
        <button>组件内部点击</button>
      </div>
    );
  }
}
const clickListener = ClickHoc(Index);
export default () => {
  return (
    <div className="box">
      <clickListener />
      <button>组件外部点击</button>
    </div>
  );
};
