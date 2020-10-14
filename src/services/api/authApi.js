import axios from 'axios';
import { useCallback } from 'react';
import apiDomain from '../../config';

const authApi = () => {
  const getToken = useCallback(() => {
    const localToken = localStorage.getItem('token');
    if (!localToken) throw new Error('Token is missing');
    const parsedToken = JSON.parse(localToken);
    return parsedToken;
  });

  const api = async (method, url, data) => {
    try {
      const token = getToken();
      const result = await axios({
        method,
        url: `${apiDomain.domain}/api/${url}`,
        data: data && data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result;
    } catch (error) {
      console.log('api error', error.response)
      throw new Error(`${error.response.data.message}`);
    }
  };

  return {
    api,
  };
};

export default authApi;
