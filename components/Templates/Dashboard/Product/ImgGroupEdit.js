/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect } from 'react';

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

import imageCompression from 'browser-image-compression';

// import Radio from '@material-ui/core/Radio';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import EditLocationIcon from '@material-ui/icons/EditLocation';

// import CustomHead from '../../CustomHead/CustomHead';
// import FullScreenDialog from '../../FullScreenDialog';
import {
  AppBar,
  Box, Button, CircularProgress, FormGroup, Grid, TextField, Toolbar, Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Field, Form, Formik } from 'formik';
import NavBar from '../../../NavBar/NavBar';
import useAuthUser from '../../../../src/hooks/useAuthUser';
import config from '../../../../src/config';
import authApi from '../../../../src/services/api/authApi';
import NavBarDashBoard from '../../../NavBarDashBoard';

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
  addImages: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '10px',
	  cursor: 'pointer',
	  fontSize: '1rem',
	  fontWeight: '700',
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
    marginTop: '1.5rem',
    padding: '1rem 0',
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

const compressImages = async (event, currentImages) => {
  const imageFile = event.target.files[0];

  const options = {
    maxSizeMB: 0.200,
    maxWidthOrHeight: 600,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);
    return [...currentImages, compressedFile];
  } catch (error) {
    return { error };
  }
};

export function ImagesListToAdd({ imagesToAdd }) {
  const classes = useStyles();

  return (
    <Box className={classes.groupImageSection}>
      { imagesToAdd.length > 0 && imagesToAdd.map((img) => (
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
    </Box>
  );
}

export function ImagesToRemove({
  imgsPath, imgGroupId, businessSlug, productId, handleCancelImgRemove, handleUpdateImgGroup,
}) {
//  const [images, setImages] = useState(imgsPaths || null);

  const { api } = authApi();

  const handleRemoveImages = async () => {
    const endPoint = `/product/${businessSlug}/delete/images/${productId}`;
    const imgsToRemove = {
      imgsPath,
      imgGroupId,
    };

    try {
      await api('DELETE', endPoint, imgsToRemove);
      handleUpdateImgGroup();
      // result.status === 200 && handleUpdateImgGroup();
    } catch (error) {
      throw new Error('Erro inesperado. Tente novamente ou entre em contato com a loja');
    }
  };

  const RemoveSection = () => (
    <div>
      <Typography>Confirmar Remoção?</Typography>
      <Button variant="contained" color="primary" onClick={() => handleRemoveImages()}>Confirmar</Button>
      <Button onClick={() => handleCancelImgRemove()}>Cancelar</Button>
    </div>
  );

  return (
    <>
      {
      imgsPath.length > 0 && <RemoveSection />
    }
    </>
  );
}

export function GroupToRemove({
  imgsPath, imgGroupId, businessSlug, productId, setDisplayRemoveGroup, handleUpdateProduct, loading,
}) {
//  const [images, setImages] = useState(imgsPaths || null);

  const { api } = authApi();

  const handleRemoveImages = async () => {
    const endPoint = `/product/${businessSlug}/delete/images/${productId}`;
    const imgsToRemove = {
      imgsPath,
      imgGroupId,
    };

    try {
      await api('DELETE', endPoint, imgsToRemove);
      handleUpdateProduct(imgGroupId);
      // result.status === 200 && handleUpdateImgGroup();
    } catch (error) {
      throw new Error('Erro inesperado. Tente novamente ou entre em contato com a loja');
    }
  };

  return (
    <div>
      <Typography>Confirmar Remoção Total deste Grupo?</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleRemoveImages()}
        disabled={loading}
      >
        {loading && <CircularProgress size={24} />}
        {!loading && 'Confirmar'}
      </Button>
      <Button onClick={() => setDisplayRemoveGroup(false)}>Cancelar</Button>
    </div>
  );
}

export default function ImgGroupEdit() {
  const { query: { bid, pid, gid } } = useRouter();
  const router = useRouter();
  const { isUser, user, setUser } = useAuthUser();
  // const [editingBusiness, setEditingBusiness] = useState(null);
  const [vars, setVars] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgGroup, setImgGroup] = useState(null);
  const [prevImgGroup, setPrevImgGroup] = useState(null);
  const [imgsPathToRemove, setImgsPathToRemove] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagesToAdd, setImagesToAdd] = useState([]);
  const [displayRemoveGroup, setDisplayRemoveGroup] = useState(false);
  const [variant, setVariant] = useState('');
  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const [color, setColor] = useState({ hex: '2874A6' });
  const [displayColor, setDisplayColor] = useState(false);

  const classes = useStyles();

  const { api } = authApi();

  useEffect(() => {
    const groupToEdit = isUser && user.business[bid].productsData[pid].imageGroup[gid];
    const varsToEdit = groupToEdit && (
      user.business[bid].productsData[pid].vars.filter(
        (item) => item.imageGroupId === groupToEdit.id,
      )
    );
    groupToEdit && setImgGroup(groupToEdit);
    varsToEdit && setVars(varsToEdit);
    isUser && setEditingProduct(user.business[bid].productsData[pid]);
    groupToEdit && setColor({
      name: groupToEdit.color ? groupToEdit.color.name : 'Undefined',
      hex: groupToEdit.color ? groupToEdit.color.code : '#000',
    });
    // const pToEdit = isUser && user.business[bid].productsData[pid];
    // const bToEdit = isUser && user.business[bid];
    // bToEdit && setEditingBusiness(bToEdit);
    // bToEdit && setInitialValues({
    //   name: bToEdit.productsData[pid].name,
    //   description: bToEdit.productsData[pid].description,
    //   price: bToEdit.productsData[pid].price.original,
    //   salePrice: bToEdit.productsData[pid].price.sale,
    //   public: bToEdit.productsData[pid].public || false,
    // });
    // bToEdit && setImgGroup(bToEdit.productsData[pid].imageGroup);
  }, [isUser, user]);

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

  const handleMoveUp = (images, idx) => {
    const arrayToEdit = [...images];
    const itemToUp = arrayToEdit[idx];
    const itemToDown = arrayToEdit[idx - 1];

    arrayToEdit[idx] = itemToDown;
    arrayToEdit[idx - 1] = itemToUp;

    setImgGroup({
      ...imgGroup,
      images: arrayToEdit,
    });
  };

  const handleMoveDown = (images, idx) => {
    const arrayToEdit = [...images];
    const itemToUp = arrayToEdit[idx + 1];
    const itemToDown = arrayToEdit[idx];

    arrayToEdit[idx] = itemToUp;
    arrayToEdit[idx + 1] = itemToDown;

    setImgGroup({
      ...imgGroup,
      images: arrayToEdit,
    });
  };

  const handleImageRemove = (images, idx) => {
    const arrayToEdit = [...images];
    arrayToEdit.splice(idx, 1);

    !prevImgGroup && setPrevImgGroup({
      ...imgGroup,
      images,
    });
    setImgsPathToRemove([...imgsPathToRemove, images[idx]]);

    setImgGroup({
      ...imgGroup,
      images: arrayToEdit,
    });
  };

  const handleCancelImgRemove = () => {
    setImgGroup(prevImgGroup);
    setPrevImgGroup(null);
    setImgsPathToRemove([]);
  };

  const handleCancelGroupRemove = () => {
    setDisplayRemoveGroup(false);
  };

  const handleImageAdd = (images, idx) => {
    const arrayToEdit = [...images];
    arrayToEdit.splice(idx, 1);

    !prevImgGroup && setPrevImgGroup({
      ...imgGroup,
      images,
    });
    // setImgsPathToRemove([...imgsPathToRemove, images[idx]]);

    setImgGroup({
      ...imgGroup,
      images: arrayToEdit,
    });
  };

  const handleCancelImgAdd = () => {
    setImgGroup(prevImgGroup);
    setPrevImgGroup(null);
    // setImgsPathToRemove([]);
  };

  const handleUpdateImgGroup = () => {
    setPrevImgGroup(null);
    setImgsPathToRemove([]);
    const product = editingProduct;
    product.imageGroup[gid] = imgGroup;

    const updatedUser = user;
    updatedUser.business[bid].productsData[pid].imageGroup[gid] = imgGroup;
    setUser({
      ...updatedUser,
    });
  };

  const handleSizeRemove = (variants, idx) => {
    const varsToEdit = [...variants];
    varsToEdit.splice(idx, 1);
    setVars(varsToEdit);
  };

  const ImagesListSection = ({ group }) => (
    <Box marginBottom={4}>
      <Box style={{ padding: '1rem 0' }}>
        <Typography variant="subtitle1" component="h3" align="center">
          {`Imagens do Produto com a Cor ${color.name}`}
        </Typography>
      </Box>
      { group.images.map((img, idx) => (
        <List className={classes.listContent}>
          <ListItem>
            <Typography variant="caption" component="h3">{idx + 1}</Typography>
            <img
              className={classes.cover}
              src={`${config.mediaURL}/${img}`}
              alt="img 1"
            />
          </ListItem>
          <ListItem>
            <IconButton aria-label="up" disabled={idx === 0} onClick={() => handleMoveUp(group.images, idx)}>
              <ArrowUpwardIcon />
            </IconButton>
          </ListItem>
          <ListItem>
            <IconButton aria-label="down" disabled={idx === group.images.length - 1} onClick={() => handleMoveDown(group.images, idx)}>
              <ArrowDownwardIcon />
            </IconButton>
          </ListItem>
          <ListItem>
            <IconButton aria-label="remove" edge="end" disabled={group.images.length === 1} onClick={() => handleImageRemove(group.images, idx)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        </List>
      ))}
      <Box>
        <ImagesToRemove
          imgsPath={imgsPathToRemove}
          handleCancelImgRemove={handleCancelImgRemove}
          handleUpdateImgGroup={handleUpdateImgGroup}
          imgGroupId={imgGroup.id}
          businessSlug={user.business[bid].businessName}
          productId={editingProduct._id}
        />
      </Box>
    </Box>
  );

  const handleSizeSubmit = (value) => {
    const varsToAdd = value.trim().split(',').map((item) => ({ ...vars[0], size: item }));
    setVars([...vars, ...varsToAdd]);
    setVariant('');
  };

  const handleImageUpload = async (event) => {
    const imagesListPreview = await compressImages(event, imagesToAdd);
    setImagesToAdd(imagesListPreview);
  };

  const handleAddNewImages = async () => {
    const imagesData = new FormData();
    imagesToAdd.forEach((image) => {
      imagesData.append('images', image);
    });
    imagesData.append('imgGroupId', editingProduct.imageGroup[gid].id);

    try {
      const result = await api('PATCH', `/product/${user.business[bid].businessName}/update/images/${editingProduct._id}`, imagesData);
      const { updatedProduct } = result.data;
      const currProduct = editingProduct;
      currProduct.imageGroup[gid] = {
        ...updatedProduct.imageGroup[gid],
        ...color,
        images: updatedProduct.imageGroup[gid].images,
      };

      // setImgGroup(updatedProduct.imageGroup[gid]);

      setImagesToAdd([]);

      const { business } = user;
      business[bid].productsData[pid].imageGroup[gid] = updatedProduct.imageGroup[gid];
      setUser({
        ...user,
        ...business,
      });
    } catch (error) {
      throw new Error(`Erro de atualização - ${error}`);
    }
  };

  const updateProductContent = async () => {
    setLoading(true);
    const productToUpdate = editingProduct;

    productToUpdate.imageGroup[gid] = {
      ...imgGroup,
      color: {
        name: color.name,
        code: color.hex,
      },
    };

    const varsNotEdited = productToUpdate.vars.filter(
      (item) => item.imageGroupId !== imgGroup.id,
    );

    const varsToAdd = [...varsNotEdited, ...vars];

    productToUpdate.vars = varsToAdd;

    try {
      const result = await api('PATCH', `/product/${user.business[bid].businessName}/update/content/${editingProduct._id}`, { productNewData: productToUpdate });
      const { business } = user;
      business[bid].productsData[pid] = result.data;
      setUser({
        ...user,
        ...business,
      });
      setLoading(false);
      router.push(`/dashboard/products/edit?bid=${bid}&pid=${pid}`);
    } catch (error) {
      setLoading(false);
      throw new Error(error.response);
    }
  };

  const handleUpdateProduct = async (groupId) => {
    // update product without imgGroup
    setLoading(true);
    const product = editingProduct;
    product.imageGroup.splice(gid, 1);

    // and without related vars
    const varsWithOutRemovedGroup = product.vars.filter((item) => item.imageGroupId !== groupId);

    const productToUpdate = {
      ...product,
      vars: varsWithOutRemovedGroup,
    };

    try {
      const result = await api('PATCH', `/product/${user.business[bid].businessName}/update/content/${editingProduct._id}`, { productNewData: productToUpdate });
      const { business } = user;
      business[bid].productsData[pid] = result.data;
      setUser({
        ...user,
        ...business,
      });
      setLoading(false);
      router.push(`/dashboard/products/edit?bid=${bid}&pid=${pid}`);
    } catch (error) {
      setLoading(false);
      throw new Error(error.response);
    }
  };

  return (
    <>
      <NavBarDashBoard backUrl={`/dashboard/products/edit?bid=${bid}&pid=${pid}`} title="Editar Grupo" />
      {/* <AppBar style={{ borderBottom: `4px solid #${color.hex}` }}>
        <Toolbar>
          <Link href={`/dashboard/products/edit?bid=${bid}&pid=${pid}`}>
            <IconButton edge="start" color="inherit" aria-label="close">
              <CancelIcon />
            </IconButton>
          </Link>
          <Typography variant="h6" className={classes.title}>
            Editar Grupo
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Container className={classes.container} maxWidth="sm" disableGutters>
        {/* <Box align="center" marginTop={10}>
          <Typography variant="subtitle2" component="h3">Grupo #1</Typography>
        </Box> */}
        <Box m={2}>
          {/* <Card className={classes.variantContainer}> */}
          <Paper>
            <div>
              <Box marginLeft={6} marginRight={6} paddingTop={2}>
                <Typography variant="subtitle1" component="h3" align="center" width="50%">
                  Editar Cor Principal das Imagens Desse Grupo
                </Typography>
              </Box>

              <Box marginLeft={8} marginRight={8} marginTop={2} marginBottom={2}>
                <FormControl>
                  <Box marginTop={2} marginBottom={2}>
                    <TextField
                      value={color.name}
                      onChange={(e) => setColor({ ...color, name: e.target.value })}
                      placeholder="Ex.: Azul"
                      label="Cor"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" onClick={() => setDisplayColor(true)}>
                            <ColorButtonSection />
                          </InputAdornment>),
                      }}
                    />
                  </Box>
                </FormControl>
                {
                displayColor && (
                  <div>
                    <Box marginBottom={2}>
                      <CirclePicker onChange={handleColorChange} />
                    </Box>
                  </div>
                )
              }
              </Box>
            </div>
          </Paper>
          <Paper>
            {
          imgGroup && <ImagesListSection group={imgGroup} />
          }
            <Box m={4}>
              {
            imagesToAdd.length > 0 && (
              <>
                <ImagesListToAdd imagesToAdd={imagesToAdd} />
                <div>
                  <Typography>Confirmar Adição?</Typography>
                  <Button variant="contained" color="primary" onClick={() => handleAddNewImages()}>Confirmar</Button>
                  <Button onClick={() => setImagesToAdd([])}>Cancelar</Button>
                </div>
              </>
            )
          }
            </Box>
            <Box
              m={4}
              display="flex"
              justifyContent="center"
              style={{
                padding: '0 0',
                // margin: '1rem 0',
              }}
              className={classes.addImages}
            >
              <label htmlFor="add_images">
                Adicionar Novas Imagens
                <IconButton>
                  <AddCircleIcon />
                </IconButton>
                <input style={{ display: 'none' }} type="file" id="add_images" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp" onChange={handleImageUpload} multiple />
              </label>
            </Box>
            <div style={{ height: '0.1rem' }} />
          </Paper>
          <Paper className={classes.variantContainer}>
            <Typography variant="subtitle1" component="h3" align="center">
              {`Variáveis do Produto com a Cor ${color.name}`}
            </Typography>
            <div className={classes.listContent}>
              <div>
                <div>
                  {
            vars && vars.map((item, idx) => (
              <div key={item.size} className={classes.variationItem}>
                <ListItemText
                  primary={`Tamanho: ${item.size}`}
                />
                <IconButton aria-label="Remove" edge="start" disabled={vars.length === 1} onClick={() => handleSizeRemove(vars, idx)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))
          }

                </div>
                <Box marginTop={4} marginBottom={4}>
                  <div className={classes.variationItem}>
                    {/* <Formik initialValues={{ size: '' }} onSubmit={(e) => handleSizeSubmit(e)}>
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

          </Paper>
        </Box>
        <Box m={4}>
          {
            displayRemoveGroup ? (
              <GroupToRemove
                imgsPath={imgGroup.images}
                imgGroupId={imgGroup.id}
                businessSlug={user.business[bid].businessName}
                productId={editingProduct._id}
                setDisplayRemoveGroup={setDisplayRemoveGroup}
                handleUpdateProduct={handleUpdateProduct}
                loading={loading}
              />
            ) : (
              <FormGroup>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => updateProductContent()}
                  disabled={loading}
                >
                  {loading && <CircularProgress size={24} />}
                  {!loading && 'Salvar Mudanças'}
                </Button>
                <Button type="button" color="primary" onClick={() => setDisplayRemoveGroup(true)}>Remover Este Grupo</Button>
              </FormGroup>
            )
          }
        </Box>
      </Container>
    </>
  );
}
