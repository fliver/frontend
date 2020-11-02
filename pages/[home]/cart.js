import ShoppingCart from '../../components/Templates/Business/ShoppingCart';

export default function Cart({ currentBusinessSlug }) {
  return <ShoppingCart currentBusinessSlug={currentBusinessSlug} />;
}

export function getServerSideProps({ query }) {
  const { home } = query;

  return {
    props: {
      currentBusinessSlug: home,
    },
  };
}
