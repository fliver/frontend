import Router, { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import {
  Formik, Form, Field,
} from 'formik';
// import { mask, unMask } from 'remask';
import {
  object, string, number, boolean,
} from 'yup';

import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Button,
  TextField,
  FormGroup,
  Box,
  Container,
  Card,
} from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import CustomCheckbox from '../../../CustomCheckbox';
import useAuthUser from '../../../../src/hooks/useAuthUser';
import authApi from '../../../../src/services/api/authApi';

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

export default function Basic({ bid }) {
  const router = useRouter();
  const { isUser, user, setUser } = useAuthUser();
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [initialValues, setInitialValues] = useState({
    businessName: '',
    displayName: '',
    about: '',
    supportEmail: '',
    whatsapp: '',
    isWhatsappCheckout: false,
    waVerified: false,
  });

  const { api } = authApi();

  const classes = useStyles();

  useEffect(() => {
    const bToEdit = isUser && user.business[bid];
    bToEdit && setEditingBusiness(bToEdit);
  }, [isUser, user]);

  useEffect(() => {
    editingBusiness && setInitialValues({
      businessName: editingBusiness.businessName,
      displayName: editingBusiness.displayName || '',
      about: editingBusiness.about || '',
      supportEmail: editingBusiness.supportEmail || '',
      whatsapp: editingBusiness.whatsapp || '',
      isWhatsappCheckout: editingBusiness.checkoutType.isWhatsappCheckout || false,
      waVerified: false,
    });
  }, [editingBusiness]);

  const handleBack = () => {
    router.push(`/dashboard/manager?bid=${bid}`);
  };

  const handleSubmit = async (e) => {
    const whatsappNumber = e.whatsapp.split(' ').join('').trim();
    const data = {
      businessName: editingBusiness.businessName, // do not update businessName
      displayName: e.displayName,
      about: e.about,
      supportEmail: e.supportEmail,
      whatsapp: whatsappNumber,
      supportPhone: '',
      checkoutType: {
        isWhatsappCheckout: e.isWhatsappCheckout,
        isEmailCheckout: false,
        onlinePayment: false,
      },
    };

    try {
      const result = await api('PATCH', `/business/${editingBusiness.businessName}/update/basic`, data);
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

  return (
    <div>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Informações Gerais
          </Typography>
        </Toolbar>
      </AppBar>
      <Container disableGutters className={classes.body}>
        <Formik
          validationSchema={
              object({
                businessName: string().required('Obrigatório').max(20, 'máximo 20 caracteres').min(2, 'mínimo 2 caracteres'),
                displayName: string().required('Obrigatório').max(350, 'máximo 350 caracteres').min(2, 'mínimo 2 caracteres'),
                about: string().max(350, 'máximo 350 caracteres'),
                supportEmail: string().email(),
                whatsapp: number().required('Obrigatório').typeError('Use apenas números').test('len', 'mínimo de 10 números', (val) => val && val.toString().length >= 10),
                isWhatsappCheckout: boolean('Obrigatório').oneOf([true]),
                waVerified: boolean('Obrigatório').oneOf([true]),
              })
            }
          enableReinitialize
          initialValues={initialValues}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({
            errors, touched, values, isSubmitting,
          }) => (
            <Form autoComplete="off">

              <Card className={classes.card}>
                <FormGroup>
                  <Field
                    name="businessName"
                    as={TextField}
                    disabled
                    label="Endereço do Site da Loja Não é Editável"
                    InputLabelProps={{ shrink: true }}
                    color="secondary"
                    error={touched.businessName && errors.businessName}
                    helperText={(touched.businessName && errors.businessName) ? errors.businessName : `www.fliver.app/${values.businessName}`}
                  />
                </FormGroup>
              </Card>

              <Card className={classes.card}>
                <FormGroup>
                  <Field
                    name="displayName"
                    as={TextField}
                    label="Nome da Loja"
                    InputLabelProps={{ shrink: true }}
                    color="secondary"
                    error={touched.displayName && errors.displayName}
                    helperText={(touched.displayName && errors.displayName) ? errors.displayName : 'Ex.: Dazzlook - Moda e Acessórios'}
                  />
                </FormGroup>
              </Card>

              <Card className={classes.card}>
                <FormGroup>
                  <Field
                    name="about"
                    as={TextField}
                    label="Sobre a Loja (Bio)"
                    InputLabelProps={{ shrink: true }}
                    color="secondary"
                    multiline
                    rows={4}
                    rowsMax={4}
                    error={touched.about && errors.about}
                    helperText={(touched.about && errors.about) ? errors.about : 'Um pequeno texto sobre a sua loja'}
                  />
                </FormGroup>
              </Card>

              <Card className={classes.card}>
                <FormGroup>
                  <Field
                    name="supportEmail"
                    as={TextField}
                    label="Email para contato interno"
                    InputLabelProps={{ shrink: true }}
                    color="secondary"
                    error={touched.supportEmail && errors.supportEmail}
                    helperText={(touched.supportEmail && errors.supportEmail) ? errors.supportEmail : 'Este email não ficará visível ao público'}
                  />
                </FormGroup>
              </Card>

              <Card className={classes.card}>
                <FormGroup>
                  <Field
                    name="whatsapp"
                    as={TextField}
                    label="Whatsapp com DDD. Ex: 11984655006"
                    InputLabelProps={{ shrink: true }}
                    color="secondary"
                    error={touched.whatsapp && errors.whatsapp}
                    helperText={(touched.whatsapp && errors.whatsapp) ? errors.whatsapp : 'Você receberá os pedidos direto em seu Whatsapp'}
                  />
                  <p>
                    Clique abaixo para verificar o Whatsapp informado.
                    Caso esteja tudo certo, seu Whatsapp irá abrir
                    com a mensagem `Whatsapp inserido corretamente`
                  </p>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={`https://api.whatsapp.com/send?phone=55${values.whatsapp}&text=WhatsApp+inserido+corretamente`}
                  >
                    Clique aqui para testar o número do WhatsApp informado acima
                  </a>

                </FormGroup>

              </Card>

              <Box marginBottom={2}>
                <CustomCheckbox
                  name="waVerified"
                  label="Eu verifiquei o número de Whatsapp"
                />
                {(touched.waVerified
                  && errors.waVerified)
                  && (
                  <p>
                    *Você deve verificar o seu número de whatsapp.
                  </p>
                  )}
                <CustomCheckbox
                  name="isWhatsappCheckout"
                  label="Receber pedidos via Whatsapp"
                />
                {(touched.isWhatsappCheckout
                  && errors.isWhatsappCheckout)
                  && (
                  <p>
                    *Receber pedidos via Whtsapp é obrigatório,
                    pois é o único formato de checkout neste momento.
                  </p>
                  )}
              </Box>

              <Box justifyItems="center" justifyContent="center">
                <FormGroup>
                  <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>Salvar Alterações</Button>
                </FormGroup>

              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
}
