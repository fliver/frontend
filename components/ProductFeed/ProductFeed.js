import React, { useContext } from 'react';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { CartContext } from '../../src/contexts/CartContext';
import getProductMainImage from '../../src/utils/getProductMainImage';
import config from '../../src/config';

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    width: '49%',
    height: 'auto',

    title: {
      color: 'red',
    },
  },
  MuiCardHeader: {
    color: 'red',
  },
  media: {
    width: '100%',
    height: 'auto',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  cart: {
    marginLeft: 'auto',
  },
  cartIconHighLight: {
    color: 'orange',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const ProductFeed = ({ account, products }) => {
  const { addProduct, cartProducts } = useContext(CartContext);
  const classes = useStyles();

  const getPrice = (displayProduct) => {
    if (displayProduct.price.isSale) {
      return `de R$${displayProduct.price.original} por R$${displayProduct.price.final}`;
    }
    return `R$${displayProduct.price.original}`;
  };

  return (
    <div className={classes.root}>
      {products.length < 1 ? <h2> Nada encontrado </h2> : products.map((product) => (
        <Card key={product._id} className={classes.card}>
          <CardHeader
            title={(
              <Typography color="textPrimary" component="h2">
                {product.name}
              </Typography>
        )}
          />
          <Link href="/[home]/[urlSEO]/[productid]" as={`/${account.businessName}/nome-para-seo/${product._id}`}>
            <a>
              <CardMedia
                className={classes.media}
                component="img"
                image={`${config.domain}/static/${getProductMainImage(product)}`}
                title={product.name}
              />
            </a>
          </Link>

          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {getPrice(product)}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              aria-label="add to cart"
              className={
                `${classes.cart} ${cartProducts.find(
                  (cartProduct) => cartProduct._id === product._id,
                ) && classes.cartIconHighLight}
                  `
                }
              onClick={() => addProduct(product)}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};

export default ProductFeed;
