import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { object, string } from 'yup';
import {
  TextField, Button, Container, Typography, Box, FormGroup, CircularProgress,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import api from '../../../src/services/api';
import NavVarDashBoard from '../../NavBarDashBoard';

const useStyles = makeStyles(() => ({
  errorMessage: {
    color: 'red',
  },
}));
export default function UserSigin() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const classes = useStyles();

  const handleSubmit = async (values) => {
    setApiError(null);
    setLoading(true);
    try {
      const res = await api.post('/user/create', { data: values });
      if (res.status === 200) {
        setLoading(false);
        router.push('/login');
      }
    } catch (error) {
      setApiError({
        message: error.response.data.message,
      });
      setLoading(false);
    }
  };
  return (
    <div>
      <NavVarDashBoard backUrl="/" title="Criar Conta" />
      <Container>
        <Box m={2}>
          <FormGroup>
            <Typography component="p">
              Para criar uma loja, você deve criar uma conta de usuário.
            </Typography>

          </FormGroup>
        </Box>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
          }}
          validationSchema={object({
            username: string().required('Nome é obrigatório').max(30, 'Máximo 30 caractéres').min(2, 'Mínimo 2 caractéres'),
            email: string().email('Formato de email inválido').required('Email é obrigatório'),
            password: string().required('Senha é obrigatória').max(20, 'Máximo 20 caractéres').min(8, 'Mínimo 8 caractéres'),
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
                      label="Nome de Usuário Sem Espaço"
                      color="primary"
                      error={
                        (
                          touched.username && apiError !== null
                        ) || (
                          touched.username && errors.username
                        )
                      }
                      helperText={(touched.username && errors.username) && errors.username}
                    />
                  </FormGroup>
                </Box>
                <Box margin={2}>
                  <FormGroup>
                    <Field
                      name="email"
                      as={TextField}
                      label="Seu email"
                      color="primary"
                      helperText={(touched.email && errors.email) && errors.email}
                      error={
                        (
                          touched.email && apiError !== null
                        ) || (
                          touched.email && errors.email
                        )
                      }
                    />
                  </FormGroup>
                </Box>
                <Box margin={2}>
                  <FormGroup>
                    <Field
                      name="password"
                      as={TextField}
                      type="password"
                      label="Criar uma Senha"
                      color="primary"
                      error={touched.password && errors.password}
                      helperText={(touched.password && errors.password) && errors.password}
                    />
                  </FormGroup>
                </Box>
                <Box margin={2}>
                  <FormGroup>
                    {apiError && <p className={classes.errorMessage}>{apiError.message}</p>}
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <CircularProgress size={24} />}
                      {!isSubmitting && 'Criar Usuário'}
                    </Button>
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
