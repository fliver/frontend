import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Formik, Form, Field, useField,
} from 'formik';
import { mask, unMask } from 'remask';
import SimpleMaskMoney from 'simple-mask-money';
import {
  object, string, number, boolean, mixed,
} from 'yup';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  FormGroup,
  TextField,
  Box,
  Paper,
  FormControl,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Checkbox,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import SlidePreview from '../../../SlidePreview';
import useAuthUser from '../../../../src/hooks/useAuthUser';
import authApi from '../../../../src/services/api/authApi';

import config from '../../../../src/config';
import setVarsBasedOnImgGroup from '../../../../src/utils/setVarsBasedOnImgGroup';

import styles from '../../Business/ProductHome.module.css';
import CurrencyInput from '../../../CurrencyInput.js/Index';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '4.6rem 0',
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const ImageGroupControll = ({
  singleProduct, handleEditGroup, pid, bid,
}) => {
  const [group, setGroup] = useState();
  const [vars, setVars] = useState(() => setVarsBasedOnImgGroup(singleProduct));
  const [sku, setSku] = useState(vars[0]);
  const handleGroup = (idx) => {
    setGroup(singleProduct.imageGroup[idx]);
  };
  const router = useRouter();

  const handleVars = (idx) => {
    setSku(vars[idx]);
  };

  useEffect(() => {
    if (group) {
      const varsBasedOnGroup = singleProduct.vars.filter(
        (itemVar) => itemVar.imageGroupId.toString() === group.id,
      );
      setVars(varsBasedOnGroup);
      setSku(0);
    }
  }, [group]);

  useEffect(() => {
    setGroup(singleProduct.imageGroup[0]);
    setVars(() => setVarsBasedOnImgGroup(singleProduct));
    const [initialsku] = setVarsBasedOnImgGroup(singleProduct);
    setSku(initialsku);
  }, [singleProduct]);

  return (
    <>
      <Box>
        {
        group && (
          <>
            <SlidePreview
              images={group.images}
              alt={group.color ? group.color.name : 'Undefined'}
            />
            <div className={styles.product_content}>
              <div className={styles.group_wrap}>
                <div className={styles.group_name}>
                  <p>
                    Cor:
                    <span>{group.color ? group.color.name : 'Undefined'}</span>
                  </p>
                </div>
                <div className={styles.group_item}>
                  {
            singleProduct.imageGroup.map((item, idx) => (
              <div>
                <style jsx>
                  {`
                .btn_color {
                  background-color: ${item.color ? item.color.code : '#000'};
                }
              `}
                </style>
                <button type="button" className="btn_color" onClick={() => handleGroup(idx)} />
              </div>
            ))
          }
                </div>
                <div className={styles.group_name}>
                  <p>
                    Tamanho:
                    <span>{sku.size}</span>
                  </p>
                </div>
                <div className={styles.group_item}>
                  {
            vars.map((itemSku, idx) => (
              <div>
                <button type="button" onClick={() => handleVars(idx)}>{itemSku.size}</button>
              </div>
            ))
          }
                </div>
              </div>
            </div>
            <Box marginTop={2} display="flex" justifyContent="center">
              <Button type="button" variant="contained" onClick={() => handleEditGroup(group)}>Editar Grupo</Button>
            </Box>
            <Box display="flex" justifyContent="center" style={{ padding: '1rem 0' }}>
              <Button type="button" variant="contained" color="primary" onClick={() => router.push(`/dashboard/products/create/group?bid=${bid}&pid=${pid}`)}>Adicionar Novas Cores / Variáveis</Button>
            </Box>
          </>
        )
      }
      </Box>
    </>
  );
};

const CustomSwitch = (props) => {
  const [field] = useField({
    name: props.name,
    value: props.value,
    type: 'checkbox',
  });

  return (
    <FormControlLabel
      control={<Switch {...props} {...field} />}
      label={props.label}
    />
  );
};

export default function EditProduct() {
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    public: false,
  });
  const router = useRouter();
  const { query: { bid, pid } } = useRouter();
  const { isUser, user, setUser } = useAuthUser();
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [imgGroup, setImgGroup] = useState([{
    id: '',
    color: {
      name: '',
      code: '',
    },
    images: [],
  }]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imgGroupIdx, setImgGroupIdx] = useState(0);

  const { api } = authApi();

  const classes = useStyles();

  const handleEditGroup = (group) => {
    const gid = editingProduct.imageGroup.findIndex((item) => group.id === item.id);
    router.push(`/dashboard/products/editgroup?bid=${bid}&pid=${pid}&gid=${gid}`);
  };

  const handleBack = () => {
    router.push(`/dashboard/products?bid=${bid}`);
  };

  const handleSubmit = async (values) => {
    const priceNumber = values.price ? values.price.toString().replace(',', '.') : null;
    const salePriceNumber = values.salePrice ? values.salePrice.toString().replace(',', '.') : null;
    const data = {
      ...editingProduct,
      name: values.name,
      description: values.description,
      price: { original: priceNumber, sale: salePriceNumber },
      public: values.public,
      imageGroup: imgGroup,
    };

    try {
      const result = await api(
        'PATCH',
        `/product/${editingBusiness.businessName}/update/content/${editingProduct._id}`,
        { productNewData: data },
      );
      setInitialValues({
        name: result.data.name,
        description: result.data.description,
        price: result.data.price.original,
        salePrice: result.data.price.sale,
        public: result.data.public || false,
      });
      setImgGroup(result.data.imageGroup);
      setEditingProduct(result.data);
      const bToEdit = {
        ...editingBusiness,
      };
      bToEdit.productsData[pid] = result.data;

      const uToEdit = {
        ...user,
      };
      uToEdit.business[bid] = bToEdit;

      setUser({
        ...uToEdit,
      });
      router.push(`/dashboard/products?bid=${bid}`);
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  useEffect(() => {
    const bToEdit = isUser && user.business[bid];
    bToEdit && setEditingBusiness(bToEdit);
    bToEdit && setInitialValues({
      name: bToEdit.productsData[pid].name,
      description: bToEdit.productsData[pid].description,
      price: bToEdit.productsData[pid].price.original,
      salePrice: bToEdit.productsData[pid].price.sale,
      public: bToEdit.productsData[pid].public || false,
    // category: [''],
    });
    bToEdit && setImgGroup(bToEdit.productsData[pid].imageGroup);
    bToEdit && setEditingProduct(bToEdit.productsData[pid]);
  }, [isUser, user]);

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            Editar Produto
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        {
          // imgGroup[0].images.length > 0 && (
          //   <SlidePreview
          //     images={imgGroup[imgGroupIdx].images}
          //     alt={imgGroup[imgGroupIdx].color.name}
          //   />
          // )
        }
        {
          editingProduct && (
          <ImageGroupControll
            singleProduct={editingProduct}
            handleEditGroup={handleEditGroup}
            pid={pid}
            bid={bid}
          />
          )
        }

        <Formik
          validationSchema={
            object({
              name: mixed().when('public', {
                is: true,
                then: string().required('Nome é Obrigatório').max(60, 'Máximo 60 caractéres'),
              }),
              price: mixed().when('public', {
                is: true,
                then: number().required('Preco é obrigatório'),
              }),
            })
          }
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values) => handleSubmit(values)}
        >
          {
                  ({ touched, errors}) => (

                    <Form>
                      <Paper>
                        <Box padding={2}>
                          <FormGroup>
                            <Field
                              name="name"
                              as={TextField}
                              label="Nome do Produto"
                              error={touched && errors.name}
                              helperText={(touched && errors.name) && errors.name}
                            />
                          </FormGroup>
                          <Box marginTop={2}>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Field
                                  name="price"
                                  as={TextField}
                                  label="Preço"
                                  type="number"
                                  error={touched && errors.price}
                                  helperText={(touched && errors.price) && errors.price}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  name="salePrice"
                                  as={TextField}
                                  label="Preço Promocional"
                                  type="number"
                                  error={touched && errors.salePrice}
                                  helperText={(touched && errors.salePrice) && errors.salePrice}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                          {/* <Box marginTop={2}>
                        <FormGroup>
                          <Field
                            name="category"
                            as={TextField}
                            label="Categoria"
                          />
                        </FormGroup>
                      </Box> */}
                          <Box marginTop={2}>
                            <FormGroup>
                              <Field
                                name="description"
                                as={TextField}
                                label="Descrição"
                                multiline
                                rows={6}
                              />
                            </FormGroup>
                          </Box>
                        </Box>
                      </Paper>
                      <Box marginTop={2}>
                        <Paper>
                          <Box padding={2} display="flex" justifyContent="center">
                            <FormGroup>
                              <FormControl component="fieldset">
                                <FormGroup aria-label="position" row>
                                  <CustomSwitch
                                    name="public"
                                    label="Exibir Produto Na Loja Online"
                                    color="primary"
                                  />
                                </FormGroup>
                              </FormControl>
                            </FormGroup>
                          </Box>
                          <Box padding={2}>
                            <FormGroup>
                              <Button type="submit" variant="contained" color="primary">Salvar</Button>
                            </FormGroup>
                          </Box>
                        </Paper>
                      </Box>
                    </Form>

                  )
                }
        </Formik>

      </Container>
    </>
  );
}
