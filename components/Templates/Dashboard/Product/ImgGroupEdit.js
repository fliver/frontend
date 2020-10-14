/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react';

import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { CirclePicker } from 'react-color';
import clsx from 'clsx';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

// import Radio from '@material-ui/core/Radio';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import EditLocationIcon from '@material-ui/icons/EditLocation';

// import CustomHead from '../../CustomHead/CustomHead';
// import FullScreenDialog from '../../FullScreenDialog';
import {
  AppBar,
  Box, Button, FormGroup, Grid, TextField, Toolbar, Typography,
} from '@material-ui/core';
import NavBar from '../../../NavBar/NavBar';

const tutorialSteps = [
  {
    label: 'San Francisco – Oakland Bay Bridge, United States',
    imgPath:
      'http://localhost:5000/static/eSkxYfaPx/products/38879655c9138b481aff-fv-g01-azul-01.jpeg',
  },
  {
    label: 'Bird',
    imgPath:
      'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Bali, Indonesia',
    imgPath:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    label: 'NeONBRAND Digital Marketing, Las Vegas, United States',
    imgPath:
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Goč, Serbia',
    imgPath:
      'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
  },
];

// import config from '../../../../src/config';

// import isEmptyObject from '../../../src/utils/isEmptyObject';

// import { UserContext } from '../../../src/contexts/UserContext';
// import { BusinessContext } from '../../../src/contexts/BusinessContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    color: 'red',
  },
  fillSpace: {
    flexGrow: 1,
  },
  imgSection: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
  linearloading: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  container: {
    margin: '4rem 0',
    height: '100vh',
    marginBottom: '4rem',
    width: '100%',
    maxWidth: '800px',
  },
  listItem: {
    padding: '4px 6px',
  },
  listContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 5,
  },
  variantContainer: {
    width: '100%',
    padding: 5,
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 0,
    marginLeft: 20,
    marginTop: '-1rem',
  },
  productInfoContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  variationItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '-1.2rem',
  },
  qtyController: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDetail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0.5rem 0.7rem',
  },
  divider: {
    flex: 1,
    borderBottom: '1px solid #cacaca',
  },
  cover: {
    width: 80,
    // height: 90,
  },
  orderButtonContainer: {
    position: 'fixed',
    width: 'inherit',
    maxWidth: 'inherit',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    backgroundColor: '#fff',
  },
  color: {
    width: '18px',
    height: '18px',
    borderRadius: '50px',
    background: 'red', // `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
  },
  swatch: {
    padding: '2px',
    background: '#fff',
    borderRadius: '50px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  orderButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    width: '99%',
    height: 40,
    backgroundColor: '#000',
    color: '#fff',
    fontWeight: 400,
    border: 0,
    outlineStyle: 'none',
    textTransform: 'uppercase',
    fontSize: 'large',
  },
  groupImageSection: {
    background: '#f9f9f9',
  },
  colorName: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '2rem 3rem',
  },
  address: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: '0 20px',
    border: '1px solid #cacaca',
    lineHeight: '1rem',
    width: '80%',
    fontSize: '0.8rem',
    '& div p:first-child': {
      fontWeight: '700',
      fontSize: '0.9rem',
    },
    '& div': {
      padding: '0.6rem 0',
    },
    '& div p': {
      margin: '0.4rem auto',
    },
  },
}));

export default function ImgGroupEdit() {
  // const { user } = useContext(UserContext);
  // const { business } = useContext(BusinessContext);
  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const [color, setColor] = useState({ hex: '2874A6' });
  const [displayColor, setDisplayColor] = useState(true);

  const classes = useStyles();

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleColorChange = (hexColor) => {
    console.log(hexColor);
  };

  const ColorButtonSection = () => (
    <div className={classes.swatch}>
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50px',
        background: `#${color.hex}`,
      }}
      />
    </div>
  );

  const ImagesListSection = () => (
    <Box className={classes.groupImageSection}>
      <Box style={{ padding: '1rem 0' }}>
        <Typography variant="subtitle1" component="h3" align="center">Imagens do Produto com a Cor Azul</Typography>
      </Box>
      { tutorialSteps.map((img) => (
        <List className={classes.listContent}>
          <ListItem>
            <Typography variant="caption" component="h3">1</Typography>
            <img
              className={classes.cover}
              src="https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60"
              alt="img 1"
            />
          </ListItem>
          <listItem>
            <IconButton aria-label="up">
              <ArrowUpwardIcon />
            </IconButton>
          </listItem>
          <listItem>
            <IconButton aria-label="down">
              <ArrowDownwardIcon />
            </IconButton>
          </listItem>
          <ListItem>
            <IconButton aria-label="remove" edge="end">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        </List>
      ))}
      <Box display="flex" justifyContent="center" style={{ padding: '1rem 0' }}>
        <Button type="button" color="secondary">Adicionar Imagens</Button>
      </Box>
    </Box>
  );

  const ImageSection = () => (
    <Box className={classes.groupImageSection}>
      <Box style={{ padding: '1rem 0' }}>
        <Typography variant="subtitle1" component="h3" align="center">Imagens do Produto com a Cor Azul</Typography>
      </Box>
      <>
        <div className={classes.imgSection}>
          <MobileStepper
            position="static"
            backButton={(
          (
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
              Voltar
            </Button>
)
        )}
          />
          <img
            className={classes.cover}
            src={tutorialSteps[activeStep].imgPath}
            alt={tutorialSteps[activeStep].label}
          />
          {/* <CardMedia
        className={classes.cover}
        image={tutorialSteps[activeStep].imgPath}
        title={tutorialSteps[activeStep].label}
      /> */}

          <MobileStepper
            position="static"
            nextButton={
          (
            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
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
        <Box display="flex" justifyContent="center" style={{ padding: '1rem 0' }}>
          <Button type="button" color="secondary">Remover Imagens</Button>
          <Button type="button" color="secondary">Adicionar Imagens</Button>
        </Box>
      </>
    </Box>
  );

  return (
    <>
      <AppBar style={{ borderBottom: `4px solid #${color.hex}` }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="close">
            <CancelIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Grupo de Imagens do Produto
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.container} maxWidth="sm" disableGutters>
        <Box align="center" marginTop={10}>
          <Typography variant="subtitle2" component="h3">Grupo #1</Typography>
        </Box>
        <Box m={2}>
          <Card className={classes.variantContainer}>

            {/* <CirclePicker /> */}
            <div>
              <Box marginTop={2} marginLeft={6} marginRight={6}>
                <Typography variant="subtitle1" component="h3" align="center" width="50%">
                  Defina a Cor Principal das Imagens Desse Grupo
                </Typography>
              </Box>
              <Box marginLeft={8} marginRight={8} marginTop={2} marginBottom={4} display="flex" justifyContent="center">
                <FormControl>
                  <TextField
                    color="secondary"
                    placeholder="Ex.: Azul"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <ColorButtonSection />
                        </InputAdornment>),
                    }}
                  />
                </FormControl>
                {
                  displayColor && (
                    <div>
                      <CirclePicker onChange={handleColorChange} />
                    </div>
                  )
                }
              </Box>
            </div>
            {/* <TextField label="Cor:" color="secondary" placeholder="Ex.: Vermelha" /> */}
            {/* <Typography variant="subtitle1" component="h3" align="center">Imagens do Produto</Typography> */}
            <ImagesListSection />
            <Typography variant="subtitle1" component="h3" align="center">Variáveis do Produto com a Cor Azul</Typography>
            <div className={classes.listContent}>

              {/* <CardMedia
                    className={classes.cover}
                    image="http://localhost:5000/static/eSkxYfaPx/products/38879655c9138b481aff-fv-g01-azul-01.jpeg"
                    title="alt da imagem"
                  /> */}
              <div>
                <div>
                  <div className={classes.variationItem}>
                    <ListItemText
                      primary="Tamanho: 32 | Estoque: 1"
                    />
                    <IconButton aria-label="Remove" edge="start">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <div className={classes.variationItem}>
                    <ListItemText
                      primary="Tamanho: 32 | Estoque: 1"
                    />
                    <IconButton aria-label="Remove" edge="start">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <div className={classes.variationItem}>
                    <ListItemText
                      primary="Tamanho: 32 | Estoque: 1"
                    />
                    <IconButton aria-label="Remove" edge="start">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
                <Box marginTop={2}>
                  <Grid container flexDirection="row" alignItems="center" spacing={1}>
                    <Grid item xs={5}>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        placeholder="Ex.: 36 | único"
                        label="Tamanho"
                        color="secondary"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        type="number"
                        label="Estoque"
                        placeholder="Ex.: 1"
                        color="secondary"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton aria-label="Add">
                        <AddCircleIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              </div>

            </div>

          </Card>
        </Box>
        <Box m={4}>
          <FormGroup>
            <Button type="button" variant="contained" color="secondary">Adicionar Este Grupo de Imagens</Button>
          </FormGroup>
        </Box>
      </Container>
    </>
  );
}
