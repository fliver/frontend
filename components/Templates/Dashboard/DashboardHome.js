import { useEffect, useState } from 'react';
import {
  TextField, Button, Container, Box, FormGroup, Typography, CircularProgress,
} from '@material-ui/core';
import TypographyMenu from '../../Menu/TypographyMenu';
import useAuthUser from '../../../src/hooks/useAuthUser';
import authApi from '../../../src/services/api/authApi';
import NavVarDashBoard from '../../NavBarDashBoard';

export default function DashboardHome({ data }) {
  const { isUser, user, setUser, logout } = useAuthUser();
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessNameError, setNewBusinessNameError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayCreateSection, setDisplayCreateSection] = useState(false);
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
      setDisplayCreateSection(false);
    }
  };

  return (
    <>
      <NavVarDashBoard title="Dashboard" />
      <Container>
        <div>
          {isUser && (
            user.business[0] !== undefined ? (
              <>
                <Typography variant="h5" component="h3">
                  { user.business.length > 1 ? 'Suas Lojas' : 'Sua Loja' }
                </Typography>
                <TypographyMenu list={user.business} />
              </>
            ) : (
              <Typography variant="h5" component="h3">
                Nenhuma Loja Criada
              </Typography>
            )
          )}
          <div>
            {
              displayCreateSection ? (
                <>
                  <Box m={2}>
                    <Typography variant="h5" component="h2">Criar nova Loja</Typography>
                    <Typography variant="caption" component="h3">Insira o nome da loja sem espaço. Este nome será exibido no endereço do site. Após criar a loja, você poderá editar o nome de exibição.</Typography>
                  </Box>
                  <Box m={2}>
                    <FormGroup>
                      <TextField
                        label="Insira o Nome da Loja (sem espaço)"
                        value={newBusinessName}
                        color="primary"
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
                        color="primary"
                        disabled={newBusinessNameError !== null || isSubmitting}
                        onClick={() => handleCreate()}
                      >
                        {isSubmitting && <CircularProgress size={24} />}
                        {!isSubmitting && 'Criar Loja'}
                      </Button>
                      <Button
                        onClick={() => setDisplayCreateSection(false)}
                      >
                        Cancelar
                      </Button>
                    </FormGroup>
                  </Box>
                </>
              ) : (
                <Box m={2}>
                  <FormGroup>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setDisplayCreateSection(true)}
                    >
                      Criar Nova Loja
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => logout()}
                    >
                      Sair
                    </Button>
                  </FormGroup>
                </Box>

              )
            }

          </div>
        </div>
      </Container>
    </>
  );
}
