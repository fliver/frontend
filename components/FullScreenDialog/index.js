import React, { useState, useEffect, useContext } from 'react';
import {
  Formik, Form, Field, useField,
} from 'formik';
import { mask, unMask } from 'remask';
import {
  object, string, number, boolean,
} from 'yup';

import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  TextField,
  FormGroup,
  Box,
  Grid,
  Container,
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import api from '../../src/services/api';

import CustomCheckbox from '../CustomCheckbox';

import { UserContext } from '../../src/contexts/UserContext';
import { BusinessContext } from '../../src/contexts/BusinessContext';

import isEmptyObject from '../../src/utils/isEmptyObject';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export function CepField(props) {
  const [field] = useField({
    name: props.name,
    onChange: props.handleChange,
    value: props.value,
  });

  return (
    <TextField {...field} {...props} />
  );
}

export default function FullScreenDialog({
  isOpen, handleClose, setSelectedShipping, currentBusiness,
}) {
  const { user, setUser } = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [cep, setCep] = useState('');
  const [shipping, setShipping] = useState(user.shipping);
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const classes = useStyles();

  const handleCep = (e) => {
    setCep(mask(unMask(e.target.value), ['99999-999']));
  };

  const awaitPromiseForInstant = (promise, instant) => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Request time out'));
      }, instant);
    });

    return {
      promiseOrTimeout: Promise.race([promise, timeoutPromise]),
      timeoutId,
    };
  };

  const getShippingOptions = async () => {
    if (!currentBusiness.account.shipping.thirdParty.isActive.correios) return false;
    const sCepOrigem = currentBusiness ? currentBusiness.account.address.CEP.split('-').join('') : '0';
    const sCepDestino = cep.split('-').join('');

    const {
      promiseOrTimeout: promiseShipping,
      timeoutId: timeoutShipping,
    } = awaitPromiseForInstant(api.post(
      '/cart/shipping_calculate',
      {
        sCepDestino,
        sCepOrigem,
      },
    ), 25000);

    try {
      const res = await promiseShipping;
      return res;
      // setShipping({
      //   ...res.data,
      //   status: res.data.types.length > 0,
      // });
    } catch (error) {
      return { status: false };
      // setShipping({ status: false });
    } finally {
      clearTimeout(timeoutShipping);
    }
  };

  const getUserAddress = async () => {
    const sCepDestino = cep.split('-').join('');

    setIsLoading(true);
    // get address
    const { promiseOrTimeout, timeoutId } = awaitPromiseForInstant(api.post(
      'cart/consulta_cep',
      {
        cep: sCepDestino,
      },
    ), 25000);

    try {
      const res = await promiseOrTimeout;

      setInitialValues({
        state: res.data.uf,
        city: res.data.localidade,
        district: res.data.bairro,
        street: res.data.logradouro,
        cep: sCepDestino,
        number: '',
        complement: '',
        country: '',
        terms: false,
        firstname: '',
        lastname: '',
      });
      setShipping({ status: false });
      setIsLoading(false);
    } catch (error) {
      setInitialValues({
        state: '',
        city: '',
        district: '',
        street: '',
        cep: sCepDestino,
        number: '',
        complement: '',
        country: '',
        terms: false,
        firstname: '',
        lastname: '',
      });
      setShipping({ status: false });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }

    // get pac and sedex while user is finishing form address
    const shippingOptions = await getShippingOptions();
    setShipping({
      ...shippingOptions.data,
      status: shippingOptions.status,
    });
  };

  const handleSubmit = async (values) => {
    const billingAddress = {
      state: values.state,
      city: values.city,
      district: values.district,
      street: values.street,
      CEP: unMask(cep),
      number: values.number,
      complement: values.complement,
    };
    const { firstname, lastname } = values;

    const notUpdatedCarts = user.carts
      ? user.carts.filter((item) => item.business !== currentBusiness.account.businessName) : [];

    const shippingRequest = async () => {
      const { data } = await getShippingOptions();
      return data;
    };

    const shippingOptions = shipping || await shippingRequest();
    const updatedCart = {
      business: currentBusiness.account.businessName,
      shipping: {
        ...shippingOptions,
        status: shippingOptions.status,
      },
    };

    setUser({
      firstname,
      lastname,
      billingAddress,
      carts: [...notUpdatedCarts, updatedCart],
    });
    setSelectedShipping({ type: null });
    handleClose();
  };

  useEffect(() => {
    !isEmptyObject(user) && (
      setInitialValues({
        ...user.billingAddress, firstname: user.firstname, lastname: user.lastname, terms: false,
      }),
      setCep(user.billingAddress.CEP)
    );
  }, [user]);

  useEffect(() => {
    cep.length === 9 && getUserAddress();
  }, [cep]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Endereço de Entrega
            </Typography>
            <Button color="inherit" onClick={handleClose}>
              Cancelar
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <TextField label="CEP" color="primary" value={cep} onChange={handleCep} fullWidth margin="normal" />
          {
            isLoading && <p>Buscando CEP</p>
          }
          {
            !isEmptyObject(initialValues)

          && (
          <Formik
            validationSchema={
              object({
                state: string().required('Obrigatório').max(2, 'máximo 2 caracteres').min(2, 'mínimo 2 caracteres'),
                city: string().required('Obrigatório').max(20, 'máximo 20 caracteres').min(2, 'mínimo 2 caracteres'),
                district: string().required('Obrigatório').max(60, 'máximo 60 caracteres').min(2, 'mínimo 2 caracteres'),
                street: string().required('Obrigatório').max(60, 'máximo 60 caracteres').min(2, 'mínimo 2 caracteres'),
                number: number().required('Obrigatório'),
                complement: string().max(100, 'máximo 100 caracteres'),
                terms: boolean('Obrigatório').oneOf([true]),
                firstname: string().required('Obrigatório').max(30, 'máximo 30 caracteres'),
                lastname: string().required('Obrigatório').max(30, 'máximo 30 caracteres'),
              })
            }
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ errors, touched }) => (
              <Form autoComplete="off">
                <Box marginBottom={2}>
                  <Grid container direction="row" justify="space-between" spacing={3}>
                    <Grid item xs={4}>
                      <Field
                        name="state"
                        as={TextField}
                        label="Estado"
                        color="primary"
                        InputLabelProps={{ shrink: true }}
                        error={touched.state && errors.state}
                        helperText={(touched.state && errors.state) && errors.state}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        name="city"
                        as={TextField}
                        label="Cidade"
                        InputLabelProps={{ shrink: true }}
                        color="primary"
                        error={touched.city && errors.city}
                        helperText={(touched.city && errors.city) && errors.city}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Field
                        name="district"
                        as={TextField}
                        label="Bairro"
                        InputLabelProps={{ shrink: true }}
                        color="primary"
                        error={touched.district && errors.district}
                        helperText={(touched.district && errors.district) && errors.district}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <Field
                      name="street"
                      as={TextField}
                      label="Nome da Rua / Av."
                      InputLabelProps={{ shrink: true }}
                      color="primary"
                      error={touched.street && errors.street}
                      helperText={(touched.street && errors.street) && errors.street}
                    />
                  </FormGroup>
                </Box>

                <Grid container direction="row" justify="space-between" spacing={3}>
                  <Grid item xs={3}>
                    <Field
                      name="number"
                      as={TextField}
                      label="Número"
                      id="standard-number"
                      type="number"
                      color="primary"
                      error={touched.number && errors.number}
                      helperText={(touched.number && errors.number) && errors.number}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <FormGroup>
                      <Field
                        name="complement"
                        as={TextField}
                        label="Aprto / Bloco"
                        color="primary"
                        error={touched.complement && errors.complement}
                        helperText={(touched.complement && errors.complement) && errors.complement}
                      />
                    </FormGroup>
                  </Grid>
                </Grid>

                <Box marginBottom={6}>
                  <Grid container direction="row" justify="space-between" spacing={3}>
                    <Grid item xs={6}>
                      <Field
                        name="firstname"
                        as={TextField}
                        label="Nome"
                        color="primary"
                        error={touched.firstname && errors.firstname}
                        helperText={(touched.firstname && errors.firstname) && errors.firstname}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        name="lastname"
                        as={TextField}
                        label="Sobrenome"
                        color="primary"
                        error={touched.lastname && errors.lastname}
                        helperText={(touched.lastname && errors.lastname) && errors.lastname}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box marginBottom={2}>
                  <CustomCheckbox
                    name="terms"
                    label="Eu Li e Aceito os Termos de Uso"
                  />
                  {(touched.terms && errors.terms) && <p>Termos de uso é obrigatório</p>}
                </Box>

                <Box justifyItems="center" justifyContent="center">
                  <FormGroup>
                    <Button type="submit" variant="contained" color="primary">Finalizar</Button>
                  </FormGroup>

                </Box>
              </Form>
            )}
          </Formik>
          )
          }
        </Container>

      </Dialog>
    </div>
  );
}
