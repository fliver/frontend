import { useState, useEffect } from 'react';

const useToken = () => {
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [checkToken, setCheckToken] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (!localToken) throw new Error('Token is missing');
    const parsedToken = JSON.parse(localToken);
    setToken(parsedToken);
    setIsTokenReady(true);
  }, [checkToken]);

  function getToken() {
    setCheckToken(true);
    if (isTokenReady && token) {
      return { status: 'ok', token };
    }
    return { status: 'not-found' };
  }

  return {
    getToken,
  };
};

export default useToken;
