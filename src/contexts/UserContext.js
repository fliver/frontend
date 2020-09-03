import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [user, setUser] = useState({});
  // const [selectedShipping, setSelectedShipping] = useState();

  useEffect(() => {
    const userLocalStorage = localStorage.getItem('user');
    return userLocalStorage && setUser(JSON.parse(userLocalStorage));
  }, []);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
