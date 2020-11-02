/* eslint-disable react/no-this-in-sfc */
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const CartContext = createContext();

const CartContextProvider = (props) => {
  const { query: { home: currentBusinessSlug } } = useRouter();
  const [cartProducts, setCartProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  const getCartIdx = (businessSlug) => cartProducts.findIndex(
    (item) => item.business === businessSlug,
  );

  const addNewProduct = ({ singleProduct, sku, businessSlug }) => {
    const [imgGroupToAdd] = singleProduct.imageGroup.filter(
      (imgGroup) => imgGroup.id.toString() === sku.imageGroupId.toString(),
    );

    const skuToAdd = {
      ...singleProduct,
      imageGroup: imgGroupToAdd,
      vars: sku,
      quantity: 1,
    };

    const cartIdx = getCartIdx(businessSlug);
    if (cartIdx >= 0) {
      const notUpdatedBusiness = cartProducts.filter(
        (business) => business.business !== businessSlug,
      );

      const [updatedBusiness] = cartProducts.filter(
        (business) => business.business === businessSlug,
      );

      updatedBusiness.products = [...updatedBusiness.products, skuToAdd];

      setCartProducts([...notUpdatedBusiness, updatedBusiness]);
    } else {
      const newCartBusiness = {
        business: businessSlug,
        products: [skuToAdd],
      };
      setCartProducts([...cartProducts, newCartBusiness]);
    }
  };

  const addUnit = ({ productIdx, businessSlug }) => {
    const businessIdx = getCartIdx(businessSlug);
    const cartToUpdate = [...cartProducts];

    cartToUpdate[businessIdx].products[productIdx].quantity += 1;
    setCartProducts(cartToUpdate);
  };

  const addProduct = ({ singleProduct, sku, businessSlug }) => {
    const isSku = [];
    const cartIdx = getCartIdx(businessSlug);
    if (cartIdx >= 0) {
      cartProducts[cartIdx].products.forEach((product, idx) => {
        if (product.vars.id === sku.id) {
          isSku.push({
            product,
            position: idx,
          });
        }
      });
    }
    isSku.length > 0
      ? addUnit({ productIdx: isSku[0].position, businessSlug })
      : addNewProduct({ singleProduct, sku, businessSlug });
  };

  const removeProduct = ({ varsId, businessSlug }) => {
    const cartIdx = getCartIdx(businessSlug);

    const notUpdatedBusiness = cartProducts.filter(
      (business) => business.business !== businessSlug,
    );

    const productsToUpdate = cartProducts[cartIdx].products;

    const updatedProductList = productsToUpdate.filter(
      (product) => product.vars.id !== varsId,
    );

    const updatedCart = [...notUpdatedBusiness, {
      business: businessSlug, products: [...updatedProductList],
    }];

    setCartProducts(updatedCart);
  };

  const removeUnit = ({ productIdx, varsId, businessSlug }) => {
    const cartIdx = getCartIdx(businessSlug);
    const cartToUpdate = [...cartProducts];

    if (cartToUpdate[cartIdx].products[productIdx].quantity > 1) {
      cartToUpdate[cartIdx].products[productIdx].quantity -= 1;
      setCartProducts(cartToUpdate);
    } else {
      removeProduct({ cartIdx, varsId, businessSlug });
    }
  };

  const priceBasedOnUnits = (qty, price) => qty * price;
  const getTotalUnits = ({ businessSlug }) => {
    const cartIdx = getCartIdx(businessSlug);
    const totalUnits = cartIdx === -1 ? 0 : cartProducts[cartIdx].products.reduce(
      (acc, product) => acc + product.quantity, 0,
    );
    return totalUnits;
  };

  useEffect(() => {
    const cartIdx = getCartIdx(currentBusinessSlug);

    if (cartIdx !== -1) {
      const newTotal = cartProducts.length > 0
          && cartProducts[cartIdx].products.reduce((acc, product) => {
            const productTotal = priceBasedOnUnits(
              product.quantity, product.price.sale || product.price.original,
            );
            return acc + productTotal;
          }, 0);

      setSubTotal(newTotal);
    }
  }, [cartProducts]);

  // useEffect(() => {
  //   const localStorageCart = localStorage.getItem('cart');
  //   return localStorageCart ? setCartProducts(JSON.parse(localStorageCart)) : null;
  // }, []);

  useEffect(() => {
    if (cartProducts.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartProducts));
    } else {
      const localStorageCart = localStorage.getItem('cart');
      localStorageCart && setCartProducts(JSON.parse(localStorageCart));
    }

    // localStorage.setItem('cart', JSON.stringify(cartProducts));
  }, [cartProducts]);

  return (
    <CartContext.Provider value={{
      addProduct,
      addUnit,
      removeProduct,
      removeUnit,
      cartProducts,
      getTotalUnits,
      subTotal,
      priceBasedOnUnits,
    }}
    >
      { props.children }
    </CartContext.Provider>
  );
};

export default CartContextProvider;
