import { useState, React } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import LearnFlat from './components/learning/learning_flat';
import Father from './components/learning/father_children_call';
import StateSet from './components/learning/state_set';
import LearningProps from './components/learning/props_learning';
import FormUse from './components/learning/form/form_use';
import LifeCycle from './components/learning/lifecycle';
import ReactRef from './components/learning/ref/react_ref';
import RefFunc from './components/learning/ref/react_ref_func';
import { GetRef01, GetRef02 } from './components/learning/ref/get_ref';
import GrandFather from './components/learning/ref/forward_ref/getforwardRef';
import MergeForwardRefHome from './components/learning/ref/forward_ref/merge_forwardRef';
import HocForwardRef from './components/learning/ref/forward_ref/hoc_forwardRef';
import ObjRefChatFather from './components/learning/ref/char_ref/obj_ref';
import FuncRefChat from './components/learning/ref/char_ref/func_ref';

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('adsionli');
  const handleClick = (name: string) => {
    setName(name);
  };

  return (
    <div className="App">
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p> */}
      {/* <LearnFlat />
      <Father />
      <StateSet /> */}
      {/* <LearningProps /> */}
      {/* <FormUse /> */}
      {/* <LifeCycle name={name} /> */}
      {/* <button
        onClick={() => {
          handleClick('adsionli');
        }}
      >
        组件初始化(adsionli)
      </button>
      <button
        onClick={() => {
          handleClick('shirley');
        }}
      >
        组件更新(shirley)
      </button> */}
      {/* <ReactRef />
      <RefFunc />
      <GetRef01 />
      <GetRef02 /> */}
      {/* <GrandFather /> */}
      {/* <MergeForwardRefHome /> */}
      {/* <HocForwardRef /> */}
      {/* <ObjRefChatFather /> */}
      <FuncRefChat />
    </div>
  );
}

export default App;
