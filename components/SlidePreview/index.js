import { useState } from 'react';
import { useRouter } from 'next/router';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { makeStyles } from '@material-ui/core/styles';

import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Button,
  StepContent,
  StepLabel,
  Step,
  Stepper,
  Box,
  FormControl,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Grid,
  MobileStepper,
} from '@material-ui/core';

import config from '../../src/config';

const useStyles = makeStyles(() => ({
  imgSection: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disableDots: {
    '& .MuiMobileStepper-dots': {
      display: 'none',
    },
  },
  cover: {
    width: 80,
    // height: 90,
  },
}));

export default function SlidePreview({ images, alt }) {
  const [slideActive, setSlideActive] = useState(0);
  const maxSlides = images.length;
  const classes = useStyles();
  const router = useRouter();

  const handleNextSlide = () => {
    setSlideActive((prevSlideActive) => prevSlideActive + 1);
  };

  const handleBackSlide = () => {
    setSlideActive((prevSlideActive) => prevSlideActive - 1);
  };

  return (
    <div>
      <Box style={{ padding: '1rem 0' }}>
        <Typography variant="subtitle1" component="h3" align="center">
          Pré-visualização do grupo de imagens
        </Typography>
      </Box>
      <div className={classes.imgSection}>
        <MobileStepper
          className={classes.disableDots}
          steps={maxSlides}
          position="static"
          variant="dots"
          backButton={(
        (
          <Button size="small" onClick={handleBackSlide} disabled={slideActive === 0}>
            <KeyboardArrowLeft />
            Voltar
          </Button>
)
      )}
        />
        <img
          className={classes.cover}
          src={`${config.domain}/static/${images[slideActive]}`}
          alt={`${alt}-${slideActive}`}
        />
        {/* <CardMedia
      className={classes.cover}
      image={tutorialSteps[activeStep].imgPath}
      title={tutorialSteps[activeStep].label}
    /> */}

        <MobileStepper
          className={classes.disableDots}
          steps={maxSlides}
          position="static"
          variant="dots"
          nextButton={
        (
          <Button size="small" onClick={handleNextSlide} disabled={slideActive === maxSlides - 1}>
            próxima
            <KeyboardArrowRight />
          </Button>
)
      }
        />
      </div>
      {/* <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
      /> */}
      <Box display="flex" justifyContent="center">
        <Button type="button">Editar</Button>
      </Box>
      <Box display="flex" justifyContent="center" style={{ padding: '1rem 0' }}>
        <Button type="button" color="primary" onClick={() => router.push('/dashboard/products/create/group')}>Criar Grupo de Imagens</Button>
      </Box>
    </div>
  );
}
