import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#fafafa',
      contrastText: '#000000',
    },
    primary: {
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
