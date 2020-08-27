/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect, useContext } from 'react';
import { mask as masker, unMask } from 'remask';

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
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditLocationIcon from '@material-ui/icons/EditLocation';

// import CustomHead from '../../CustomHead/CustomHead';
import FullScreenDialog from '../../FullScreenDialog';
import NavBar from '../../NavBar/NavBar';
import Input from '../../Input/Input';

import config from '../../../src/config';
import { CartContext } from '../../../src/contexts/CartContext';
import api from '../../../src/services/api';

const useStyles = makeStyles((theme) => ({
  linearloading: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  container: {
    height: '100vh',
    marginBottom: '4rem',
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
  address: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: '0 20px',
    border: '1px solid #cacaca',
    lineHeight: '0.5rem',
    width: '80%',
    fontSize: '0.8rem',
    '& div p:first-child': {
      fontWeight: '700',
      fontSize: '0.9rem',
    },
  },
}));

export default function ShoppingCart() {
  const { cartProducts, addUnit, removeUnit, removeProduct } = useContext(CartContext);
  const classes = useStyles();

  const [cep, setCep] = useState('');
  const [selectedShipping, setSelectedShipping] = useState({ type: null });
  const [shippingOptions, setShippingOptions] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSetShipping = async ({ shipping, user }) => {
    setShippingOptions(shipping);
    setUser(user);
    console.log(user);
    setSelectedShipping({ type: null });
  };

  const handleInputChance = (e) => {
    setCep(masker(unMask(e.target.value), ['99999-999']));
  };

  const handleRadioChange = (option) => {
    // const idx = Number(e.target.value);
    // setSelectedShipping(idx);
    setSelectedShipping(option);
  };

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <NavBar backButton account={{ displayName: 'Checkout' }} />
      <Container className={classes.container} maxWidth="sm" disableGutters>
        <div className="list">
          {
            cartProducts.map((product, idx) => (
              <div key={product.vars.id}>
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
                          <IconButton aria-label="Delete" edge="end" onClick={() => removeProduct(product.vars.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </div>

                        <div className={classes.productInfoContent}>
                          <div className={classes.qtyController}>
                            <IconButton aria-label="Remove" edge="start" onClick={() => removeUnit(idx, product.vars.id)}>
                              <RemoveIcon />
                            </IconButton>
                            <ListItemText primary={product.quantity} />
                            <IconButton aria-label="Add" onClick={() => addUnit(idx)}>
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
              </div>
            ))
          }
        </div>
        <div className={classes.orderDetail}>
          <h3>Subtotal</h3>
          <p>R$ 49,00</p>
        </div>
        <div className={classes.orderDetail}>
          <h3>Taxa de Entrega</h3>
          {
              loading ? <CircularProgress color="secondary" /> : (
                <p>
                  {!selectedShipping.type && '---'}
                  {selectedShipping.type && `R$ ${selectedShipping.Valor}`}
                </p>
              )
            }
        </div>
        <div className={classes.orderDetail}>
          {
            !user ? (
              <div className={classes.address} onClick={handleClickOpen}>
                <div>
                  <p>Adicione um Endereço</p>
                  <p>Calcule o frete</p>
                </div>
                <div>
                  <IconButton color="secondary">
                    <EditLocationIcon />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className={classes.address} onClick={handleClickOpen}>
                <div>
                  <p>{`${user.firstname} ${user.lastname}`}</p>
                  <p>{`${user.street}, ${user.number}, ${user.complement}`}</p>
                  <p>{`CEP: ${user.cep} - ${user.state}, ${user.city}`}</p>
                </div>
                <div>
                  <IconButton color="secondary">
                    <EditLocationIcon />
                  </IconButton>
                </div>
              </div>
            )
          }
        </div>
        <div className={classes.orderDetail}>
          <div>
            {
              shippingOptions && (
                <>
                  <p>Escolha Forma de Entrega:</p>
                  <div>
                    {shippingOptions.types.map(
                      (option) => (
                        <FormControlLabel
                          label={`R$ ${option.Valor} - ${option.type}: ${option.PrazoEntrega} dias úteis`}
                          control={(
                            <Radio
                              checked={selectedShipping.type === option.type}
                              onChange={() => handleRadioChange(option)}
                              value={option.type}
                              name="radio-button-demo"
                              inputProps={{ 'aria-label': 'A' }}
                            />
                    )}
                        />
                      ),
                    )}
                  </div>
                </>
              )
                }

          </div>
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
        <FullScreenDialog
          isOpen={isOpen}
          handleClose={handleClose}
          handleSetShipping={handleSetShipping}
        />
      </Container>

    </div>
  );
}
