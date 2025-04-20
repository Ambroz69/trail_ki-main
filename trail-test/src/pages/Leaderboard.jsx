import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import styles from '../css/TrailGrid.module.css';
import { useTranslation } from 'react-i18next';
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';


const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const { t } = useTranslation(); // Hook for translations

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${backendUrl}/users/leaderboard`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configuration)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        setAlert({ message: `${t('error_load_users')}`, type: 'error' });
        console.log(error);
      })
  }, []);

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const userId = getUserIdFromToken(token);

  return (
    <div className='row d-flex mx-0 px-0'>
      {/* Navbar */}
      <NavbarExplorer />
      <div className={`${styles.show_trail_bg}`}>
        <div className={`py-4 px-0 offset-lg-2 col-lg-8`}>
          <h2 className="fs-4 pb-3">{t('leaderboard')}</h2>
          <div className={`${styles.leaderboard_card}`}>
            <table className="table table-borderless">
              <thead>
                <tr className={`${styles.leaderboard_header}`}>
                  <th className='col-2 ps-4'>{t('leader_rank')}</th>
                  <th className='col-8'>{t('leader_name')}</th>
                  <th className='col-2 text-end pe-5'>XP</th>
                </tr >
              </thead>
              <tbody className='align-middle'>
                {users.map((user, index) => {
                  let rowClass;
                  if (index === 0) {
                    rowClass = `${styles.leaderboard_first}`;
                  } else if (index === 1) {
                    rowClass = `${styles.leaderboard_second}`;
                  } else if (index === 2) {
                    rowClass = `${styles.leaderboard_third}`;
                  } else if (user._id===userId) {
                    rowClass = `${styles.leaderboard_highlighted}`;
                  } else {
                    rowClass = `${styles.leaderboard_data_row}`;
                  }
                  return (
                    <tr key={index} className={rowClass}>
                      <td className={`${styles.leaderboard_data} ${styles.leaderboard_data_rank} ps-5`}>
                        {index + 1}. 
                      </td>
                      <td className={`${styles.leaderboard_data} d-flex align-items-center`}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px", backgroundColor: "#7FCEC6" }}>
                          {/* Placeholder for icon */}
                        </div>
                        <span className="ms-2">{user.name}</span>
                      </td>
                      <td className={`${styles.leaderboard_data} ${styles.leaderboard_data_xp}`}>{user.totalXP} XP</td>
                    </tr>
                  );
                })}
              </tbody>
            </table >
          </div >
        </div >
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Leaderboard;