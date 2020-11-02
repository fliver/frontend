import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Container, Box, Typography, AppBar, Toolbar, IconButton,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ShareIcon from '@material-ui/icons/Share';
import { useRouter } from 'next/router';

import imageCompression from 'browser-image-compression';

import authApi from '../../src/services/api/authApi';

import config from '../../src/config';
import useAuthUser from '../../src/hooks/useAuthUser';
import NavVarDashBoard from '../../components/NavBarDashBoard';

const useStyles = makeStyles({
  body: {
    margin: '4.5rem 0 2rem 0',
  },
  root: {
    width: '96%',
    margin: '0 auto',
  },
  warning: {
    color: 'red',
    fontWeight: '600',
    margin: '0.6rem 0',
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      width: '10rem',
      height: '10rem',
      borderRadius: '50%',
    },
    '& input': {
      display: 'none',
    },
    '& label': {
      display: 'flex',
      margin: '1rem',
      borderBottom: '1px solid black',
      fontSize: '1rem',
    },
  },
});

export default function BusinessManager() {
  const { query: { bid } } = useRouter();
  const router = useRouter();
  const { isUser, user, setUser } = useAuthUser();
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [warning, setWarning] = useState({
    avatar: null,
    basic: null,
    registration: null,
    shipping: null,
  });

  useEffect(() => {
    const bToEdit = isUser && user.business[bid];
    let {
      avatar, basic, registration, shipping,
    } = warning;
    bToEdit && setEditingBusiness(bToEdit);

    bToEdit && (

      !bToEdit.address.CEP
        ? registration = '* Configure o CEP'
        : registration = null,

      !bToEdit.logo
        ? avatar = '* Atualize o logo'
        : avatar = null,

      !bToEdit.whatsapp
        ? basic = '* Configure o Whatsapp'
        : basic = null,

      !bToEdit.pickup && !bToEdit.shipping.thirdParty
        ? shipping = '* Configure Entrega e/ou Retirada'
        : shipping = null,

      setWarning({
        ...warning,
        avatar,
        basic,
        registration,
        shipping,
      })

    );
  }, [isUser, user]);

  const { api } = authApi();

  const classes = useStyles();

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleAvatar = async (e) => {
    let compressedFile;

    const imageFile = e.target.files[0];

    const options = {
      maxSizeMB: 0.200,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    };
    try {
      compressedFile = await imageCompression(imageFile, options);
    } catch (error) {
      return { error };
    }

    const imgData = new FormData();
    imgData.append('avatar', compressedFile);

    try {
      const result = await api('PATCH', `/business/${editingBusiness.businessName}/update/avatar`, imgData);
      if (result.status === 200) {
        const userToUpdate = {
          ...user,
        };
        userToUpdate.business[bid] = result.data;
        setUser(userToUpdate);
      }
    } catch (error) {
      console.log(error)
      // throw new Error(error.response);
    }
  };

  return (
    <>
      <NavVarDashBoard backUrl="/dashboard" title="Gerenciar Loja" />
      <Container className={classes.body}>
        <Box>
          <div className={classes.logo}>
            {editingBusiness && !warning.avatar && <img src={`${config.mediaURL}/${editingBusiness.logo}`} alt={`logo ${editingBusiness.businessName}`} />}
            {warning.avatar && <p className={classes.warning}>{warning.avatar}</p>}
            {warning.avatar && <p>Formato: quadrado</p>}
            <label htmlFor="logo">
              Atualizar Logo
              <Box marginLeft={1}>
                <PhotoCameraIcon />
              </Box>
              <input type="file" id="logo" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp" onChange={handleAvatar} />
            </label>
          </div>
        </Box>
        <Box m={2}>
          <Paper>
            <MenuList>
              <div>
                <Link href={`/dashboard/products?bid=${bid}`}>
                  <MenuItem className={classes.menuItem}>
                    <Typography variant="inherit">Editar Produtos </Typography>
                    <NavigateNextIcon fontSize="large" color="action" />
                  </MenuItem>
                </Link>
              </div>
            </MenuList>
          </Paper>
        </Box>
        <div>
          <Box m={2}>
            <Typography variant="subtitle2" component="h3">
              Configurações da Loja
            </Typography>
          </Box>

          <Paper className={classes.root}>
            <MenuList>
              <div>
                <Link href={`/dashboard/edit?el=basic&bid=${bid}`}>
                  <MenuItem className={classes.menuItem}>
                    <div>
                      {warning.basic && <p className={classes.warning}>{warning.basic}</p>}
                      <Typography variant="inherit">Informações Gerais</Typography>
                    </div>
                    <NavigateNextIcon fontSize="large" color="action" />
                  </MenuItem>
                </Link>
              </div>
              <div>
                <Link href={`/dashboard/edit?el=registration&bid=${bid}`}>
                  <MenuItem className={classes.menuItem}>
                    <div>
                      {warning.registration
                      && <p className={classes.warning}>{warning.registration}</p>}
                      <Typography variant="inherit">Cadastro</Typography>
                    </div>
                    <NavigateNextIcon fontSize="large" color="action" />
                  </MenuItem>
                </Link>
              </div>
              <div>
                <Link href={`/dashboard/edit?el=shipping&bid=${bid}`}>
                  <MenuItem className={classes.menuItem}>
                    <div>
                      {warning.shipping && <p className={classes.warning}>{warning.shipping}</p>}
                      <Typography variant="inherit">Entrega e Retirada</Typography>
                    </div>
                    <NavigateNextIcon fontSize="large" color="action" />
                  </MenuItem>
                </Link>
              </div>
            </MenuList>
          </Paper>

        </div>

        <div>
          <Box m={2}>
            <Typography variant="subtitle2" component="h3">
              Compartilhe a sua loja
            </Typography>
          </Box>

          <Paper className={classes.root}>
            <MenuList>
              <div>
                <MenuItem className={classes.menuItem}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="inherit">O endereço de sua loja é:</Typography>
                    {editingBusiness && (
                      <>
                        <button type="button" onClick={() => router.push(`/${editingBusiness.businessName}`)}>
                          <Typography variant="subtitle2">{`www.fliver.app/${editingBusiness.businessName}`}</Typography>
                        </button>
                      </>
                    )}
                  </div>
                  {/* <ShareIcon fontSize="large" color="action" /> */}
                </MenuItem>
              </div>
            </MenuList>
          </Paper>
        </div>
      </Container>
    </>
  );
}
