import Head from 'next/head';
import config from '../../src/config';

const CustomHead = (
  {
    title,
    description,
    canonicalURL,
    ogURL,
    ogTitle,
    ogDescription,
    ogImage,
  },
) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link href={`${config.domain}/${canonicalURL}`} rel="canonical" />

    <meta property="og:title" content={ogTitle} />
    <meta property="og:url" content={`${config.domain}/${ogURL}`} />
    <meta property="og:description" content={ogDescription} />
    <meta property="og:image" content={`${config.mediaURL}/${ogImage}`} />
  </Head>
);

export default CustomHead;
