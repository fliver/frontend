import { Container } from '@material-ui/core';
import { useRouter } from 'next/router';

import Basic from '../../components/Templates/Dashboard/EditComponents/basic';
import Registration from '../../components/Templates/Dashboard/EditComponents/registration';
import Shipping from '../../components/Templates/Dashboard/EditComponents/shipping';

const Edit = () => {
  const { query: { el, bid } } = useRouter();
  const ComponentToRender = () => {
    switch (el) {
      case 'basic':
        return <Basic bid={bid} />;
      case 'registration':
        return <Registration bid={bid} />;
      case 'shipping':
        return <Shipping bid={bid} />;
      default:
        return <h2>Nada para editar</h2>;
    }
  };
  return (
    <Container>
      <ComponentToRender />
    </Container>
  );
};

export default Edit;
