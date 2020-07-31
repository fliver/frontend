import Link from 'next/link'
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    width: '49%',
    height: 'auto',
    
    title: {
      color: 'red'
    }
  },
  MuiCardHeader: {
    color: 'red'
  },
  media: {
    width: '100%',
    height: 'auto',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  cart: {
    marginLeft: 'auto'
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function BusinessHome({ data }) {
  const { products, account } = data;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMainProductImage = (product) => {
    const group = product.imageGroup.filter(group => group.id === product.vars[0].imageGroupId)
    return `http://localhost:5000/static/${group[0].images[0]}`;
  }
  
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" disableGutters={true}>
  
        
      <div className={classes.root}>
        {products.map(product => (
      <Card  key={product._id} className={classes.card}>
      <CardHeader
        title={
          <Typography color="textPrimary" component='h2'>
            {product.name}
          </Typography>
        }
        // subheader={`de R$${product.price.original} por R$${product.price.sale}`}
      />
      <Link href={`/[home]/[urlSEO]/[productid]`} as={`/${account.businessName}/nome-para-seo/${product._id}`}>
      <a>
      <CardMedia
        className={classes.media}
        component='img'
        // image='http://localhost:5000/static/eSkxYfaPx/products/a1cd191be124759a4b1c-fv-g01-azul-03.jpeg'
        image={handleMainProductImage(product)}
        title={product.name}
      />
      </a>
      </Link>
      
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {/* {`${product.description.slice(0, 60)}...`} */}
          {`de R$${product.price.original} por R$${product.price.sale}`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="add to cart" className={classes.cart}>
          <AddShoppingCartIcon />
        </IconButton>
      </CardActions>
    </Card>
  ))}
  </div>

      </Container>
    </React.Fragment>
  );
}
