import { createContext, useState, useEffect } from 'react';

export const BusinessContext = createContext();

const BusinessContextProvider = (props) => {
  const [business, setBusiness] = useState({});

  useEffect(() => {
    const localStorageBusiness = localStorage.getItem('business');
    return localStorageBusiness && setBusiness(JSON.parse(localStorageBusiness));
  }, []);

  useEffect(() => {
    localStorage.setItem('business', JSON.stringify(business));
  }, [business]);

  return (
    <BusinessContext.Provider value={{ business, setBusiness }}>
      {props.children}
    </BusinessContext.Provider>
  );
};

export default BusinessContextProvider;
