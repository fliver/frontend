import { createContext, useState } from 'react';

export const ProductFeedContext = createContext();

const ProductFeedContextProvider = (props) => {
  const [products, setProducts] = useState();

  return (
    <ProductFeedContext.Provider value={{ products, setProducts }}>
      {props.children}
    </ProductFeedContext.Provider>
  );
};

export default ProductFeedContextProvider;
