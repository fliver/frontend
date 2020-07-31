import Router from 'next/router'
import BusinessHome from '../components/Templates/Business/BusinessHome'
import ProductHome from '../components/Templates/Business/ProductHome'
import UserHome from '../components/Templates/User/UserHome'

const HomePage = ({ data, slug }) => {
  if(!data.account) return <h1>404</h1>

  const { accountType } = data.account

  if (slug.length === 1 && accountType === 'business') return <BusinessHome data={data}/>

  if (slug.length === 1 && accountType === 'user') return <UserHome data={data}/>
  
  if (slug.length > 1) return <ProductHome data={data} slug={slug}/>
}

export async function getServerSideProps({ query }) {
  const { slug } = query;

  const res = await fetch(`http://localhost:5000/api/account/${slug[0]}`);
  const data = await res.json()

  return {
    props: {
      data,
      slug,
    }
  }
}

export default HomePage