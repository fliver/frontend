import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import NavBar from '../../NavBar/NavBar';
import CustomHead from '../../CustomHead/CustomHead';
import ProductFeed from '../../ProductFeed/ProductFeed';

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function NotFoundPage({ data }) {
  const account = data && data.account;
  const products = data && data.products;

  const classes = useStyles();

  const LandingPage = () => (
    <>
      <h2>Não encontramos esta página ou loja</h2>
      <p>Verifiquei o nome e tente novamente</p>
      <h1>Crie a sua loja grátis em poucos minutos</h1>
      <p>confira a seguir</p>
    </>
  );

  const Business = () => (
    <>
      <CustomHead
        title={account.displayName}
        description={account.about}
        canonicalURL={account.businessName}
        ogURL={account.businessName}
        ogTitle={account.displayName}
        ogDescription={account.about}
        ogImage={account.logo}
      />
      <NavBar backButton account={account} />
      <Container maxWidth="sm" disableGutters>
        <div className={classes.header}>
          <h2>Produto Não Encontrado :( </h2>
          <h3>Confira os produtos seguintes</h3>
        </div>
        <ProductFeed account={account} products={products} />
      </Container>
    </>
  );

  return (
    <div>
      {
        data ? <Business /> : <LandingPage />
      }
    </div>
  );
}
