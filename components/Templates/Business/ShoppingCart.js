import { useContext } from 'react';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import config from '../../../src/config';
import CustomHead from '../../CustomHead/CustomHead';
import NavBar from '../../NavBar/NavBar';
import { CartContext } from '../../../src/contexts/CartContext';

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
  },
  listItem: {
    padding: '4px 6px',
  },
  listContent: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 5,
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 0,
    marginLeft: 10,
  },
  productInfoContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyController: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDetail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cover: {
    width: 60,
    height: 90,
  },
  orderButtonContainer: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    backgroundColor: '#fff',
  },
  orderButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    width: '99%',
    height: 40,
    backgroundColor: '#000',
    color: '#fff',
    fontWeight: 400,
    border: 0,
    outlineStyle: 'none',
    textTransform: 'uppercase',
    fontSize: 'large',
  },
}));

export default function ShoppingCart() {
  const { cartProducts } = useContext(CartContext);
  const classes = useStyles();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('https://www.google.com');
  };
  return (
    <div>
      <NavBar backButton account={{ displayName: 'Checkout' }} />
      <Container className={classes.container} maxWidth="sm" disableGutters>
        <div className="list">
          {
            cartProducts.map((product) => (
              <List>
                <ListItem className={classes.listItem} disableGutters>
                  <Card className={classes.listContent}>
                    <CardMedia
                      className={classes.cover}
                      image={`${config.domain}/static/${product.imageGroup.images[0]}`}
                      title={product.name}
                    />
                    <div className={classes.productInfo}>
                      <div className={classes.productInfoContent}>
                        <div>
                          <ListItemText
                            primary={product.name}
                            secondary={`Cor: ${product.imageGroup.color.name} | Tamanho: ${product.vars.size}`}
                          />
                        </div>
                        <IconButton aria-label="Delete" edge="end">
                          <DeleteIcon />
                        </IconButton>
                      </div>

                      <div className={classes.productInfoContent}>
                        <div className={classes.qtyController}>
                          <IconButton aria-label="Remove" edge="start">
                            <RemoveIcon />
                          </IconButton>
                          <ListItemText primary="1" />
                          <IconButton aria-label="Add">
                            <AddIcon />
                          </IconButton>
                        </div>
                        <div>
                          <ListItemText primary={product.price.original} />
                        </div>
                      </div>

                    </div>

                  </Card>
                </ListItem>
              </List>
            ))
          }
        </div>
        <div className={classes.orderDetail}>
          <p>Subtotal</p>
          <p>R$ 49,00</p>
        </div>
        <div className={classes.orderDetail}>
          <input placeholder="Digite seu CEP" />
          <p>R$ 0,00</p>
        </div>
        <div className={classes.orderDetail}>
          <h2>Total a Pagar</h2>
          <p>R$ 49,00</p>
        </div>
        <div className={classes.orderButtonContainer}>
          <a
            className={classes.orderButton}
            rel="noreferrer"
            target="_blank"
            href="https://api.whatsapp.com/send?phone=5511984655006&text=%2ANovo%20pedido%20via%20website%3A%20Dazzlook%2A%0A%0A---%0A%0A%2AItens%2A%0A%2A1%20-%20Brinco%2A%20-%20R%24%C2%A099%2C00%0A%2ATotal%3A%2A%20R%24%C2%A099%2C00%0A%0A---%0A%0A%2ADados%20do%20comprador%2A%0ARafael%0A%0A---%0A%0APedido%20realizado%20em%2009%2F07%2F2020%20%C3%A0s%2010%3A29"
          >
            Enviar Pedido Via WhatsApp
          </a>
        </div>
      </Container>
    </div>
  );
}
