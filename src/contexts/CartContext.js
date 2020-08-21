import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const CartContextProvider = (props) => {
  const [cartProducts, setCartProducts] = useState([]);

  const addProduct = ({ singleProduct, sku }) => {
    // checar se já existe mesmo sku adicionado. Se existir,
    // adicionar quantidade, se não existir adicionar produto.

    const [imgGroupToAdd] = singleProduct.imageGroup.filter(
      (imgGroup) => imgGroup.id.toString() === sku.imageGroupId.toString(),
    );

    const skuToAdd = {
      ...singleProduct,
      imageGroup: imgGroupToAdd,
      vars: sku,
    };
    setCartProducts([...cartProducts, skuToAdd]);
  };

  useEffect(() => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? setCartProducts(JSON.parse(localStorageCart)) : null;
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartProducts));
  }, [cartProducts]);

  return (
    <CartContext.Provider value={{ addProduct, cartProducts }}>
      { props.children }
    </CartContext.Provider>
  );
};

export default CartContextProvider;
