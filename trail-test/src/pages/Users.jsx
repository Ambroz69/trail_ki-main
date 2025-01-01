import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailList.module.css';
import Dropdown from 'react-bootstrap/Dropdown';

//svg import
import search_button from '../assets/search_button.svg';
import filter_button from '../assets/filter_button.svg';
import sort_button from '../assets/sort_button.svg';
import table_actions from '../assets/table_actions.svg';
import table_action_delete from '../assets/table_action_delete.svg';
import table_action_edit from '../assets/table_action_edit.svg';
import table_action_show from '../assets/table_action_show.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const configuration = {
      method: "get",
      url: "http://localhost:5555/users",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configuration)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  return (
    <div className='d-flex container-fluid mx-0 px-0'>
      <div className='col-3 pe-3'>
        <Navbar />
      </div>
      <div className='col-9 col-9 px-5'>
        <div className='py-4 ps-0'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl my-8'>User Management</h1>
          </div>
          <div className={`${styles.table_div}`}>
            <div className='d-flex justify-content-between'>
              <div className="input-group mb-3 mt-4 ms-4">
                <span className={`${styles.search_icon} input-group-text`} id="basic-addon1">
                  <img src={search_button} alt="search_button" className='pe-2' />
                </span>
                <input type="text" className={`${styles.search_input} form-control`} placeholder="Search users..." />
              </div>
              <div className='d-flex align-items-center'>
                <a className={`${styles.filter_button} btn btn-secondary pe-4 py-1 me-2`} href='#'>
                  <div className='d-flex'>
                    Filters
                    <img src={filter_button} alt="filter_button" className='px-2' />
                  </div>
                </a>
                <a className={`${styles.filter_button} btn btn-secondary pe-4 py-1 me-3`} href='#'>
                  <div className='d-flex'>
                    Sort
                    <img src={sort_button} alt="sort_button" className='px-2' />
                  </div>
                </a>
              </div>
            </div>
            <div className='pb-3'>
              <table className='table table-striped table-hover align-middle'>
                <thead>
                  <tr className={`${styles.table_header}`}>
                    <th className='ps-4'>No.</th>
                    <th className=''>Name</th>
                    <th className=''>Email</th>
                    <th className=''>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id} className={`${styles.table_data}`}>
                      <td className='ps-4'>{index + 1}</td>
                      <td>
                        {user.name}
                      </td>
                      <td>
                        {user.email}
                      </td>
                      <td className='ps-3'>
                        <Dropdown>
                          <Dropdown.Toggle variant="secondary" id="dropdown-basic" className={`${styles.dropdown_toggle} rounded-circle p-1`}>
                            <img src={table_actions} alt="search_button" className='' />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className=''>
                            <Dropdown.Item href="#" className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_show} alt="show" className='pe-2' />Show User
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_edit} alt="edit" className='pe-2' />Edit User
                            </Dropdown.Item>
                            <Dropdown.Item href="#" onClick={() => handleDeleteModalShow(user._id)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                              <img src={table_action_delete} alt="delete" className='pe-2' />Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`${styles.table_bottom} mt-1 mb-4 ms-4`}>
              Showing 1 to {Object.keys(users).length} of {Object.keys(users).length} entries
            </div>
          </div>
        </div>
      </div>
    </div>

  )
};

export default Users;