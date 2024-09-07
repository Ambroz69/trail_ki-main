import { useState } from 'react'
import styles from './css/Navbar.module.css';
import { Button } from "react-bootstrap";
import Cookies from "universal-cookie";

// svg import
import sidebar_dashboard from "./assets/sidebar_dashboard.svg";
import sidebar_faq from "./assets/sidebar_faq.svg";
import sidebar_home from "./assets/sidebar_home.svg";
import sidebar_logo from "./assets/sidebar_logo.svg";
import sidebar_logout from "./assets/sidebar_logout.svg";
import sidebar_submenu from "./assets/sidebar_submenu.svg";
import sidebar_profile from "./assets/sidebar_profile.svg";

const cookies = new Cookies();
//const token = cookies.get("SESSION_TOKEN");

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

  const [token, setToken] = useState(cookies.get("SESSION_TOKEN"));

  return (
    <div className={`${styles.sidebar} d-flex flex-column flex-shrink-0 p-3 mx-0 px-0 pt-4`}>
      <a href="/" className="d-flex justify-content-center pt-3 pb-4">
        <img src={sidebar_logo} alt="sidebar_logo" />
      </a>
      <ul className="nav nav-pills flex-column mb-auto mx-4">
        <li className="nav-item pb-2">
          <a href="/" className={`${styles.sidebar_link} nav-link d-flex`} aria-current="page">
            <img src={sidebar_home} alt='sidebar_home' className='pe-2' />
            Home
          </a>
        </li>
        <li>
          <a href="#" className={`${styles.sidebar_link} ${styles.sidebar_link_active} ${styles.sidebar_link_active_bg} nav-link d-flex`}>
            <img src={sidebar_dashboard} alt='sidebar_dashboard' className={`${styles.icon_active} pe-2`} />
            Dashboard
          </a>
        </li>
        <div className='d-flex pb-2'>
          <div className={`${styles.sidebar_submenu}`}>
            <img src={sidebar_submenu} alt='sidebar_submenu' className='pe-0' />
          </div>
          <div >
            <ul className='px-0 pt-2'>
              <li className=''>
                <a href="/" className={`${styles.sidebar_link} ${styles.sidebar_link_active} nav-link ps-0`}>
                  Trail Management
                </a>
              </li>
              <li className=''>
                <a href="#" className={`${styles.sidebar_link} nav-link ps-0`}>
                  User Management
                </a>
              </li>
            </ul>
          </div>
        </div>
        {<li className="nav-item pb-2">
          <a href="#" className={`${styles.sidebar_link} nav-link d-flex`}>
            <img src={sidebar_profile} alt='sidebar_profile' className='pe-2' />
            Profile
          </a>
        </li>}
        <li className="nav-item pb-2">
          <a href="#" className={`${styles.sidebar_link} nav-link d-flex`}>
            <img src={sidebar_faq} alt='sidebar_faq' className='pe-2' />
            FAQ
          </a>
        </li>
      </ul>
      <div className='ms-4 me-5 d-flex align-items-center justify-content-between'>
        <a href="#" className="text-decoration-none ">
          <div className={` d-flex align-items-center justify-content-start`}>
            <img src="https://liquipedia.net/commons/images/1/1a/Brawl_Hank.png" alt="" width="50" height="50" className="rounded-circle me-3" />
            <div className='d-flex flex-column'>
              <div className={`${styles.sidebar_link_profile_name}`}>
                Janka Pecuchová
              </div>
              <div className={`${styles.sidebar_link_profile_email}`}>
                jaja@gmail.com
              </div>
            </div>
          </div>
        </a>
        <div onClick={() => logout()} className= {`${styles.sidebar_logout_btn} ps-2 py-3 pe-2`}>
          <img src={sidebar_logout} alt='sidebar_logout' />
        </div>
      </div>
    </div>
  );
}
export default Navbar;