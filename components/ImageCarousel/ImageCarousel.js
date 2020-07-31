import { useState } from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import config from '../../src/config';
import styles from './ImageCarousel.module.css';

export default function ImageCarousel({ imgGroup }) {
  const [imgIdx, setImgIdx] = useState(0);
  const data = { title: 'novo produto' };

  const forward = () => {
    if (imgIdx < imgGroup.length - 1) {
      const nextPosition = imgIdx + 1;
      setImgIdx(nextPosition);
    }
  };

  const backward = () => {
    if (imgIdx > 0) {
      const previousPosition = imgIdx - 1;
      setImgIdx(previousPosition);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <img src={`${config.domain}static/${imgGroup[imgIdx]}`} alt={data.title} />
      </div>
      <div className={styles.controller}>
        <div className={styles.controller_btn}>
          <button type="button" onClick={() => backward()}><ArrowBackIosIcon /></button>
          <button type="button" onClick={() => forward()}><ArrowForwardIosIcon /></button>
        </div>
      </div>
    </div>
  );
}