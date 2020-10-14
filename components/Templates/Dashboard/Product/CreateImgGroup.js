import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import { Formik, Form, Field } from 'formik';

import { CirclePicker } from 'react-color';

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

import imageCompression from 'browser-image-compression';
import authApi from '../../../../src/services/api/authApi';
import useAuthUser from '../../../../src/hooks/useAuthUser';

const imgTest = [
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '4rem 0',
  },
  addImages: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '10px',
	  cursor: 'pointer',
	  fontSize: '1rem',
	  fontWeight: '700',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  swatch: {
    padding: '2px',
    background: '#fff',
    borderRadius: '50px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  groupImageSection: {
    background: '#f9f9f9',
  },
  listContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 5,
  },
  cover: {
    width: 80,
    // height: 90,
  },
  variationItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '-1.2rem',
  },
  imgSection: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function getSteps(color) {
  return ['Informe a Cor Principal das Imagens Desse Grupo', `Adicione as Imagens do Produto com a Cor ${color.name}`, 'Adicione as Variáveis Deste Grupo'];
}

function GroupColor() {
  const [color, setColor] = useState({ hex: '#2874A6', name: 'azul' });
  const [displayColor, setDisplayColor] = useState(true);

  const classes = useStyles();

  const handleColorChange = (hexColor) => {
    setColor({
      ...color,
      hex: hexColor.hex,
    });
    setDisplayColor(false);
  };

  const ColorButtonSection = () => (
    <div className={classes.swatch}>
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50px',
        background: `${color.hex}`,
      }}
      />
    </div>
  );

  return (
    <div>
      <FormControl>
        <TextField
          value={color.name}
          onChange={(e) => setColor({ ...color, name: e.target.value })}
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
    </div>
  );
}

export default function CreateImgGroup() {
  const { user, setUser } = useAuthUser();
  const [color, setColor] = useState({ hex: '#2874A6', name: 'azul' });
  const [displayColor, setDisplayColor] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [slideActive, setSlideActive] = useState(0);

  const { query: { bn, bid } } = useRouter();
  const router = useRouter();

  const steps = getSteps(color);
  const maxSlides = imgTest.length;

  const classes = useStyles();

  const { api } = authApi();

  const handleColorChange = (hexColor) => {
    setColor({
      ...color,
      hex: hexColor.hex,
    });
    setDisplayColor(false);
  };

  const ColorButtonSection = () => (
    <div className={classes.swatch}>
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50px',
        background: `${color.hex}`,
      }}
      />
    </div>
  );

  async function handleImageUpload(event) {
    const imageFile = event.target.files[0];
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 0.200,
      maxWidthOrHeight: 600,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

      // outPutUrl.push();
      console.log('compressedFile', compressedFile)
      console.log('url:', URL.createObjectURL(compressedFile));
      const imgData = new FormData();
      imgData.append('images', imgData);
      setImages([...images, compressedFile]);
      // await uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }
  }

  const handleSizeSubmit = (value) => {
    setSizes([...sizes, value]);
  };

  const ImagesListSection = () => (
    <Box className={classes.groupImageSection}>
      { images.length > 0 && images.map((img) => (
        <List key={URL.createObjectURL(img)} className={classes.listContent}>
          <ListItem>
            <Typography variant="caption" component="h3">1</Typography>
            <img
              className={classes.cover}
              src={URL.createObjectURL(img)}
              alt="img 1"
            />
          </ListItem>
          <ListItem>
            <IconButton aria-label="up">
              <ArrowUpwardIcon />
            </IconButton>
          </ListItem>
          <ListItem>
            <IconButton aria-label="down">
              <ArrowDownwardIcon />
            </IconButton>
          </ListItem>
          <ListItem>
            <IconButton aria-label="remove" edge="end">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        </List>
      ))}
      <Box
        m={2}
        display="flex"
        justifyContent="center"
        style={{
          padding: '0 0',
        }}
        className={classes.addImages}
      >
        {/* <Button type="file">Adicionar Imagens</Button> */}
        <label htmlFor="add_images">
          Adicionar Imagens
          <IconButton>
            <AddCircleIcon />
          </IconButton>
          <input style={{ display: 'none' }} type="file" id="add_images" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp" onChange={handleImageUpload} multiple />
        </label>
      </Box>
    </Box>
  );

  // const GroupImagesVariant = () => (
    
  // );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <FormControl>
              <TextField
                value={color.name}
                onChange={(e) => setColor({ ...color, name: e.target.value })}
                placeholder="Ex.: Azul"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" onClick={() => setDisplayColor(true)}>
                      <ColorButtonSection />
                    </InputAdornment>),
                }}
              />
            </FormControl>
            {
                displayColor && (
                  <div>
                    <Box marginTop={2} marginBottom={2}>
                      <CirclePicker onChange={handleColorChange} />
                    </Box>
                  </div>
                )
              }
          </div>
        );
      case 1:
        return <ImagesListSection />;
      case 2:
        return (
          <div className={classes.listContent}>
      <div>
        <div>
          {
            sizes.length > 0 && sizes.map((item) => (
              <div key={item.size} className={classes.variationItem}>
                <ListItemText
                  primary={`Tamanho: ${item.size}`}
                />
                <IconButton aria-label="Remove" edge="start">
                  <DeleteIcon />
                </IconButton>
              </div>
            ))
          }

        </div>
        <Box marginTop={4} marginBottom={4}>
          <div className={classes.variationItem}>
            <Formik initialValues={{ size: '' }} onSubmit={(e) => handleSizeSubmit(e)}>
              {
                () => (
                  <Form>
                    <Field
                      name="size"
                      as={TextField}
                      InputLabelProps={{ shrink: true }}
                      placeholder="Ex.: 36, 45cm, único"
                      label="Tamanho"
                      color="primary"
                      variant="outlined"
                    />

                    <IconButton type="submit" aria-label="Add">
                      <AddCircleIcon />
                    </IconButton>
                  </Form>
                )
              }
            </Formik>
          </div>
        </Box>
      </div>

    </div>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleNextSlide = () => {
    setSlideActive((prevSlideActive) => prevSlideActive + 1);
  };

  const handleBackSlide = () => {
    setSlideActive((prevSlideActive) => prevSlideActive - 1);
  };

  const ImageSection = () => (
    <Box className={classes.groupImageSection}>
      <Box style={{ padding: '1rem 0' }}>
        <Typography variant="subtitle1" component="h3" align="center">Pré-visualização do grupo de imagens</Typography>
      </Box>
      <>
        <div className={classes.imgSection}>
          <MobileStepper
            position="static"
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
            src={imgTest[slideActive].imgPath}
            alt={imgTest[slideActive].label}
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
        <Box display="flex" justifyContent="center" style={{ padding: '1rem 0' }}>
          <Button type="button" color="secondary">Remover Imagens</Button>
          <Button type="button" color="secondary">Adicionar Imagens</Button>
        </Box>
      </>
    </Box>
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleCreate = async () => {
    const imagesData = new FormData();
    images.forEach((image) => {
      imagesData.append('images', image);
    });

    try {
      const result = await api('POST', `/product/${bn}/create`, imagesData);
      const { createdProduct } = result.data;
      const productId = createdProduct._id;
      const vars = sizes.map((variant) => (
        {
          ...createdProduct.vars[0],
          size: variant.size,
        }
      ));

      const productNewData = {
        ...createdProduct,
        imageGroup: {
          ...createdProduct.imageGroup[0],
          color: {
            name: color.name,
            code: color.hex,
          },
        },
        vars,
      };
      const { data } = await api('PATCH', `/product/${bn}/update/content/${productId}`, { productNewData });
      const { business } = user;
      business[bid].productsData.push(data);
      setUser({
        ...user,
        ...business,
      });
      const idx = business[bid].productsData.length - 1;
      router.push(`/dashboard/products/edit?bid=${bid}&pid=${idx}`);
    } catch (error) {
      console.log('update error ', error);
      // throw new Error(error.response);
    }
  };

  const handleClose = () => {
    router.push(`/dashboard/products?bid=${bid}`);
  };

  return (
    <div className={classes.root}>
      {/* <AppBar style={{ borderBottom: `4px solid #${color.hex}` }}> */}
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="close" onClick={handleClose}>
            <CancelIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Criar Novo Grupo de Imagens
          </Typography>
        </Toolbar>
      </AppBar>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(index)}
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {/* {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'} */}
                    Próximo
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          {/* <Typography>Pré-visualização do grupo de imagens</Typography> */}
          {/* <ImageSection /> */}
          <Paper>
            <Box padding={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Button onClick={handleCreate} variant="contained" color="primary" className={classes.button}>
                Criar Grupo de Imagens
              </Button>
              <Button onClick={handleReset} className={classes.button}>
                Revisar
              </Button>
            </Box>
          </Paper>
        </Paper>
      )}
    </div>
  );
}
