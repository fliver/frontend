import styles from './Header.module.css';
import config from '../../src/config';

const Header = ({ account }) => (
  <header className={styles.container}>
    <div className={styles.wrap}>
      <div className={styles.logo}>
        <img src={`${config.domain}/static/${account.logo}`} width="100px" height="100px" alt={`logo ${account.businessName}`} />
      </div>
      <div className={styles.title}>
        <h1>{account.displayName}</h1>
      </div>
    </div>
  </header>
);

export default Header;
