import React from 'react';
function FormItem(props: any) {
  const { children, name, handleChange, value, label } = props;
  const onChange = (value: string | any) => {
    /* 通知上一次value 已经改变 */
    handleChange(name, value);
  };
  return (
    <div className="form-item">
      <span className="label">{label}:</span>
      {React.isValidElement(children) && children.type.displayName === 'input'
        ? React.cloneElement(children, { onChange, value })
        : null}
    </div>
  );
}
FormItem.displayName = 'formItem';

/* Input 组件, 负责回传value值 */
function Input({ onChange, value }: { onChange: any; value: any }) {
  return (
    <input
      className="input"
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
    />
  );
}
/* 给Component 增加标签 */
Input.displayName = 'input';

export { FormItem, Input };
