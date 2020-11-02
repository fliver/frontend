import { Typography } from '@material-ui/core';

const Original = ({ textVariant, price }) => (
  <Typography
    variant={textVariant}
    component="h3"
      // color="textSecondary"
    style={{
      fontWeight: '600',
    }}
  >
    R$
    {' '}
    {price.original}
  </Typography>
);

const Sale = ({ textVariant, price }) => (
  <>
    <Typography
      variant={textVariant}
      component="h3"
      color="textSecondary"
      style={{
        textDecoration: 'line-through',
        color: 'red',
        fontSize: '0.9rem',
      }}
    >
      R$
      {' '}
      {price.original}
    </Typography>

    <Typography
      variant={textVariant}
      component="h3"
      // color="textSecondary"
      style={{
        fontWeight: '400',
      }}
    >
      R$
      {' '}
      {price.sale}
    </Typography>
  </>
);

const DisplayPrice = ({ textVariant, price }) => (
  price.sale ? (
    <Sale textVariant={textVariant} price={price} />
  ) : (
    <Original textVariant={textVariant} price={price} />
  )
);

export default DisplayPrice;
