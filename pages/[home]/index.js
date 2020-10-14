import BusinessHome from '../../components/Templates/Business/BusinessHome';
import UserHome from '../../components/Templates/User/UserHome';
import config from '../../src/config';

const HomePage = ({ data, query }) => {
  if (!data.account) return <h1>404 - Não Encontrado</h1>;

  const { accountType } = data.account;

  return accountType === 'business' ? <BusinessHome data={data} {...query} /> : <UserHome data={data} />;
};

export async function getServerSideProps({ query }) {
  const { home } = query;

  const res = await fetch(`${config.domain}/api/account/${home}`);
  const data = await res.json();

  return {
    props: {
      data,
      query,
    },
  };
}

export default HomePage;
