import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fafafa',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ffb74d',
      contrastText: '#fff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f9f9f9',
    },
  },
});

export default theme;
