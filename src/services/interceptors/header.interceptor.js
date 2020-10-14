export default async (config) => {
  const token = localStorage.getItem('token');

  if (token) {
    const tokenJson = JSON.parse(token);
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${tokenJson}`;
  }

  return config;
};
