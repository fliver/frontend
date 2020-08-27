import React, { useState, useEffect } from 'react';
import {
  Formik, Form, Field, useField,
} from 'formik';
import { mask, unMask } from 'remask';

import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Button,
  TextField,
  FormGroup,
  Box,
  Grid,
  Container,
  Checkbox,
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import api from '../../src/services/api';

import CustomCheckbox from '../CustomCheckbox';

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

export default function FullScreenDialog({ isOpen, handleClose, handleSetShipping }) {
  const [open, setOpen] = useState(false);
  const [cep, setCep] = useState('');
  const [shipping, setShipping] = useState(null);
  const [initialValues, setInitialValues] = useState({
    firstname: '',
    lastname: '',
    state: '',
    city: '',
    district: '',
    cep: '',
    street: '',
    number: null,
    complement: '',
    country: '',
    terms: false,
  });

  const classes = useStyles();

  const handleCep = (e) => {
    setCep(mask(unMask(e.target.value), ['99999-999']));
  };

  const getShippingOptions = async () => {
    const sCepDestino = cep.split('-').join('');
    const res = await api.post(
      '/cart/shipping_calculate',
      {
        sCepDestino,
        sCepOrigem: '04055110',
      },
    );
    // res.status === 200
    // &&
    setInitialValues({
      state: res.data.address.uf,
      city: res.data.address.localidade,
      district: res.data.address.bairro,
      street: res.data.address.logradouro,
      cep: sCepDestino,
    });
    setShipping(res.data);
  };

  const handleSubmit = (values) => {
    handleSetShipping({ shipping, user: values });
    handleClose();
  };

  useEffect(() => {
    cep.length === 9 && getShippingOptions();
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

          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ values }) => (
              <Form>
                <Box marginBottom={2} marginTop={2}>
                  <FormGroup>
                    <Field name="cep" as={TextField} label="CEP" color="secondary" value={cep} onChange={handleCep} />
                  </FormGroup>
                </Box>
                <Box marginBottom={2}>
                  <Grid container direction="row" justify="space-between" spacing={3}>
                    <Grid item xs={4}>
                      <Field name="state" as={TextField} label="Estado" color="Secondary" />
                    </Grid>
                    <Grid item xs={4}>
                      <Field name="city" as={TextField} label="Cidade" color="Secondary" />
                    </Grid>
                    <Grid item xs={4}>
                      <Field name="district" as={TextField} label="Bairro" color="Secondary" />
                    </Grid>
                  </Grid>
                </Box>

                <Box marginBottom={2}>
                  <FormGroup>
                    <Field name="street" as={TextField} label="Nome da Rua / Av." color="Secondary" />
                  </FormGroup>
                </Box>

                <Grid container direction="row" justify="space-between" spacing={3}>
                  <Grid item xs={3}>
                    <Field name="number" as={TextField} type="number" label="Número" color="Secondary" />
                  </Grid>
                  <Grid item xs={9}>
                    <FormGroup>
                      <Field name="complement" as={TextField} label="Aprto / Bloco" color="Secondary" />
                    </FormGroup>
                  </Grid>
                </Grid>

                <Box marginBottom={6}>
                  <Grid container direction="row" justify="space-between" spacing={3}>
                    <Grid item xs={6}>
                      <Field name="firstname" as={TextField} label="Nome" color="Secondary" />
                    </Grid>
                    <Grid item xs={6}>
                      <Field name="lastname" as={TextField} label="Sobrenome" color="Secondary" />
                    </Grid>
                  </Grid>
                </Box>

                <Box marginBottom={2}>
                  <CustomCheckbox name="terms" label="Eu Li e Aceito os Termos de Uso" />
                </Box>

                <Box justifyItems="center" justifyContent="center">
                  <FormGroup>
                    <Button type="submit" color="secondary">Finalizar</Button>
                  </FormGroup>

                </Box>
              </Form>
            )}
          </Formik>
        </Container>

      </Dialog>
    </div>
  );
}
