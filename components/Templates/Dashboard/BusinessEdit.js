import { Container } from '@material-ui/core';
import { useState } from 'react';

const BusinessEdit = (props) => {
  const [test, setTes] = useState('test');

  const ComponentToRender = () => {
    switch (props.component) {
      case 'basic':
        return <h1>basic</h1>;
      case 'registration':
        return <h2>registration</h2>;
      default:
        return <h1>Edit</h1>;
    }
  };
  return (
    <Container>
      <ComponentToRender />
    </Container>
  );
};

export default BusinessEdit;
