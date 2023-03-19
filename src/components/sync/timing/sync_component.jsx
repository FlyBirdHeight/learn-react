import React from "react";

/**
 *
 * @param {*} Component  需要异步数据的component
 * @param {*} api        请求数据接口,返回Promise，可以再then中获取与后端交互的数据
 * @returns
 */
export default function AysncComponent(Component, api) {
  const AsyncComponentPromise = () =>
    new Promise(async (resolve) => {
      const renderData = await api();

      resolve({
        default: (props) => <Component rdata={renderData} {...props} />
      });
    });

  return React.lazy(AsyncComponentPromise);
}
