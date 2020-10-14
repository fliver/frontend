import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Link from '../src/Link';

// import ProTip from '../src/ProTip';
// import Copyright from '../src/Copyright';

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={4} display="flex" flexDirection="column">
        <Typography variant="h4" component="h1" gutterBottom>
          Criar loja Gratuita!
        </Typography>
        <Button variant="contained" color="secondary" component={Link} naked href="/sigin">
          Criar Conta
        </Button>
        <Link href="/login" color="secondary">
          Já tem uma conta? Entre aqui.
        </Link>
      </Box>
    </Container>
  );
}
