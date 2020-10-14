import Router, { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
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

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import authApi from '../../../../src/services/api/authApi';
import useAuthUser from '../../../../src/hooks/useAuthUser';

const useStyles = makeStyles(() => ({
  body: {
    margin: '4.5rem 0 2rem 0',
  },
  card: {
    // border: '1px solid #888888',
    // boxShadow: '0 8px 6px -6px #cacaca',
    padding: '0.6rem',
    margin: '0 0 0.6rem 0',
  },
}));

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

export default function Registration({ bid }) {
  const [cep, setCep] = useState('');
  const [cepError, setCepError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { isUser, user, setUser } = useAuthUser();
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [initialValues, setInitialValues] = useState({
    state: '',
    city: '',
    district: '',
    street: '',
    number: '',
    complement: '',
    razaoSocial: '',
    CNPJ: '',
    inscricaoMunicipal: '',
    inscricaoEstadual: '',
  });

  const { api } = authApi();
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
    const cepToGet = unMask(cep);

    setIsLoading(true);
    const myInterval = setInterval(() => {
    }, 100);

    const { promiseOrTimeout, timeoutId } = awaitPromiseForInstant(api('POST',
      'cart/consulta_cep',
      {
        cep: cepToGet,
      }), 25000);

    try {
      const res = await promiseOrTimeout;

      setInitialValues({
        ...editingBusiness.address,
        ...editingBusiness.companyDetaile,
        state: res.data.uf,
        city: res.data.localidade,
        district: res.data.bairro,
        street: res.data.logradouro,
      });
      setCep(cepToGet);
    } catch (error) {
      setInitialValues({
        state: '',
        city: '',
        district: '',
        street: '',
        number: '',
        complement: '',
        razaoSocial: '',
        CNPJ: '',
        inscricaoMunicipal: '',
        inscricaoEstadual: '',
        // ...editingBusiness.address,
        // ...editingBusiness.companyDetaile,
      });
      setCep(editingBusiness.address.CEP);
    } finally {
      clearInterval(myInterval);
      clearTimeout(timeoutId);
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    router.push(`/dashboard/manager?bid=${bid}`);
  };

  const handleSubmit = async (e) => {
    if (unMask(cep).length < 8) {
      setCepError(true);
      return;
    }
    const data = {
      country: 'Brasil',
      currency: 'BRL',
      segment: 'geral',
      address: {
        state: e.state,
        city: e.city,
        CEP: cep,
        street: e.street,
        number: e.number,
        district: e.district,
        complement: e.complement,
      },
      companyDetaile: {
        razaoSocial: e.razaoSocial,
        CNPJ: e.CNPJ,
        inscricaoMunicipal: e.inscricaoMunicipal,
        inscricaoEstadual: e.inscricaoEstadual,
      },
    };

    try {
      const result = await api('PATCH', `/business/${editingBusiness.businessName}/update/registration`, data);
      if (result.status === 200) {
        const userToUpdate = {
          ...user,
        };
        userToUpdate.business[bid] = result.data;
        setUser(userToUpdate);
        handleBack();
      }
    } catch (error) {
      if (error.message === 'Token expirado') {
        Router.replace('/login');
      } else {
        throw new Error(error);
      }
    }
  };

  useEffect(() => {
    const bToEdit = isUser && user.business[bid];
    bToEdit && setEditingBusiness(bToEdit);
  }, [isUser, user]);

  useEffect(() => {
    editingBusiness && setInitialValues({
      state: editingBusiness.address.state || '',
      city: editingBusiness.address.city || '',
      district: editingBusiness.address.district || '',
      street: editingBusiness.address.street || '',
      number: editingBusiness.address.number || '',
      complement: editingBusiness.address.complement || '',
      razaoSocial: editingBusiness.companyDetaile.razaoSocial || '',
      CNPJ: editingBusiness.companyDetaile.CNPJ || '',
      inscricaoMunicipal: editingBusiness.companyDetaile.inscricaoMunicipal || '',
      inscricaoEstadual: editingBusiness.companyDetaile.inscricaoEstadual || '',
    });
    editingBusiness && setCep(unMask(editingBusiness.address.CEP) || '');
  }, [editingBusiness]);

  useEffect(() => {
    setCepError(false);
    cep.length === 9 && getShippingOptions();
  }, [cep]);

  return (
    <div>
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Informações Cadastrais da Loja
          </Typography>
        </Toolbar>
      </AppBar>
      <Container disableGutters className={classes.body}>
        <Typography variant="h6" component="h2">Endereço da Loja</Typography>
        <Typography variant="subtitle2" component="p">O CEP será utilizado para calcular o frete!</Typography>

        <TextField label="CEP" color="secondary" value={cep} onChange={handleCep} fullWidth margin="normal" />
        {
            isLoading && <p>Buscando CEP</p>
          }
        {
            cepError && <p style={{ color: 'red', fontWeight: '600' }}>*O CEP é o brigatório</p>
          }
        <Formik
          validationSchema={
              object({
                state: string().required('Obrigatório').max(2, 'máximo 2 caracteres').min(2, 'mínimo 2 caracteres'),
                city: string().required('Obrigatório').max(20, 'máximo 20 caracteres').min(2, 'mínimo 2 caracteres'),
                district: string().required('Obrigatório').max(20, 'máximo 20 caracteres').min(2, 'mínimo 2 caracteres'),
                street: string().required('Obrigatório').max(100, 'máximo 100 caracteres').min(2, 'mínimo 2 caracteres'),
                number: number().required('Obrigatório').typeError('Utilize apenas números'),
                complement: string().max(100, 'máximo 100 caracteres'),
                razaoSocial: string().max(100, 'Máximo 100 Caracteres'),
                CNPJ: string().max(18, 'CNPJ inválido'),
                inscricaoMunicipal: string().max(50, 'Inscrição Municipal inválida'),
                inscricaoEstadual: string().max(50, 'Inscrição Estadual Inválida'),
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
                      color="secondary"
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
                      color="secondary"
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
                      color="secondary"
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
                    color="secondary"
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
                    color="secondary"
                    error={touched.number && errors.number}
                    helperText={(touched.number && errors.number) && errors.number}
                  />
                </Grid>
                <Grid item xs={9}>
                  <FormGroup>
                    <Field
                      name="complement"
                      as={TextField}
                      label="Complemento (se houver)"
                      color="secondary"
                      error={touched.complement && errors.complement}
                      helperText={(touched.complement && errors.complement) && errors.complement}
                    />
                  </FormGroup>
                </Grid>
              </Grid>

              <div style={{ margin: '2rem 0' }}>
                <Typography variant="h6" component="h2">Registro da Loja</Typography>
                <Typography variant="subtitle2" component="p">Opcional</Typography>
              </div>

              <Box marginBottom={2}>
                <FormGroup>
                  <Field
                    name="razaoSocial"
                    as={TextField}
                    label="Razão Social"
                    InputLabelProps={{ shrink: true }}
                    color="secondary"
                    error={touched.razaoSocial && errors.razaoSocial}
                    helperText={(touched.razaoSocial && errors.razaoSocial) && errors.razaoSocial}
                  />
                </FormGroup>
              </Box>

              <Box marginBottom={2}>
                <FormGroup>
                  <Field
                    name="CNPJ"
                    as={TextField}
                    label="CNPJ"
                    InputLabelProps={{ shrink: true }}
                    color="secondary"
                    error={touched.CNPJ && errors.CNPJ}
                    helperText={(touched.CNPJ && errors.CNPJ) && errors.CNPJ}
                  />
                </FormGroup>
              </Box>

              <Box marginBottom={2}>
                <FormGroup>
                  <Field
                    name="inscricaoMunicipal"
                    as={TextField}
                    label="inscricaoMunicipal"
                    InputLabelProps={{ shrink: true }}
                    color="secondary"
                    error={touched.inscricaoMunicipal && errors.inscricaoMunicipal}
                    helperText={(touched.inscricaoMunicipal
                      && errors.inscricaoMunicipal) && errors.inscricaoMunicipal}
                  />
                </FormGroup>
              </Box>

              <Box marginBottom={2}>
                <FormGroup>
                  <Field
                    name="inscricaoEstadual"
                    as={TextField}
                    label="inscricaoEstadual"
                    InputLabelProps={{ shrink: true }}
                    color="secondary"
                    error={touched.inscricaoEstadual && errors.inscricaoEstadual}
                    helperText={(touched.inscricaoEstadual
                      && errors.inscricaoEstadual) && errors.inscricaoEstadual}
                  />
                </FormGroup>
              </Box>

              <Box justifyItems="center" justifyContent="center" m={4}>
                <FormGroup>
                  <Button type="submit" variant="contained" color="secondary">Salvar Alterações</Button>
                </FormGroup>

              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
}
