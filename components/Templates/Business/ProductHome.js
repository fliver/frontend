import React, { useState, useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import ImageCarousel from '../../ImageCarousel/ImageCarousel';
import styles from './ProductHome.module.css';
import { CartContext } from '../../../src/contexts/CartContext';
import NavBar from '../../NavBar/NavBar';
import CustomHead from '../../CustomHead/CustomHead';
import getProductMainImage from '../../../src/utils/getProductMainImage';
import setVarsBasedOnImgGroup from '../../../src/utils/setVarsBasedOnImgGroup';
import ProductFeed from '../../ProductFeed/ProductFeed';

export default function ProductHome({ data, singleProduct }) {
  const { account, products } = data;
  const { addProduct } = useContext(CartContext);

  const [group, setGroup] = useState(singleProduct.imageGroup[0]);
  const [vars, setVars] = useState(() => setVarsBasedOnImgGroup(singleProduct));
  const [sku, setSku] = useState(vars[0]);
  const handleGroup = (idx) => {
    setGroup(singleProduct.imageGroup[idx]);
    const varsBasedOnGroup = singleProduct.vars.filter(
      (itemVar) => itemVar.imageGroupId.toString() === group.id,
    );
    setVars(varsBasedOnGroup);
    setSku(0);
  };

  const handleVars = (idx) => {
    setSku(vars[idx]);
  };

  useEffect(() => {
    setGroup(singleProduct.imageGroup[0]);
    setVars(() => setVarsBasedOnImgGroup(singleProduct));
    const [initialsku] = setVarsBasedOnImgGroup(singleProduct);
    setSku(initialsku);
  }, [singleProduct]);

  const getPrice = () => {
    if (singleProduct.price.isSale) {
      return `de R$${singleProduct.price.original} por R$${singleProduct.price.final}`;
    }
    return `R$${singleProduct.price.original}`;
  };

  const handleOtherProducts = (currentProduct) => (
    products.filter((product) => product._id !== currentProduct._id)
  );

  return (
    <div>
      <CustomHead
        title={singleProduct.name}
        description={singleProduct.description}
        canonicalURL={singleProduct.slug}
        ogURL={singleProduct.slug}
        ogTitle={singleProduct.name}
        ogDescription={singleProduct.description}
        ogImage={getProductMainImage(singleProduct)}
      />
      <NavBar backButton account={account} />
      <Container maxWidth="sm" disableGutters>
        <ImageCarousel imgGroup={group.images} altPrefix={singleProduct.name} />
        <div className={styles.product_content}>
          <div>
            <h1>{singleProduct.name}</h1>
            <h2>{getPrice()}</h2>
          </div>
          <div className={styles.group_wrap}>
            <div className={styles.group_name}>
              <p>
                Cor:
                <span>{group.color.name}</span>
              </p>
            </div>
            <div className={styles.group_item}>
              {
            singleProduct.imageGroup.map((item, idx) => (
              <div>
                <style jsx>
                  {`
                .btn_color {
                  background-color: ${item.color.code};
                }
              `}
                </style>
                <button type="button" className="btn_color" onClick={() => handleGroup(idx)} />
              </div>
            ))
          }
            </div>
            <div className={styles.group_name}>
              <p>
                Tamanho:
                <span>{sku.size}</span>
              </p>
            </div>
            <div className={styles.group_item}>
              {
            vars.map((itemSku, idx) => (
              <div>
                <button type="button" onClick={() => handleVars(idx)}>{itemSku.size}</button>
              </div>
            ))
          }
            </div>
            <div>
              <p>{singleProduct.description}</p>
            </div>
          </div>
        </div>
        <h2> Mais Produtos </h2>
        <ProductFeed account={account} products={handleOtherProducts(singleProduct)} />
        <div className={styles.view_add_button}>
          <button type="button" onClick={() => addProduct({ singleProduct, sku })}>Comprar</button>
        </div>
      </Container>
      {/* <FilterSection
          search={handleSearch}
          clearFilter={clearFilter}
          displayChip={displayChip}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        /> */}
    </div>
  );
}
