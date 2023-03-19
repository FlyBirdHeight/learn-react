import React, { componentDidCatch } from 'react';

function ErrorTest() {
  throw new Error(123);
}

function Test() {
  return <div>let us learn React!</div>;
}

export default class CatchComponentError extends React.Component {
  state = {
    hasError: false
  };
  componentDidCatch(...arg) {
    // uploadErrorLog(arg); /* 上传错误日志 */
    this.setState({
      /* 降级UI */ hasError: true
    });
  }

  render() {
    const { hasError } = this.state;
    console.log(hasError);
    return (
      <div>
        {hasError ? <div>组件出现错误</div> : <ErrorTest />}
        <div> hello, my name is alien! </div>
        <Test />
      </div>
    );
  }
}
