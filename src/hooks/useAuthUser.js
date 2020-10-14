import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import isEmptyObject from '../utils/isEmptyObject';

const useAuthUser = () => {
  const [checkUser, setCheckUser] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    !isEmptyObject(user) && setIsUser(true);
  }, [user, checkUser]);

  return {
    user,
    setUser,
    isUser,
    setCheckUser,
  };
};

export default useAuthUser;
