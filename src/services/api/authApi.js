import axios from 'axios';
import { useCallback } from 'react';
import Router from 'next/router';
import apiDomain from '../../config';

const authApi = () => {
  // const router = useRouter();
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
        url: `${apiDomain.api}/${url}`,
        data: data && data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result;
    } catch (error) {
      if (error.response.data.status === 401) {
        Router.push('/login');
      } else {
        throw new Error(`${error.response.data.message}`);
      }
    }
  };

  return {
    api,
  };
};

export default authApi;
