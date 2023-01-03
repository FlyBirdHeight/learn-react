/**
 * NOTE: 如果通过高阶组件包裹一个原始类组件，就会产生一个问题，如果高阶组件 HOC 没有处理 ref ，
 * 那么由于高阶组件本身会返回一个新组件，所以当使用 HOC 包装后组件的时候，
 * 标记的 ref 会指向 HOC 返回的组件，而并不是 HOC 包裹的原始类组件，为了解决这个问题，
 * forwardRef 可以对 HOC 做一层处理。
 */
import React, { useEffect } from 'react';
import { useRef } from 'react';
function HOC(Component: any) {
  class Wrap extends React.Component<{
    forwardRef: any;
  }> {
    render() {
      const { forwardRef, ...otherprops } = this.props;

      return <Component ref={forwardRef} {...otherprops} />;
    }
  }

  return React.forwardRef((props, ref) => <Wrap forwardRef={ref} {...props} />);
}

class Index extends React.Component {
  render() {
    return <div>hello, world</div>;
  }
}
const HocIndex = HOC(Index);

export default function HocForwardRef() {
  const node = useRef(null);
  useEffect(() => {
    console.log(node.current);
  }, []);

  return (
    <div>
      获取高阶组件的ref对象，通过使用ForwardRef
      <HocIndex ref={node} />
    </div>
  );
}
