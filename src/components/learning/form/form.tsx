import React from 'react';
type FormType = {
  [propName: string]: string;
};
class Form extends React.Component {
  static displayName = 'form';
  state!: {
    formData: FormType;
  };
  props!: { children: any };
  constructor(props: any) {
    super(props);
    this.state = {
      formData: {}
    };
  }

  submitForm(func: any) {
    func({ ...this.state.formData });
  }

  resetForm() {
    const { formData }: { formData: FormType } = this.state;
    Object.keys(formData).forEach((item: string) => {
      formData[item] = '';
    });
    this.setState({ formData });
  }

  setValue = (name: string, value: string) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value
      }
    });
  };

  render() {
    const { children } = this.props;
    const renderChildren: React.FunctionComponentElement<{
      key: any;
      handleChange: (name: string, value: string) => void;
      value: string;
    }>[] = [];
    React.Children.forEach(children, (child) => {
      if (child.type.displayName === 'formItem') {
        const { name } = child.props;
        const Children = React.cloneElement(
          child,
          {
            key: name,
            handleChange: this.setValue,
            value: this.state.formData[name] || ''
          },
          child.props.children
        );
        renderChildren.push(Children);
      }
    });

    return renderChildren;
  }
}

Form.displayName = 'form';

export default Form;
