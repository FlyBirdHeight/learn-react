import React from "react";
//note 动态加载
//dva 中 dynamic 就是配合 import ，实现组件的动态加载的，而且每次切换路由，都会有 Loading 效果，接下来看看大致的实现思路。
function dynamicHoc(loadRouter: any) {
  return class Content extends React.Component {
    state = { Component: null };
    //note 在 componentDidMount 生命周期动态加载上述的路由组件Component，如果在切换路由或者没有加载完毕时，显示的是 Loading 效果。
    componentDidMount() {
      if (this.state.Component) return;
      loadRouter()
        .then((module: any) => module.default) // 动态加载 component 组件
        .then((Component: any) => this.setState({ Component }));
    }
    render() {
      const { Component } = this.state;
      //note 切换路由或者没有加载完毕时，显示的是 Loading 效果。
      return Component ? <Component {...this.props} /> : <Loading />;
    }
  };
}
const Index = dynamicHoc(()=>import('../pages/index'));
