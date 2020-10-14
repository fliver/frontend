import { useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
import {
  Formik, Form, Field, useField,
} from 'formik';
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

const ImageGroupControll = () => {
  const [group, setGroup] = useState();

  return (
    <>
      <div className={styles.product_content}>
        <div className={styles.group_wrap}>
          <div className={styles.group_name}>
            <p>
              Cor:
              <span>{group.color.name}</span>
            </p>
          </div>
          <div className={styles.group_item}>
            {
            singleProduct.imageGroup.map((item, idx) => (
              <div>
                <style jsx>
                  {`
                .btn_color {
                  background-color: ${item.color.code};
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

  const handleBack = () => {
    router.push(`/dashboard/products?bid=${bid}`);
  };

  const handleSubmit = async (values) => {
    const data = {
      ...editingProduct,
      name: values.name,
      description: values.description,
      price: { original: values.price, sale: values.salePrice },
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
    } catch (error) {
      console.log('error', error);
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
          imgGroup[0].images.length > 0 && (
            <SlidePreview
              images={imgGroup[imgGroupIdx].images}
              alt={imgGroup[imgGroupIdx].color.name}
            />
          )
        }

        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values) => handleSubmit(values)}
        >
          {
                  () => (

                    <Form>
                      <Paper>
                        <Box padding={2}>
                          <FormGroup>
                            <Field
                              name="name"
                              as={TextField}
                              label="Nome do Produto"
                            />
                          </FormGroup>
                          <Box marginTop={2}>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Field
                                  name="price"
                                  as={TextField}
                                  label="Preço"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  name="salePrice"
                                  as={TextField}
                                  label="Preço Promocional"
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
