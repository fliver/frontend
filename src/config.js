const env = {
  mediaURL: 'prod',
  api: 'prod',
  domain: 'dev',
};

const variants = {
  dev: {
    mediaURL: 'http://localhost:5000/static',
    api: 'http://localhost:5000/api',
    domain: 'http://localhost:3000',
  },
  prod: {
    mediaURL: 'https://fliver-app.s3.amazonaws.com',
    api: 'https://fliver.herokuapp.com/api',
    domain: 'https://fliver.app',
  },
};

const configVariants = {
  mediaURL: variants[env.mediaURL].mediaURL,
  api: variants[env.api].api,
  domain: variants[env.domain].domain,
};

export default configVariants;
