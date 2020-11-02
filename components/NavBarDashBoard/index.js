import { useRouter } from 'next/router';
import {
  AppBar, Box, IconButton, Toolbar, Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default function NavBarDashBoard({ backUrl, title = 'Fliver' }) {
  const router = useRouter();

  const handleBack = () => {
    router.push(backUrl);
  };

  return (
    <Box marginBottom={12}>
      <AppBar color="inherit">
        <Toolbar>
          {
            backUrl && (
              <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="close">
                <ArrowBackIcon />
              </IconButton>
            )
          }
          <Typography variant="h5">
            { title }
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
