import { useEffect, useState } from 'react';
import {
  TextField, Button, Container, Box, FormGroup, Typography,
} from '@material-ui/core';
import TypographyMenu from '../../Menu/TypographyMenu';
import useAuthUser from '../../../src/hooks/useAuthUser';
import authApi from '../../../src/services/api/authApi';

export default function DashboardHome({ data }) {
  const { isUser, user, setUser } = useAuthUser();
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessNameError, setNewBusinessNameError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const alphanumeric = /^[0-9a-zA-Z]+$/;

  const { api } = authApi();

  useEffect(() => {
    setUser({
      ...user,
      ...data.user,
      business: data.business,
    });
  }, []);

  const handleTextField = (e) => {
    e.match(alphanumeric) ? (
      setNewBusinessName(e.toLowerCase().split(' ').join('').trim()),
      setNewBusinessNameError(null)
    ) : (
      setNewBusinessNameError('Caractere não permitido. Utilize apenas letras e números!'),
      setNewBusinessName(e.toLowerCase().split(' ').join('').trim())
    );
  };

  const handleCreate = async () => {
    if (!newBusinessNameError && newBusinessName !== '') {
      setIsSubmitting(true);
      try {
        const result = await api('POST', 'business/create', {
          businessName: newBusinessName,
        });
        const newBusiness = result.data;
        const businessUpdated = [...user.business, newBusiness];

        setUser({
          ...user,
          business: businessUpdated,
        });
      } catch (error) {
        setNewBusinessNameError(`${error}`);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h2">
        Dashboard
      </Typography>
      <div>
        <Typography variant="h5" component="h3">
          Suas Lojas
        </Typography>
        {isUser && <TypographyMenu list={user.business} />}
        <div>
          <Box m={2}>
            <Typography variant="h5" component="h2">Criar nova Loja</Typography>
          </Box>
          <Box m={2}>
            <FormGroup>
              <TextField
                label="Insira o nome da loja"
                value={newBusinessName}
                color="secondary"
                error={newBusinessNameError !== null}
                helperText={newBusinessNameError && newBusinessNameError}
                onChange={(e) => handleTextField(e.target.value)}
              />
              <Typography variant="subtitle2" component="p">
                www.fliver.app/
                {newBusinessName}
              </Typography>
            </FormGroup>
          </Box>
          <Box m={2}>
            <FormGroup>
              <Button
                variant="contained"
                color="secondary"
                disabled={newBusinessNameError !== null || isSubmitting}
                onClick={() => handleCreate()}
              >
                Criar Loja
              </Button>
            </FormGroup>
          </Box>
        </div>
      </div>
    </Container>
  );
}
