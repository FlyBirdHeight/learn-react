import { Suspense } from 'react';

function UserInfo() {
  const user = getUserInfo();

  return <h1>{user.name}</h1>;
}

export default function Index() {
  //mark Suspense 包裹异步渲染组件 UserInfo ，当 UserInfo 处于数据加载状态下，展示 Suspense 中 fallback 的内容。
  /**
   note: 异步渲染相比传统数据交互相比好处就是：
        1. 不再需要 componentDidMount 或 useEffect 配合做数据交互，也不会因为数据交互后，改变 state 而产生的二次更新作用。
        2. 代码逻辑更简单，清晰。
   */
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <UserInfo />
    </Suspense>
  );
}
