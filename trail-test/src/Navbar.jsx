import { useState } from 'react'
import styles from './css/Navbar.module.css';
import { Button } from "react-bootstrap";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function Navbar() {
  // adding the states 
  const [isActive, setIsActive] = useState(false);
  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };
  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false)
  }

  const logout = () => {
    // destroy the cookie
    cookies.remove("SESSION_TOKEN", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  }

  return (
    <div className="App">
      <header className="App-header">
        <nav className={`${styles.navbar}`}>
          {/* logo */}
          {/*<a href='/' className={`${styles.logo}`}>LOGO </a>*/}
          <img referrerPolicy="no-referrer" src='https://liquipedia.net/commons/images/1/1a/Brawl_Hank.png' width={100} height={100} />
          <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
            <li onClick={removeActive}>
              <a href='/' className={`${styles.navLink}`}>Home</a>
            </li>
            <li onClick={removeActive}>
              <a href='#user' className={`${styles.navLink}`}>User</a>
            </li>
            <li onClick={removeActive}>
              <Button type="submit" variant="danger" onClick={() => logout()}>
                Logout
              </Button>
            </li>
          </ul>
          <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`} onClick={toggleActiveClass}>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
          </div>
        </nav>
      </header>
    </div>
  );
}
export default Navbar;