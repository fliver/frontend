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
  FormGroup,
  CircularProgress,
} from '@material-ui/core';

import imageCompression from 'browser-image-compression';
import authApi from '../../../../src/services/api/authApi';
import useAuthUser from '../../../../src/hooks/useAuthUser';
import editArray from '../../../../src/utils/editArray';

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
  return ['Informe abaixo a cor disponível deste produto - Você poderá adicionar mais cores após SALVAR este produto', `Adicione as Imagens do Produto com a Cor ${color.name}`, `Adicione as Variáveis Deste Produto com a cor ${color.name} `];
}

function getStepsNewColor(color) {
  return ['Informe uma nova opção de cor para este produto', `Adicione as Imagens do Produto com a Cor ${color.name}`, `Adicione as Variáveis Deste Produto com a cor ${color.name} `];
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
  const [color, setColor] = useState({ hex: '#2874A6', name: '' });
  const [displayColor, setDisplayColor] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [slideActive, setSlideActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState('');

  const { query: { bn, bid, pid } } = useRouter();
  const router = useRouter();

  const steps = pid ? getStepsNewColor(color) : getSteps(color);

  const classes = useStyles();

  const { api } = authApi();
  const {
    handleMoveBack,
    handleMoveNext,
    handleItemRemove,
  } = editArray();

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

    const options = {
      maxSizeMB: 0.200,
      maxWidthOrHeight: 600,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);

      const imgData = new FormData();
      imgData.append('images', imgData);
      setImages([...images, compressedFile]);
      // await uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  const handleSizeSubmit = (value) => {
    const sizesToAdd = value.trim().split(',').map((item) => ({ size: item }));
    setSizes([...sizes, ...sizesToAdd]);
    setVariant('');
  };

  const ImagesListSection = () => (
    <Box className={classes.groupImageSection}>
      { images.length > 0 && images.map((img, idx) => (
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
            <IconButton aria-label="up" disabled={idx === 0} onClick={() => setImages(handleMoveBack(images, idx))}>
              <ArrowUpwardIcon />
            </IconButton>
          </ListItem>
          <ListItem>
            <IconButton aria-label="down" disabled={idx === images.length - 1} onClick={() => setImages(handleMoveNext(images, idx))}>
              <ArrowDownwardIcon />
            </IconButton>
          </ListItem>
          <ListItem>
            <IconButton aria-label="remove" edge="end" disabled={images.length === 1} onClick={() => setImages(handleItemRemove(images, idx))}>
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
          <input style={{ display: 'none' }} type="file" id="add_images" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp" onChange={handleImageUpload} />
        </label>
      </Box>
    </Box>
  );

  // const GroupImagesVariant = () => (

  // );

  function getStepsError(idx) {
    switch (idx) {
      case 0:
        return color.name === '';
      case 1:
        return images.length === 0;
      case 2:
        return sizes.length === 0;
      default:
        return true;
    }
  }
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
                  startAdornment: (
                    <InputAdornment position="start" onClick={() => setDisplayColor(true)}>
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
            sizes.length > 0 && sizes.map((item, idx) => (
              <div key={item.size} className={classes.variationItem}>
                <ListItemText
                  primary={`Tamanho: ${item.size}`}
                />
                <IconButton aria-label="Remove" edge="start" onClick={() => setSizes(handleItemRemove(sizes, idx))}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))
          }

              </div>
              <Box marginTop={4} marginBottom={4}>
                <div className={classes.variationItem}>
                  {/* <Formik
                    enableReinitialize
                    initialValues={variantInitialValue}
                    onSubmit={(e) => handleSizeSubmit(e)}
                  >
                    {
                () => (
                  <Form>
                    <Field
                      name="size"
                      as={TextField}
                      InputLabelProps={{ shrink: true }}
                      placeholder="Ex.: 36, GG, 45cm, único"
                      label="Tamanho"
                      color="primary"
                      variant="outlined"
                      style={{ width: '13rem' }}
                    />
                    <IconButton type="submit" aria-label="Add">
                      <AddCircleIcon />
                    </IconButton>
                  </Form>
                )
              }
                  </Formik> */}
                  <FormControl>
                    <TextField
                      value={variant}
                      onChange={(e) => setVariant(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      placeholder="Ex.: 36, GG, 45cm, único"
                      label="Tamanho"
                      color="primary"
                      variant="outlined"
                      style={{ width: '13rem' }}
                    />
                  </FormControl>

                  <IconButton type="button" aria-label="Add" disabled={variant === ''} onClick={() => handleSizeSubmit(variant)}>
                    <AddCircleIcon />
                  </IconButton>
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
    setLoading(true);
    const imagesData = new FormData();
    images.forEach((image) => {
      imagesData.append('images', image);
    });

    try {
      const result = await api('POST', `/product/${bn}/create`, imagesData);
      const { createdProduct } = result.data;
      const productId = createdProduct._id;
      const vars = sizes.map((item) => (
        {
          ...createdProduct.vars[0],
          size: item.size,
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
      setLoading(false);
      router.push(`/dashboard/products/edit?bid=${bid}&pid=${idx}`);
    } catch (error) {
      setLoading(false);
      throw new Error(error.response);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    const imagesData = new FormData();
    images.forEach((image) => {
      imagesData.append('images', image);
    });

    try {
      const result = await api('PATCH', `/product/${user.business[bid].businessName}/create/imgGroup/${user.business[bid].productsData[pid]._id}`, imagesData);
      const { updatedProduct, imgGroupId } = result.data;
      const newVars = sizes.map((variantSize) => (
        {
          imageGroupId: imgGroupId,
          size: variantSize.size,
        }
      ));
      const groupIdx = updatedProduct.imageGroup.findIndex((item) => item.id === imgGroupId);
      updatedProduct.imageGroup[groupIdx] = {
        ...updatedProduct.imageGroup[groupIdx],
        color: {
          name: color.name,
          code: color.hex,
        },
      };

      const productNewData = {
        ...updatedProduct,
        vars: [...updatedProduct.vars, ...newVars],
      };

      try {
        const updated = await api('PATCH', `/product/${user.business[bid].businessName}/update/content/${updatedProduct._id}`, { productNewData });
        const { business } = user;
        business[bid].productsData[pid] = updated.data;
        setUser({
          ...user,
          ...business,
        });
        setLoading(false);
        router.back();
      } catch (error) {
        setLoading(false);
        throw new Error(`${error}`);
      }
    } catch (error) {
      setLoading(false);
      throw new Error(error.response);
    }
  };

  const handleClose = () => {
    pid ? router.back() : router.push(`/dashboard/products?bid=${bid}`);
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
            {pid ? 'Adicionar Nova Cor' : 'Criar Novo Produto'}
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
                    disabled={getStepsError(index)}
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
              {
                pid ? (
                  <Button onClick={handleAdd} variant="contained" disabled={loading} color="primary" className={classes.button}>
                    {loading && <CircularProgress size={24} /> }
                    {!loading && 'Salvar Nova Cor e Variáveis'}
                  </Button>
                ) : (
                  <Button onClick={handleCreate} variant="contained" disabled={loading} color="primary" className={classes.button}>
                    {loading && <CircularProgress size={24} /> }
                    {!loading && 'Salvar Novo Produto'}
                  </Button>
                )
              }

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
