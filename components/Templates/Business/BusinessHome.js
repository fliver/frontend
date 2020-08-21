import { useState, useEffect } from 'react';
import Router from 'next/router';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from '../../Header/Header';
import FilterSection from '../../Filter/FilterSection';
import NavBar from '../../NavBar/NavBar';
import ProductFeed from '../../ProductFeed/ProductFeed';
import CustomHead from '../../CustomHead/CustomHead';

export default function BusinessHome({ data, ...rest }) {
  const { account, products } = data;
  const [displayChip, setDisplayChip] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [productsList, setProductsList] = useState(products);

  const handleSearch = (searchParams) => {
    if (searchParams !== undefined) {
      const regexToMatch = searchParams.split(' ').join('|').trim();
      const newRegex = new RegExp(regexToMatch, 'ig');
      const filteredFeed = products.filter((product) => product.name.match(newRegex));
      setProductsList(filteredFeed);
      setDisplayChip(true);
      setSearchValue(searchParams);
    }
  };

  const clearFilter = () => {
    setDisplayChip(false);
    setProductsList(products);
  };

  useEffect(() => {
    if (rest.search !== '' && rest.search !== undefined) {
      handleSearch(rest.search);
      Router.push(
        `/[home]?search=${rest.search}`,
        `/${account.businessName}?search=${rest.search}`,
        { shallow: true },
      );
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" disableGutters>
        <CustomHead
          title={account.displayName}
          description={account.about}
          canonicalURL={account.businessName}
          ogURL={account.businessName}
          ogTitle={account.displayName}
          ogDescription={account.about}
          ogImage={account.logo}
        />
        <NavBar />
        <Header account={account} />
        <FilterSection
          search={handleSearch}
          clearFilter={clearFilter}
          displayChip={displayChip}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <ProductFeed account={account} products={productsList} />
      </Container>
    </>
  );
}
