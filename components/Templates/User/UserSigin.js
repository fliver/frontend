import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { object, string } from 'yup';
import {
  TextField, Button, Container, Typography, Box, FormGroup,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import api from '../../../src/services/api';

const useStyles = makeStyles(() => ({
  errorMessage: {
    color: 'red',
  },
}));
export default function UserSigin() {
  const [apiError, setApiError] = useState(null);
  const router = useRouter();

  const classes = useStyles();

  const handleSubmit = async (values) => {
    setApiError(null);
    try {
      const res = await api.post('/user/create', { data: values });
      if (res.status === 200) {
        router.push('/login');
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
              Criar Conta
            </Typography>
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
            username: string().required().max(30).min(2),
            email: string().email().required(),
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
                      label="Username sem espaço"
                      color="secondary"
                      error={touched.username && apiError !== null}
                    />
                  </FormGroup>
                </Box>
                <Box margin={2}>
                  <FormGroup>
                    <Field 
                      name="email"
                      as={TextField}
                      label="Seu email"
                      color="secondary"
                      error={touched.email && apiError !== null}
                    />
                  </FormGroup>
                </Box>
                <Box margin={2}>
                  <FormGroup>
                    <Field name="password" as={TextField} type="password" label="Criar uma Senha" color="secondary" />
                  </FormGroup>
                </Box>
                <Box margin={2}>
                  <FormGroup>
                    <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>Criar Usuário</Button>
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
