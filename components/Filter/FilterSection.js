import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchIcon from '@material-ui/icons/Search';
import styles from './FilterSection.module.css';

const FilterSection = (
  {
    search,
    clearFilter,
    displayChip,
    searchValue,
    setSearchValue,
  },
) => {
  const [searchField, setSearchField] = useState(searchValue);
  const router = useRouter();
  const handleSearch = () => {
    setSearchValue(searchField);
    search(searchField);
  };

  useEffect(() => {
    const address = {
      url: '/[home]',
      as: '/amaro',
    };

    if (searchValue !== '') {
      address.url = `/[home]?search=${searchValue}`;
      address.as = `/amaro?search=${searchValue}`;
      setSearchField(searchValue);
    } else {
      address.url = '/[home]';
      address.as = '/amaro';
    }

    router.push(`${address.url}`, `${address.as}`, { shallow: true });
  }, [searchValue]);

  const clearSearch = () => {
    setSearchValue('');
    setSearchField('');
    clearFilter();
  };

  return (
    <div>
      {/* <section className={styles.container}>
        <ul className={styles.no_render_scroll}>
          <li className={
            `${!displayChip ? styles.displayTrue : styles.displayFalse} ${styles.btn_active}`}>
            <button type="button">TUDO</button>
          </li>
          <li>
            <button type="button">Menor Preço</button>
          </li>
          <li>
            <button type="button">Maior Preço</button>
          </li>
          <li>
            <button type="button">Cor: TODAS</button>
          </li>
          <li>
            <button type="button">Tamanho: TODOS</button>
          </li>
          <li>
            <button type="button">Vestido</button>
          </li>
          <li>
            <button type="button">Saias</button>
          </li>
          <li>
            <button type="button">Calças</button>
          </li>
          <li>
            <button type="button">Camisetas</button>
          </li>
          <li>
            <button type="button">Blusas</button>
          </li>
        </ul>
      </section> */}
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Buscar"
          name="search"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button type="button" className={displayChip ? styles.displayTrue : styles.displayFalse} onClick={clearSearch}>x</button>
        <button type="button" onClick={handleSearch}><SearchIcon /></button>

      </div>
    </div>
  );
};

export default FilterSection;
