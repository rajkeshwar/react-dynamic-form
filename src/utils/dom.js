export const Switch = (props) => {
  const { test, children } = props;
  return children.find((child) => child.props.type === test);
};

export const genRandomId = () => Math.random().toString(32).slice(2);

export const serialize = (fromValue) => {
  let formKeyValue = {};
  for (let field of fromValue) {
    formKeyValue[field.name] = field.value;
  }
  return formKeyValue;
};
