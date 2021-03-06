import Router, { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Button,
  FormGroup,
  Box,
  Container,
  CircularProgress,
} from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import authApi from '../../../../src/services/api/authApi';
import useAuthUser from '../../../../src/hooks/useAuthUser';
import NavBarDashBoard from '../../../NavBarDashBoard';

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
  const { isUser, user, setUser } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [shippingErr, setShippingErr] = useState(false);
  const [shipping, setShipping] = useState({
    correios: false,
    pickup: false,
  });

  const { api } = authApi();
  const router = useRouter();
  const classes = useStyles();

  const handleChange = (event) => {
    setShipping({
      ...shipping,
      [event.target.name]: event.target.checked,
    });
    setShippingErr(false);
  };

  const handleBack = () => {
    router.push(`/dashboard/manager?bid=${bid}`);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const isShippingError = !shipping.correios && !shipping.pickup;
    if (isShippingError) {
      setShippingErr(true);
      setLoading(false);
      return;
    }

    try {
      const result = await api('PATCH', `/business/${editingBusiness.businessName}/update/pickup`, {
        data: {
          pickup: {
            isActive: shipping.pickup,
          },
        },
      });

      if (result.status === 200) {
        const userToUpdate = {
          ...user,
        };
        userToUpdate.business[bid] = result.data;
        setUser(userToUpdate);
      }
    } catch (error) {
      setLoading(false);
      if (error.message === 'Token expirado') {
        Router.replace('/login');
      } else {
        throw new Error(error);
      }
    }

    try {
      const result = await api('PATCH', `/business/${editingBusiness.businessName}/update/shipping`, {
        data: {
          shipping: {
            thirdParty: {
              isActive: {
                correios: shipping.correios,
              },
            },
          },
        },
      });

      if (result.status === 200) {
        const userToUpdate = {
          ...user,
        };
        userToUpdate.business[bid] = result.data;
        setUser(userToUpdate);
      }
    } catch (error) {
      setLoading(false);
      if (error.message === 'Token expirado') {
        Router.replace('/login');
      } else {
        throw new Error(error);
      }
    }

    setLoading(false);
    handleBack();
  };

  useEffect(() => {
    const bToEdit = isUser && user.business[bid];
    bToEdit && setEditingBusiness(bToEdit);
  }, [isUser, user]);

  useEffect(() => {
    editingBusiness && setShipping({
      correios: editingBusiness.shipping.thirdParty
        ? editingBusiness.shipping.thirdParty.isActive.correios : false,
      pickup: editingBusiness.pickup ? editingBusiness.pickup.isActive : false,
    });
  }, [editingBusiness]);

  return (
    <div>
      <NavBarDashBoard backUrl={`/dashboard/manager?bid=${bid}`} title="Entrega e Retirada" />
      <Container disableGutters className={classes.body}>

        <Typography variant="h5" component="h5">Entrega</Typography>

        <Box marginBottom={2}>
          <FormControlLabel
            control={<Checkbox name="correios" color="primary" checked={shipping.correios} onChange={handleChange} />}
            label="Habilitar Entrega Via Correios"
          />
        </Box>

        <Typography variant="h5" component="h5">Retirada</Typography>

        <Box marginBottom={2}>
          <FormControlLabel
            control={<Checkbox name="pickup" color="primary" checked={shipping.pickup} onChange={handleChange} />}
            label="Cliente Poderá Retirar na Loja"
          />
        </Box>

        { shippingErr && <p style={{ color: 'red' }}>Selecione ao menos 1 opção</p>}

        <Box justifyItems="center" justifyContent="center">
          <FormGroup>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              disabled={loading}
            >
              {loading && <CircularProgress size={24} />}
              {!loading && 'Salvar Alterações'}
            </Button>
          </FormGroup>

        </Box>

      </Container>
    </div>
  );
}
