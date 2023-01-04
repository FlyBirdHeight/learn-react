import React from 'react';
/**
 * NOTE: forwardRef 把 ref 变成了可以通过 props 传递和转发
 */
function Son(props: { grandRef: any }) {
  const { grandRef } = props;
  return (
    <div>
      <div>i am alien</div>
      <span ref={grandRef}> 这个是想要获取元素</span>
    </div>
  );
}

class Father extends React.Component<{
  grandRef: any;
}> {
  constructor(props: { grandRef: any }) {
    super(props);
  }

  render() {
    return (
      <div>
        <Son grandRef={this.props.grandRef}></Son>
      </div>
    );
  }
}

const NewFather = React.forwardRef((props, ref) => (
  <Father grandRef={ref} {...props} />
));

class GrandFather extends React.Component {
  constructor(props: any) {
    super(props);
  }
  node = null;
  componentDidMount() {
    console.log('forwardRef node:', this.node);
  }

  render() {
    return (
      <div>
        <NewFather
          ref={(node: HTMLSpanElement) =>
            ((this.node as unknown as HTMLSpanElement) = node)
          }
        />
      </div>
    );
  }
}

export default GrandFather;
