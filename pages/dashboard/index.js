import { useEffect, useState } from 'react';
import Router from 'next/router';
import DashboardHome from '../../components/Templates/Dashboard/DashboardHome';
import authApi from '../../src/services/api/authApi';

const DashboardPage = () => {
  const { api } = authApi()
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api('GET', 'user/profile');
        response && setData(response.data);
      } catch (error) {
        Router.replace('/login');
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {data && <DashboardHome data={data} />}
    </>
  );
};

export default DashboardPage;
