import { useState, React } from 'react';

function Son(props: { fatherSay: string; sayFather: any }) {
  const { fatherSay, sayFather } = props;
  return (
    <div className="son">
      我是子组件
      <div> 父组件对我说：{fatherSay} </div>
      <input
        placeholder="我对父组件说"
        onChange={(e) => sayFather(e.target.value)}
      />
    </div>
  );
}
/* 父组件 */
function Father() {
  const [childSay, setChildSay] = useState('');
  const [fatherSay, setFatherSay] = useState('');
  return (
    <div className="box father">
      我是父组件
      <div> 子组件对我说：{childSay} </div>
      <input
        placeholder="我对子组件说"
        onChange={(e) => setFatherSay(e.target.value)}
      />
      <Son fatherSay={fatherSay} sayFather={setChildSay} />
    </div>
  );
}

export default Father;
