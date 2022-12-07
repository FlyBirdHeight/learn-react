import React from 'react';
import Form from './form';
import { FormItem, Input } from './form_item';

const FormUse = () => {
  const form = React.useRef(null);
  const submit = () => {
    form.current!.submitForm((formValue: { name: string; mes: string }) => {
      console.log(formValue);
    });
  };
  const reset = () => {
    form.current!.resetForm();
  };

  return (
    <div className="box">
      <Form ref={form}>
        <FormItem name="name" label="我是">
          <Input />
        </FormItem>
        <FormItem name="mes" label="我想对大家说">
          <Input />
        </FormItem>
        <input placeholder="不需要的input" />
        <Input />
      </Form>
      <div className="btns">
        <button className="searchbtn" onClick={submit}>
          提交
        </button>
        <button className="concellbtn" onClick={reset}>
          重置
        </button>
      </div>
    </div>
  );
};

export default FormUse;
