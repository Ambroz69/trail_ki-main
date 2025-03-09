import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Cookies from "universal-cookie";
import styles from '../css/TrailGrid.module.css';
import { useTranslation } from 'react-i18next';
import NavbarExplorer from '../NavbarExplorer';

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
      <div className={`${styles.show_trail_bg} py-3 px-0 offset-lg-2 col-lg-8`}>
        <h2 className="mb-4">Leaderboard</h2>
        <div className={`card ${styles.leaderboardCard}`}>
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>XP</th>
              </tr >
            </thead >
            <tbody>
              {dummyLeaderboard.map((user, index) => (
                <tr key={index}>
                  <td>
                    {user.rank}
                  </td>
                  <td className="d-flex align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3 bg-dark"
                      style={{ width: "25px", height: "25px" }}> 
                      {/* Placeholder for icon */}
                    </div>
                    <span className="ms-2">{user.name}</span>
                  </td>
                  <td>{user.xp} XP</td>
                </tr>
              ))}
            </tbody>
          </table >
        </div >
      </div >
      {/* Footer */}
      <footer className={`bg-white px-0`}>
        <div className={`${styles.footer_bg} py-5 px-3 px-lg-0`}>
          <div className={`offset-lg-2`}>
            <div className="d-flex">
              <img src={title_page_logo} alt="title_page_logo" className='ps-2' />
              <div className="col-lg-3 pe-5">
                <p className={`${styles.footer_text} pt-3 ps-4 text-white`}>{t("footer_description")}</p>
              </div>
            </div>
            <p className="mt-5 mb-0 text-white">© 2024 AVA Trail | {t("university_name")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Leaderboard;