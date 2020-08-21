import { createContext, useState, useEffect } from 'react';

export const FilterContext = createContext();

const FilterContextProvider = ({ children }) => {
  const [searchChip, setSearchChip] = useState(false);
  return (
    <FilterContext.Provider value={{}}>
      {children}
    </FilterContext.Provider>
  )
};

export default FilterContextProvider;
