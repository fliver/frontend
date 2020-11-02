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
import { Typography } from '@material-ui/core';
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
    position: 'relative',
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

export default function ShoppingCart({ currentBusinessSlug }) {
  const {
    cartProducts, addUnit, removeUnit, removeProduct, subTotal, priceBasedOnUnits,
  } = useContext(CartContext);
  const { user, setUser } = useContext(UserContext);
  const { business } = useContext(BusinessContext);
  const [currentBusiness, setCurrentBusiness] = useState();
  const [currentCart, setCurrentCart] = useState();

  const [total, setTotal] = useState(0);
  const [selectedShipping, setSelectedShipping] = useState({ type: null });
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  const getCartIdx = () => {
    const idx = user.carts
      ? user.carts.findIndex((item) => item.business === currentBusinessSlug) : 0;

    if (idx === -1) {
      const updatedCarts = [...user.carts, {
        business: currentBusinessSlug,
        shipping: [{ status: false }],
      }];

      setUser({
        ...user,
        carts: updatedCarts,
      });
      return updatedCarts.length;
    }

    return idx;
  };

  const cartIdx = getCartIdx();

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
    const whatsapp = currentBusiness ? currentBusiness.account.whatsapp : '';
    const businessName = currentBusiness ? currentBusiness.account.businessName : '';
    const productsOrder = currentCart.products.map((product) => `%2A-+C%C3%B3digo+do+produto%3A%2A+${product.vars.id}%0D%0A%2A-+Produto%3A%2A+${product.name}%0D%0A%2A-+Quantidade%3A%2A+${product.quantity}%0D%0A%2A-+Cor%3A%2A+${product.imageGroup.color.name}%0D%0A%2A-+Tamanho%3A%2A+${product.vars.size}%0D%0A%2A-+Pre%C3%A7o%3A%2A+${product.price.sale || product.price.original}%0D%0A%0D%0A`);

    const urlProducts = ''.concat(...productsOrder);

    const [month, date, year] = (new Date()).toLocaleDateString().split('/');
    const [hour, minute] = (new Date()).toLocaleTimeString().slice(0, 7).split(':');
    const orderDate = `${date}%2F${month}%2F${year} - ${hour}%3A${minute}`;

    const shippingOrPickUpURL = selectedShipping.type === 'retirada' ? '' : `%0D%0A%0D%0A%2AEntrega%3A%2A%0D%0A%2A-+Entrega+via%3A%2A+${selectedShipping.type ? 'Correios' : 'a combinar'}%0D%0A%2A-+Tipo+de+entrega%3A%2A+${selectedShipping.type ? selectedShipping.type : 'a combinar'}%0D%0A%2A-+Prazo+estimado%3A%2A+${selectedShipping.type ? selectedShipping.PrazoEntrega : 'a combinar'}+dias%0D%0A%2A-+Taxa%3A%2A+R%24+${selectedShipping.type ? selectedShipping.Valor : 'a combinar'}`;

    const userOrBusinessAddressURL = () => {
      const url = selectedShipping.type === 'retirada' ? `%0D%0A%0D%0A%2A-+Retirar+Na+Loja%2A%0D%0A%0D%0A%2ADados+e+Endere%C3%A7o+da+loja+para+retirada%3A%2A%0D%0A%2A-+Rua%3A%2A+${currentBusiness.account.address.street}%0D%0A%2A-+N%C3%BAmero%3A%2A+${currentBusiness.account.address.number}%0D%0A%2A-+Complemento%3A%2A+${currentBusiness.account.address.complement}%0D%0A%2A-+Bairro%3A%2A+${currentBusiness.account.address.district}%0D%0A%2A-+Cidade%3A%2A+${currentBusiness.account.address.city}%0D%0A%2A-+Estado%3A%2A+${currentBusiness.account.address.state}%0D%0A%2A-+CEP%3A%2A+${currentBusiness.account.address.CEP}` : `%0D%0A%0D%0A%2ADados+e+Endere%C3%A7o+do+comprador%3A%2A%0D%0A%2A-+Nome+completo%3A%2A+${user.firstname}+${user.lastname}%0D%0A%2A-+Rua%3A%2A+${user.billingAddress.street}%0D%0A%2A-+N%C3%BAmero%3A%2A+${user.billingAddress.number}%0D%0A%2A-+Complemento%3A%2A+${user.billingAddress.complement}%0D%0A%2A-+Bairro%3A%2A+${user.billingAddress.district}%0D%0A%2A-+Cidade%3A%2A+${user.billingAddress.city}%0D%0A%2A-+Estado%3A%2A+${user.billingAddress.state}%0D%0A%2A-+CEP%3A%2A+${user.billingAddress.CEP}`;
      return url;
    };

    return isEmptyObject(user) ? '#' : `https://api.whatsapp.com/send?phone=55${whatsapp}&text=%2ANovo+pedido+via+website%3A%2A+${businessName}%0D%0A%0D%0A---%0D%0A%0D%0A%2ADetalhes+do+pedido%3A%2A%0D%0A${urlProducts}%2ASubtotal%3A%2A+R%24+${subTotal}${shippingOrPickUpURL}%0D%0A%0D%0A%2ATotal+a+pagar%3A%2A+R%24+${selectedShipping.type ? total : 'a combinar'}%0D%0A%0D%0A---${userOrBusinessAddressURL()}%0D%0A%0D%0A---%0D%0A%0D%0A%2A-+Prazo+de+devolu%C3%A7%C3%A3o%3A%2A+7+dias+%C3%BAteis.%0D%0A%0D%0A%2A-+Pedido+realizado+em%3A%2A+${orderDate}`;
  };

  useEffect(() => {
    selectedShipping.Valor
    && setTotal((subTotal + selectedShipping.Valor.replace(',', '.') * 1));
  }, [selectedShipping, subTotal]);

  useEffect(() => {
    const [businessToUse] = business.filter(
      (item) => item.account.businessName === currentBusinessSlug,
    );
    setCurrentBusiness(businessToUse);
  }, [business]);

  useEffect(() => {
    const [cartToUse] = cartProducts.filter(
      (item) => item.business === currentBusinessSlug,
    );
    setCurrentCart(cartToUse);
  }, [cartProducts]);
  const ShippingContainer = () => (
    <Container className={classes.container} maxWidth="sm" disableGutters>
      <div className="list">
        {
            currentCart && (
              currentCart.products.map((product, idx) => (
                <div key={product.vars.id}>
                  <List>
                    <ListItem className={classes.listItem} disableGutters>
                      <Card className={classes.listContent}>
                        <CardMedia
                          className={classes.cover}
                          image={`${config.mediaURL}/${product.imageGroup.images[0]}`}
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
                            <IconButton aria-label="Delete" edge="end" onClick={() => removeProduct({ varsId: product.vars.id, businessSlug: currentBusiness.account.businessName })}>
                              <DeleteIcon />
                            </IconButton>
                          </div>

                          <div className={classes.productInfoContent}>
                            <div className={classes.qtyController}>
                              <IconButton aria-label="Remove" edge="start" onClick={() => removeUnit({ productIdx: idx, varsId: product.vars.id, businessSlug: currentBusiness.account.businessName })}>
                                <RemoveIcon />
                              </IconButton>
                              <ListItemText primary={product.quantity} />
                              <IconButton aria-label="Add" onClick={() => addUnit({ productIdx: idx, businessSlug: currentBusiness.account.businessName })}>
                                <AddIcon />
                              </IconButton>
                            </div>
                            <div>
                              <ListItemText
                                primary={
                                  `R$ ${priceBasedOnUnits(
                                    product.quantity, product.price.sale || product.price.original,
                                  ).toFixed(2)}`
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </ListItem>
                  </List>
                </div>
              ))
            )
          }
      </div>
      <div className={classes.orderDetail}>
        <Typography variant="h6" component="h6">
          Subtotal
        </Typography>
        {/* <h3>Subtotal</h3> */}
        <p>
          R$
          {' '}
          {subTotal.toFixed(2)}
        </p>
      </div>
      <div className={classes.orderDetail}>
        <Typography variant="h6" component="h6">
          Taxa de Entrega
        </Typography>
        <p>
          {!selectedShipping.type && isEmptyObject(user) && '---'}
          {!isEmptyObject(user) && !user.carts[cartIdx].shipping.status && 'a combinar'}
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
                  <IconButton color="primary">
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
                  <IconButton color="primary">
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
              !isEmptyObject(user) && user.carts[cartIdx].shipping.status && (
                <>
                  {
                    currentBusiness.account.pickup.isActive && (
                      <>
                        <Typography variant="h6" component="h6">
                          Escolha Forma de Entrega:
                        </Typography>
                        {/* <p>Escolha Forma de Entrega:</p> */}
                        <FormControlLabel
                          label="Retirar na loja"
                          control={(
                            <Radio
                              color="primary"
                              checked={selectedShipping.type === 'retirada'}
                              onChange={() => handleRadioChange({ Codigo: 1, type: 'retirada', Valor: '0,00' })}
                              value="Retirar na Loja"
                              name="shippingmethod"
                              inputProps={{ 'aria-label': 'A' }}
                            />
                    )}
                        />
                        { selectedShipping.type === 'retirada' && (
                        <div className={classes.address}>
                          <div>
                            <p>{`${currentBusiness.account.address.street}, ${currentBusiness.account.address.number}, ${currentBusiness.account.address.complement}`}</p>
                            <p>{`CEP: ${currentBusiness.account.address.CEP} - ${currentBusiness.account.address.state}, ${currentBusiness.account.address.city}`}</p>
                          </div>
                        </div>
                        ) }
                      </>
                    )
                  }
                  {
                  currentBusiness.account.shipping.thirdParty.isActive.correios && (
                    <div>
                      {user.carts[cartIdx].shipping.types.map(
                        (option) => (
                          <FormControlLabel
                            label={`R$ ${option.Valor} - ${option.type}: ${option.PrazoEntrega} dias úteis`}
                            control={(
                              <Radio
                                color="primary"
                                checked={selectedShipping.type === option.type}
                                onChange={() => handleRadioChange(option)}
                                value={option.type}
                                name="shippingmethod"
                                inputProps={{ 'aria-label': 'A' }}
                              />
                    )}
                          />
                        ),
                      )}
                    </div>
                  )
                  }
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
                {' '}
                {total.toFixed(2)}
              </p>
            </>
          )
        }
        {
          !isEmptyObject(user) && !user.carts[cartIdx].shipping.status
          && (
          <p>
            Cálculo de frete indisponível.
            <br />
            Envie o pedido via Whatsapp para combinar o valor do frete.
          </p>
          )
        }
      </div>
      {
        currentBusiness && (
          <div className={classes.orderButtonContainer}>
            {
              selectedShipping.type ? (
                <a
                  className={classes.orderButton}
                  rel="noreferrer"
                  target="_blank"
                  href={handleWhatsAppOrder()}
                >
                  Enviar Pedido Via WhatsApp
                </a>
              ) : (
                <p className={classes.orderButton}>
                  Escolha Forma de Entrega
                </p>
              )
            }
          </div>
        )
      }
      <FullScreenDialog
        isOpen={isOpen}
        handleClose={handleClose}
        setSelectedShipping={setSelectedShipping}
        currentBusiness={currentBusiness}
      />
    </Container>
  );

  return (
    <div>
      {/* {currentBusiness && <NavBar backButton account={{ displayName: 'Checkout', businessName: currentBusinessSlug }} />} */}
      <NavBar backButton account={{ displayName: 'Checkout', businessName: currentBusinessSlug }} />
      {currentCart && currentCart.products.length > 0 ? <ShippingContainer /> : (
        <h2>Nenhum produto adicionado</h2>
      ) }
    </div>
  );
}
