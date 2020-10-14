/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useContext, useEffect } from 'react';

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
import EditLocationIcon from '@material-ui/icons/EditLocation';

// import CustomHead from '../../CustomHead/CustomHead';
import FullScreenDialog from '../../FullScreenDialog';
import NavBar from '../../NavBar/NavBar';

import config from '../../../src/config';

import isEmptyObject from '../../../src/utils/isEmptyObject';

import { CartContext } from '../../../src/contexts/CartContext';
import { UserContext } from '../../../src/contexts/UserContext';
import { BusinessContext } from '../../../src/contexts/BusinessContext';

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
    width: '100%',
    maxWidth: '800px',
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
    margin: '0.5rem 0.7rem',
  },
  divider: {
    flex: 1,
    borderBottom: '1px solid #cacaca',
  },
  cover: {
    width: 60,
    height: 90,
  },
  orderButtonContainer: {
    position: 'fixed',
    width: 'inherit',
    maxWidth: 'inherit',
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
    lineHeight: '1rem',
    width: '80%',
    fontSize: '0.8rem',
    '& div p:first-child': {
      fontWeight: '700',
      fontSize: '0.9rem',
    },
    '& div': {
      padding: '0.6rem 0',
    },
    '& div p': {
      margin: '0.4rem auto',
    },
  },
}));

export default function ShoppingCart() {
  const {
    cartProducts, addUnit, removeUnit, removeProduct, subTotal, priceBasedOnUnits,
  } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const { business } = useContext(BusinessContext);

  const [total, setTotal] = useState(0);
  const [selectedShipping, setSelectedShipping] = useState({ type: null });
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  const handleRadioChange = (option) => {
    setSelectedShipping(option);
  };

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleWhatsAppOrder = () => {
    const whatsapp = !isEmptyObject(business) ? business.account.whatsapp : '';
    const businessName = !isEmptyObject(business) ? business.account.businessName : '';
    const productsOrder = cartProducts.map((product) => `%2A-+C%C3%B3digo+do+produto%3A%2A+${product.vars.id}%0D%0A%2A-+Produto%3A%2A+${product.name}%0D%0A%2A-+Quantidade%3A%2A+${product.quantity}%0D%0A%2A-+Cor%3A%2A+${product.imageGroup.color.name}%0D%0A%2A-+Tamanho%3A%2A+${product.vars.size}%0D%0A%2A-+Pre%C3%A7o%3A%2A+${product.price.original}%0D%0A%0D%0A`);

    const urlProducts = ''.concat(...productsOrder);

    const [month, date, year] = (new Date()).toLocaleDateString().split('/');
    const [hour, minute] = (new Date()).toLocaleTimeString().slice(0, 7).split(':');
    const orderDate = `${date}%2F${month}%2F${year} - ${hour}%3A${minute}`;

    return isEmptyObject(user) ? '#' : `https://api.whatsapp.com/send?phone=${whatsapp}&text=%2ANovo+pedido+via+website%3A%2A+${businessName}%0D%0A%0D%0A---%0D%0A%0D%0A%2ADetalhes+do+pedido%3A%2A%0D%0A${urlProducts}%2ASubtotal%3A%2A+R%24+${subTotal}%0D%0A%0D%0A%2AEntrega%3A%2A%0D%0A%2A-+Entrega+via%3A%2A+${selectedShipping.type ? 'Correios' : 'a combinar'}%0D%0A%2A-+Tipo+de+entrega%3A%2A+${selectedShipping.type ? selectedShipping.type : 'a combinar'}%0D%0A%2A-+Prazo+estimado%3A%2A+${selectedShipping.type ? selectedShipping.PrazoEntrega : 'a combinar'}+dias%0D%0A%2A-+Taxa%3A%2A+R%24+${selectedShipping.type ? selectedShipping.Valor : 'a combinar'}%0D%0A%0D%0A%2ATotal+a+pagar%3A%2A+R%24+${selectedShipping.type ? total : 'a combinar'}%0D%0A%0D%0A---%0D%0A%0D%0A%2ADados+e+Endere%C3%A7o+do+comprador%3A%2A%0D%0A%2A-+Nome+completo%3A%2A+${user.firstname}+${user.billingAddress.lastname}%0D%0A%2A-+Rua%3A%2A+${user.billingAddress.street}%0D%0A%2A-+N%C3%BAmero%3A%2A+${user.billingAddress.number}%0D%0A%2A-+Complemento%3A%2A+${user.billingAddress.complement}%0D%0A%2A-+Bairro%3A%2A+${user.billingAddress.district}%0D%0A%2A-+Cidade%3A%2A+${user.billingAddress.city}%0D%0A%2A-+Estado%3A%2A+${user.billingAddress.state}%0D%0A%2A-+CEP%3A%2A+${user.billingAddress.CEP}%0D%0A%0D%0A---%0D%0A%0D%0A%2A-+Prazo+de+devolu%C3%A7%C3%A3o%3A%2A+7+dias+%C3%BAteis.%0D%0A%0D%0A%2A-+Pedido+realizado+em%3A%2A+${orderDate}`;
  };

  useEffect(() => {
    selectedShipping.Valor
    && setTotal((subTotal + selectedShipping.Valor.replace(',', '.') * 1).toFixed(2));
  }, [selectedShipping, subTotal]);

  const ShippingContainer = () => (
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
                            <ListItemText
                              primary={priceBasedOnUnits(product.quantity, product.price.original)}
                            />
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
        <p>
          R$
          {subTotal}
        </p>
      </div>
      <div className={classes.orderDetail}>
        <h3>Taxa de Entrega</h3>
        <p>
          {!selectedShipping.type && isEmptyObject(user) && '---'}
          {!isEmptyObject(user) && !user.shipping.status && 'a combinar'}
          {selectedShipping.type && `R$ ${selectedShipping.Valor}`}
        </p>
      </div>
      <div className={classes.orderDetail}>
        {
            isEmptyObject(user) ? (
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
                  <p>{`${user.billingAddress.street}, ${user.billingAddress.number}, ${user.billingAddress.complement}`}</p>
                  <p>{`CEP: ${user.billingAddress.CEP} - ${user.billingAddress.state}, ${user.billingAddress.city}`}</p>
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
              !isEmptyObject(user) && user.shipping.status && (
                <>
                  <p>Escolha Forma de Entrega:</p>
                  <div>
                    {user.shipping.types.map(
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
        {
          selectedShipping.type && (
            <>
              <h2>Total a Pagar</h2>
              <p>
                R$
                {total}
              </p>
            </>
          )
        }
        {
          !isEmptyObject(user) && !user.shipping.status
          && (
          <p>
            Cálculo de frete indisponível.
            <br />
            Envie o pedido via Whatsapp para combinar o valor do frete.
          </p>
          )
        }
      </div>
      <div className={classes.orderButtonContainer}>
        <a
          className={classes.orderButton}
          rel="noreferrer"
          target="_blank"
          href={handleWhatsAppOrder()}
        >
          Enviar Pedido Via WhatsApp
        </a>
      </div>
      <FullScreenDialog
        isOpen={isOpen}
        handleClose={handleClose}
        setSelectedShipping={setSelectedShipping}
      />
    </Container>
  );

  return (
    <div>
      <NavBar backButton account={{ displayName: 'Checkout', businessName: business.account.businessName }} />
      {cartProducts.length > 0 ? <ShippingContainer /> : (
        <h2>Nenhum produto adicionado</h2>
      ) }
    </div>
  );
}
