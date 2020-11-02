import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Button, List, ListItem, Typography, Container, FormGroup, Paper, Box,
} from '@material-ui/core';

import MuiLink from '../../../../src/Link';
import useAuthUser from '../../../../src/hooks/useAuthUser';
import authApi from '../../../../src/services/api/authApi';
import config from '../../../../src/config';
import NavBarDashBoard from '../../../NavBarDashBoard';

export default function ProductsHome() {
  const { query: { bid } } = useRouter();
  const { isUser, user, setUser } = useAuthUser();
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [productsStatus, setProductsStatus] = useState({
    total: 0,
    truePublic: 0,
    falsePublic: 0,
  });

  const { api } = authApi();

  useEffect(() => {
    const bToEdit = isUser && user.business[bid];
    bToEdit && bToEdit.productsData && setEditingBusiness(bToEdit);
    async function fetchData() {
      try {
        const result = await api('POST', `/product/${bToEdit.businessName}/all`, { pids: bToEdit.products });
        bToEdit.productsData = result.data;
        const businessList = user.business;
        businessList[bid] = bToEdit;
        setUser({
          ...user,
          business: businessList,
        });

        setEditingBusiness(bToEdit);
      } catch (error) {
        console.log(error.response)
        // throw new Error(error);
      }
    }
    bToEdit && !bToEdit.productsData && fetchData();
  }, [isUser, user]);

  useEffect(() => {
    if (editingBusiness) {
      const status = editingBusiness.productsData.reduce((acc, item) => {
        acc.total += 1;
        item.public === true ? acc.truePublic += 1 : acc.falsePublic += 1;
        return acc;
      }, { total: 0, truePublic: 0, falsePublic: 0 });

      const { total, truePublic, falsePublic } = status;

      setProductsStatus({
        total,
        truePublic,
        falsePublic,
      });
    }
  }, [editingBusiness]);

  return (
    <div>
      <NavBarDashBoard backUrl={`/dashboard/manager?bid=${bid}`} title="Produtos" />
      <Container>
        <Paper>
          <Box padding={4}>
            <Typography variant="h6" component="h6">Status dos Produtos</Typography>
            <Typography variant="subtitle1" component="h6">{`Total de Produtos: ${productsStatus.total}`}</Typography>
            <Typography variant="subtitle1" component="h6">{`Produtos Online: ${productsStatus.truePublic}`}</Typography>
            <Typography variant="subtitle1" component="h6">{`Produtos Não Publicados: ${productsStatus.falsePublic}`}</Typography>
          </Box>
        </Paper>
        {
        editingBusiness && (
          <Box m={4}>
            <FormGroup>
              <Button variant="contained" color="primary" component={MuiLink} naked href={`/dashboard/products/create?bn=${editingBusiness.businessName}&bid=${bid}`}>
                Criar Novo Produto
              </Button>
            </FormGroup>
          </Box>
        )
      }
        <List>
          {
          editingBusiness && editingBusiness.productsData.map((product, idx) => (
            <div key={product._id}>
              <Link href={`/dashboard/products/edit?bid=${bid}&pid=${idx}`}>
                <ListItem>
                  <img
                    src={`${config.mediaURL}/${product.imageGroup[0].images[0]}`}
                    alt="teste"
                    width="60px"
                  />
                  <Typography variant="subtitle2" component="h3">{product.name}</Typography>
                  {/* <div>
                    <Typography variant="subtitle2" component="h3">R$ 49,90</Typography>
                    <Typography variant="subtitle2" component="h3">R$ 29,90</Typography>
                  </div> */}
                </ListItem>
              </Link>
            </div>
          ))
        }
        </List>
      </Container>
    </div>
  );
}
