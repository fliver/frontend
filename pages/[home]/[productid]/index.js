import ProductHome from '../../../components/Templates/Business/ProductHome';
import NotFoundPage from '../../../components/Templates/404/NotFoundPage';

import config from '../../../src/config';

const ProductPage = ({
  data, productid, g, v,
}) => {
  if (!data.account) return <NotFoundPage />;

  const [singleProduct] = data.products.filter(
    (product) => product.slug.toString() === productid,
  );

  if (!singleProduct) return <NotFoundPage data={data} />;

  return <ProductHome data={data} singleProduct={singleProduct} group={g} vars={v} />;
};

export async function getServerSideProps({ query }) {
  const {
    home,
    productid,
  } = query;

  const res = await fetch(`${config.api}/account/${home}`);
  const data = await res.json();

  return {
    props: {
      data,
      productid,
      g: query.g || false,
      v: query.v || false,
    },
  };
}

export default ProductPage;
