import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
export const AuthAdmContext = createContext();

const UserAdmContextProvider = (props) => {
  const [user, setUser] = useState({});
  const router = useRouter();
  // const [selectedShipping, setSelectedShipping] = useState();

  useEffect(() => {
    const userLocalStorage = localStorage.getItem('ua');
    return userLocalStorage && setUser(JSON.parse(userLocalStorage));
  }, []);

  useEffect(() => {
    localStorage.setItem('ua', JSON.stringify(user));
  }, [user]);

  const logout = () => {
    localStorage.removeItem('ua');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthAdmContext.Provider value={{ user, setUser, logout }}>
      {props.children}
    </AuthAdmContext.Provider>
  );
};

export default UserAdmContextProvider;
