import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Link from 'next/link';

const useStyles = makeStyles({
  root: {
    width: '96%',
    margin: '0 auto',
  },

  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default function TypographyMenu({ list }) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <MenuList>
        {
          list.map((item, idx) => (
            <div key={item._id}>
              <Link href={`/dashboard/manager?bid=${idx}`}>
                <MenuItem className={classes.menuItem}>
                  <Typography variant="inherit">{item.businessName}</Typography>
                  <NavigateNextIcon fontSize="large" color="action" />
                </MenuItem>
              </Link>
            </div>
          ))
        }
      </MenuList>
    </Paper>
  );
}
