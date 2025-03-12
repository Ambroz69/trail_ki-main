import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Cookies from "universal-cookie";
import styles from '../css/TrailGrid.module.css';
import { useTranslation } from 'react-i18next';
import NavbarExplorer from '../NavbarExplorer';
import Footer from '../../components/Footer';

// SVG imports
import title_page_logo from '../../src/assets/title_page_logo.svg';
import trail_prepare_certification from '../../src/assets/trail_prepare_certification.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Leaderboard = () => {
  const { t } = useTranslation(); // Hook for translations

  const dummyLeaderboard = [
    { rank: 1, name: "Adam Novák", xp: 102 },
    { rank: 2, name: "Petra Kováčová", xp: 98 },
    { rank: 3, name: "Tomáš Richter", xp: 88 },
    { rank: 4, name: "Martina Blažková", xp: 85 },
    { rank: 5, name: "Jakub Veselý", xp: 78 },
    { rank: 6, name: "Simona Malá", xp: 60 },
    { rank: 7, name: "Janka Pecuchová", xp: 52 },
    { rank: 8, name: "Michal Dvořák", xp: 38 },
    { rank: 9, name: "Veronika Hrušková", xp: 27 },
    { rank: 10, name: "David Kučera", xp: 10 },
  ];

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
                {dummyLeaderboard.map((user, index) => {
                  let rowClass;
                  if (index === 0) {
                    rowClass = `${styles.leaderboard_first}`;
                  } else if (index === 1) {
                    rowClass = `${styles.leaderboard_second}`;
                  } else if (index === 2) {
                    rowClass = `${styles.leaderboard_third}`;
                  } else if (index === 6){
                    rowClass = `${styles.leaderboard_highlighted}`;
                  } else {
                    rowClass = `${styles.leaderboard_data_row}`;
                  }
                  return (
                    <tr key={index} className={rowClass}>
                      <td className={`${styles.leaderboard_data} ${styles.leaderboard_data_rank} ps-5`}>
                        {user.rank}
                      </td>
                      <td className={`${styles.leaderboard_data} d-flex align-items-center`}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px", backgroundColor: "#7FCEC6" }}>
                          {/* Placeholder for icon */}
                        </div>
                        <span className="ms-2">{user.name}</span>
                      </td>
                      <td className={`${styles.leaderboard_data} ${styles.leaderboard_data_xp}`}>{user.xp} XP</td>
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