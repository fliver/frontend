import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: `${config.domain}/api`,
});

export default api;
