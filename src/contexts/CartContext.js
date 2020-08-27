import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const CartContextProvider = (props) => {
  const [cartProducts, setCartProducts] = useState([]);

  const addNewProduct = (singleProduct, sku) => {
    const [imgGroupToAdd] = singleProduct.imageGroup.filter(
      (imgGroup) => imgGroup.id.toString() === sku.imageGroupId.toString(),
    );

    const skuToAdd = {
      ...singleProduct,
      imageGroup: imgGroupToAdd,
      vars: sku,
      quantity: 1,
    };
    console.log('add singleProduct ', singleProduct);
    console.log('add sku singleProduct ', sku);
    console.log('skuToAdd ', skuToAdd);

    setCartProducts([...cartProducts, skuToAdd]);
  };

  const addUnit = (position) => {
    const cartToUpdate = [...cartProducts];
    cartToUpdate[position].quantity += 1;
    setCartProducts(cartToUpdate);
  };

  const addProduct = ({ singleProduct, sku }) => {
    // checar se já existe mesmo sku adicionado. Se existir,
    // adicionar quantidade, se não existir adicionar produto.

    const isSku = [];
    cartProducts.forEach((product, idx) => {
      if (product.vars.id === sku.id) {
        isSku.push({
          product,
          position: idx,
        });
      }
    });

    console.log('singleProduct ', singleProduct);
    console.log('sku ', sku);
    console.log('isSku ', isSku);

    isSku.length > 0 ? addUnit(isSku[0].position) : addNewProduct(singleProduct, sku);
  };

  const removeProduct = (skuId) => {
    const newProductList = cartProducts.filter((product) => product.vars.id !== skuId);
    setCartProducts(newProductList);
  };

  const removeUnit = (position, skuId) => {
    const cartToUpdate = [...cartProducts];
    if (cartToUpdate[position].quantity > 1) {
      cartToUpdate[position].quantity -= 1;
      setCartProducts(cartToUpdate);
    } else {
      removeProduct(skuId);
    }
  };

  useEffect(() => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? setCartProducts(JSON.parse(localStorageCart)) : null;
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartProducts));
    console.log('cartProducts ', cartProducts);
  }, [cartProducts]);

  return (
    <CartContext.Provider value={{
      addProduct, addUnit, removeProduct, removeUnit, cartProducts,
    }}
    >
      { props.children }
    </CartContext.Provider>
  );
};

export default CartContextProvider;
