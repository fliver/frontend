import { useContext, useState, useEffect } from 'react';
import { AuthAdmContext } from '../contexts/AuthAdmContext';
import isEmptyObject from '../utils/isEmptyObject';

const useAuthUser = () => {
  const [checkUser, setCheckUser] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const { user, setUser, logout } = useContext(AuthAdmContext);

  useEffect(() => {
    !isEmptyObject(user) && setIsUser(true);
  }, [user, checkUser]);

  return {
    user,
    setUser,
    isUser,
    setCheckUser,
    logout,
  };
};

export default useAuthUser;
