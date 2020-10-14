import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Button, List, ListItem, Typography,
} from '@material-ui/core';

import MuiLink from '../../../../src/Link';
import useAuthUser from '../../../../src/hooks/useAuthUser';
import authApi from '../../../../src/services/api/authApi';
import config from '../../../../src/config'

export default function ProductsHome() {
  const router = useRouter();
  const { query: { bid } } = useRouter();
  const { isUser, user, setUser } = useAuthUser();
  const [editingBusiness, setEditingBusiness] = useState(null);

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
        console.log(error);
      }
    }
    bToEdit && !bToEdit.productsData && fetchData();
  }, [isUser, user]);

  return (
    <div>
      {
        editingBusiness && (
          <Button variant="contained" color="secondary" component={MuiLink} naked href={`/dashboard/products/create?bn=${editingBusiness.businessName}&bid=${bid}`}>
            Criar Produto
          </Button>
        )
      }
      <List>
        {
          editingBusiness && editingBusiness.productsData.map((product, idx) => (
            <div key={product._id}>
              <Link href={`/dashboard/products/edit?bid=${bid}&pid=${idx}`}>
                <ListItem>
                  <img
                    src={`${config.domain}/static/${product.imageGroup[0].images[0]}`}
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
    </div>
  );
}
