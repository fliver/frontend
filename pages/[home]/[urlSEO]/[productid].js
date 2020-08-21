import ProductHome from '../../../components/Templates/Business/ProductHome';
import config from '../../../src/config';

const ProductPage = ({
  data, productid, g, v,
}) => {
  if (!data.account) return <h1>404</h1>;

  const [singleProduct] = data.products.filter(
    (product) => product._id.toString() === productid,
  );

  return <ProductHome data={data} singleProduct={singleProduct} group={g} vars={v} />;
};

export async function getServerSideProps({ query }) {
  const {
    home,
    productid,
  } = query;

  const res = await fetch(`${config.domain}/api/account/${home}`);
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
