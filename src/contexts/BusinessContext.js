import { createContext, useState } from 'react';

export const BusinessContext = createContext();

const BusinessContextProvider = (props) => {
  const [business, setBusiness] = useState();

  return (
    <BusinessContext.Provider value={{ business }}>
      {props.children}
    </BusinessContext.Provider>
  );
};

export default BusinessContextProvider;
