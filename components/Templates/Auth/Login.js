import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { object, string } from 'yup';
import {
  TextField, Button, Container, Typography, Box, FormGroup,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import api from '../../../src/services/api';
import { UserContext } from '../../../src/contexts/UserContext';
import { BusinessContext } from '../../../src/contexts/BusinessContext';

const useStyles = makeStyles(() => ({
  errorMessage: {
    color: 'red',
  },
}));
export default function UserLogin() {
  const { user, setUser } = useContext(UserContext);
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
      <Container>
        <Box m={2}>
          <FormGroup>
            <Typography variant="h4" component="h2">
              Entrar
            </Typography>
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
            username: string().required().max(30).min(2),
            password: string().required().max(20).min(8),
          })}
          onSubmit={(values) => handleSubmit(values)}
        >
          {
            ({ touched, isSubmitting }) => (
              <Form autoComplete="off">
                <Box margin={2}>
                  <FormGroup>
                    <Field
                      name="username"
                      as={TextField}
                      label="Username"
                      error={touched.username && apiError !== null}
                    />
                  </FormGroup>
                </Box>
                <Box margin={2}>
                  <FormGroup>
                    <Field name="password" as={TextField} type="password" label="Senha" />
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
                      Entrar
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
