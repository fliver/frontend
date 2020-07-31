import Link from 'next/link';
import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import ImageCarousel from '../../ImageCarousel/ImageCarousel';
import styles from './ProductHome.module.css';

export default function ProductHome({ data, displayProduct }) {
  const [group, setGroup] = useState(displayProduct.imageGroup[0]);
  const [vars, setVars] = useState(displayProduct.vars.filter(
    (itemVar) => itemVar.imageGroupId.toString() === group.id,
  ));

  const [size, setSize] = useState(vars[0]);

  const handleGroup = (idx) => {
    setGroup(displayProduct.imageGroup[idx]);
    const varsBasedOnGroup = displayProduct.vars.filter(
      (itemVar) => itemVar.imageGroupId.toString() === group.id,
    );
    setVars(varsBasedOnGroup);
    setSize(0);
  };

  const handleVars = (idx) => {
    setSize(vars[idx]);
  };

  const getPrice = () => {
    if (displayProduct.price.isSale) {
      return `de R$${displayProduct.price.original} por R$${displayProduct.price.final}`;
    }
    return `R$${displayProduct.price.original}`;
  };

  return (
    <Container maxWidth="sm" disableGutters>
      <Link href="/[home]" as={`/${data.account.businessName}`}>
        <a>
          VOLTAR
        </a>
      </Link>
      <ImageCarousel imgGroup={group.images} />
      <div className={styles.product_content}>
        <div>
          <h1>{displayProduct.name}</h1>
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
            displayProduct.imageGroup.map((item, idx) => (
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
              <span>{size.size}</span>
            </p>
          </div>
          <div className={styles.group_item}>
            {
            vars.map((item, idx) => (
              <div>
                <button type="button" onClick={() => handleVars(idx)}>{item.size}</button>
              </div>
            ))
          }
          </div>
          <div>
            <p>{displayProduct.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.view_add_button}>
        <button type="button">Adicionar</button>
      </div>
    </Container>

  );
}
