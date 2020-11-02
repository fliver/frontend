import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { object, string } from 'yup';
import {
  TextField, Button, Container, Typography, Box, FormGroup, CircularProgress,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import api from '../../../src/services/api';
import { UserContext } from '../../../src/contexts/UserContext';
import { BusinessContext } from '../../../src/contexts/BusinessContext';
import useAuthUser from '../../../src/hooks/useAuthUser';
import NavVarDashBoard from '../../NavBarDashBoard';

const useStyles = makeStyles(() => ({
  errorMessage: {
    color: 'red',
  },
}));
export default function UserLogin() {
  // const { user, setUser } = useContext(UserContext);
  const { user, setUser } = useAuthUser();
  const [apiError, setApiError] = useState(null);
  const router = useRouter();

  const classes = useStyles();

  // const token = JSON.parse(localStorage.getItem('token'));

  const handleSubmit = async (values) => {
    setApiError(null);
    try {
      const res = await api.post('/session/login', { data: values });
      if (res.status === 200) {
        const apiUser = { ...res.data.user, token: res.data.token };

        setUser({
          ...user,
          ...apiUser,
          business: [],
        });

        localStorage.setItem('token', JSON.stringify(res.data.token));
        router.push('/dashboard');
      }
    } catch (error) {
      setApiError({
        message: error.response.data.message,
      });
    }
  };
  return (
    <div>
      <NavVarDashBoard backUrl="/" title="Entrar" />
      <Container>
        <Box m={2}>
          <FormGroup>
            <Typography component="p">
              Faça Login para Editar ou Criar uma Loja.
            </Typography>

          </FormGroup>
        </Box>
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={object({
            username: string().required('Nome de Usuário Obrigatório').max(30, 'Máximo 30 caractéres').min(2, 'Mínimo 2 caractéres'),
            password: string().required('Senha Obrigatória').max(20).min(8, 'Mínimo 8 caractéres'),
          })}
          onSubmit={(values) => handleSubmit(values)}
        >
          {
            ({ touched, errors, isSubmitting }) => (
              <Form autoComplete="off">
                <Box margin={2}>
                  <FormGroup>
                    <Field
                      name="username"
                      as={TextField}
                      label="Seu Nome de Usuário (sem espaço)"
                      error={(
                        touched.username && apiError !== null)
                        || (touched.username && errors.username)}
                      helperText={touched.username && errors.username}
                    />
                  </FormGroup>
                </Box>
                <Box margin={2}>
                  <FormGroup>
                    <Field
                      name="password"
                      as={TextField}
                      type="password"
                      label="Senha"
                      error={touched.password && errors.password}
                      helperText={touched.password && errors.password}
                    />
                  </FormGroup>
                </Box>
                <Box margin={2}>
                  <FormGroup>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <CircularProgress size={24} />}
                      {!isSubmitting && 'Entrar'}
                    </Button>
                    {apiError && <p className={classes.errorMessage}>{apiError.message}</p>}
                  </FormGroup>
                </Box>
              </Form>
            )
          }
        </Formik>

      </Container>
    </div>
  );
}
