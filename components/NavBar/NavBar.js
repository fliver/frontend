import Router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import ShareIcon from '@material-ui/icons/Share';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { useState, useContext } from 'react';
import { CartContext } from '../../src/contexts/CartContext';

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
  // title: {
  //   display: 'block',
  //   cursor: 'pointer',
  // },
  sectionIconButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '20px',
  },
  nav: {
    boxShadow: '0 0',
    borderBottom: 'solid 1px #cacaca',
  },
}));

const NavBar = (props) => {
  const { totalUnits } = useContext(CartContext);
  const classes = useStyles();

  const goHome = () => {
    Router.push('/[home]', '/amaro');
  };

  const displayShoppingCard = () => {
    Router.push('/[home]/cart', '/amaro/cart');
  };

  const getTotalProducts = () => {
  
  }

  return (
    <div className={classes.grow}>
      <AppBar position="relative" className={classes.nav}>
        <Toolbar className={classes.sectionIconButton} disableGutters>

          {/* <IconButton
                aria-label="account of current user"
                color="inherit"
              >
                <AccountCircle />
              </IconButton> */}
          {
             props.backButton
             && (
               <>
                 <IconButton aria-label="back" color="inherit" onClick={goHome}>
                   <ArrowBackIcon />
                 </IconButton>
                 <Typography variant="h6" noWrap onClick={goHome}>
                   { props.account.displayName }
                 </Typography>
               </>
             )
            }
          <div className={classes.grow} />

          <IconButton edge="end" aria-label="Carrinho de compra" color="inherit" onClick={displayShoppingCard}>
            <Badge badgeContent={totalUnits} color="secondary">
              <LocalMallIcon />
            </Badge>
          </IconButton>

        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
