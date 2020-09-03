/* eslint-disable react/no-this-in-sfc */
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

    setCartProducts([...cartProducts, skuToAdd]);
  };

  const addUnit = (position) => {
    const cartToUpdate = [...cartProducts];
    cartToUpdate[position].quantity += 1;
    setCartProducts(cartToUpdate);
  };

  const addProduct = ({ singleProduct, sku }) => {
    const isSku = [];
    cartProducts.forEach((product, idx) => {
      if (product.vars.id === sku.id) {
        isSku.push({
          product,
          position: idx,
        });
      }
    });
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

  const priceBasedOnUnits = (qty, price) => qty * price;
  const totalUnits = cartProducts.reduce((acc, product) => acc + product.quantity, 0);

  const subTotal = cartProducts.reduce((acc, product) => {
    const productTotal = priceBasedOnUnits(product.quantity, product.price.original);
    return acc + productTotal;
  }, 0);

  useEffect(() => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? setCartProducts(JSON.parse(localStorageCart)) : null;
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartProducts));
  }, [cartProducts]);

  return (
    <CartContext.Provider value={{
      addProduct,
      addUnit,
      removeProduct,
      removeUnit,
      cartProducts,
      totalUnits,
      subTotal,
      priceBasedOnUnits,
    }}
    >
      { props.children }
    </CartContext.Provider>
  );
};

export default CartContextProvider;
