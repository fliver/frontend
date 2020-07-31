import Router from 'next/router'
import BusinessHome from '../../components/Templates/Business/BusinessHome'
import ProductHome from '../../components/Templates/Business/ProductHome'
import UserHome from '../../components/Templates/User/UserHome'

const HomePage = ({ data, homepageSlug }) => {
  if(!data.account) return <h1>404</h1>

  const { accountType } = data.account

  if (accountType === 'business') return <BusinessHome data={data}/>

  if (accountType === 'user') return <UserHome data={data}/>
  
}



export async function getServerSideProps({ query }) {

  const { home } = query

  const res = await fetch(`http://localhost:5000/api/account/${home}`);
  const data = await res.json()

  return {
    props: {
      data,
    }
  }
}

export default HomePage