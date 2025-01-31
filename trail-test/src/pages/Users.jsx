import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Cookies from "universal-cookie";
import Navbar from '../Navbar';
import styles from '../css/TrailList.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AlertComponent from '../../components/AlertComponent';

//svg import
import search_button from '../assets/search_button.svg';
import filter_button from '../assets/filter_button.svg';
import sort_button from '../assets/sort_button.svg';
import table_actions from '../assets/table_actions.svg';
import table_action_delete from '../assets/table_action_delete.svg';
import table_action_edit from '../assets/table_action_edit.svg';
import table_action_show from '../assets/table_action_show.svg';
import table_action_publish from '../assets/table_action_publish.svg';
import modal_publish from '../assets/modal_publish.svg';

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [userToProcess, setUserToProcess] = useState(null);
  const [verifyModalShow, setVerifyModalShow] = useState(false);
  const [alert, setAlert] = useState({message: '', type: ''});

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${backendUrl}/users`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configuration)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        setAlert({message: 'Failed to load the users.', type: 'error'});
        console.log(error);
      })
  }, []);

  const getDisplayedUsers = () => {
    // search
    let searched = users.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
    // sort
    let sorted = [...searched];
    switch (sortOption) {
      case 'name-asc':
        sorted.sort((u1, u2) => u1.name.localeCompare(u2.name));
        break;
      case 'name-desc':
        sorted.sort((u1, u2) => u2.name.localeCompare(u1.name));
        break;
      case 'email-asc':
        sorted.sort((u1, u2) => u1.email.localeCompare(u2.email));
        break;
      case 'email-desc':
        sorted.sort((u1, u2) => u2.email.localeCompare(u1.email));
        break;
      default:
        break;
    }
    return sorted;
  }

  const displayedUsers = getDisplayedUsers();

  const handleConfirmVerify = () => {
    const configuration = {
      method: "put",
      url: `${backendUrl}/users/verify/${userToProcess}`,
      data: { verified: true },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    api(configuration)
      .then(response => {
        setUsers(users.map(user => user._id === userToProcess ? { ...user, verified: true } : user));
        setAlert({message: 'The user was verified.', type: 'success'});
        handleVerifyModalClose();
      })
      .catch(error => {
        console.log(error);
        setAlert({message: 'Failed to verify the user.', type: 'error'});
        handleVerifyModalClose();
      });
  };

  const handleVerifyModalShow = (user_id) => {
    setUserToProcess(user_id);
    setVerifyModalShow(true);
  };

  const handleVerifyModalClose = () => {
    setUserToProcess(null);
    setVerifyModalShow(false);
  };

  useEffect(() => {
      if (alert.message) {
        const timer = setTimeout(() => {
          setAlert({ message: '', type: '' });
        }, 3000); // Hide alert after 3 seconds
        return () => clearTimeout(timer);
      }
    }, [alert.message]);

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
          {alert.message && (
            <AlertComponent message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
          )}
          <div className={`${styles.table_div}`}>
            <div className='d-flex justify-content-between'>
              <div className="input-group mb-3 mt-4 ms-4">
                <span className={`${styles.search_icon} input-group-text`} id="basic-addon1">
                  <img src={search_button} alt="search_button" className='pe-2' />
                </span>
                <input type="text" className={`${styles.search_input} form-control`} placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className='d-flex align-items-center'>
                <a className={`${styles.filter_button} btn btn-secondary pe-4 py-1 me-2`} href='#'>
                  <div className='d-flex'>
                    Filters
                    <img src={filter_button} alt="filter_button" className='px-2' />
                  </div>
                </a>
                <Dropdown className='btn-secondary py-1 me-2' >
                  <Dropdown.Toggle variant="secondary" id="dropdown-sort" className={`${styles.dropdown_toggle_sort} pe-3 me-3 d-flex`}>
                    Sort <img src={sort_button} alt="sort_button" className='px-2' />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className=''>
                    <Dropdown.Item onClick={() => setSortOption('name-asc')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      Name (A → Z)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortOption('name-desc')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      Name (Z → A)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortOption('email-asc')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      Length (from shortest)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortOption('email-desc')} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                      Length (from longest)
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className='pb-3'>
              <table className='table table-striped table-hover align-middle'>
                <thead>
                  <tr className={`${styles.table_header}`}>
                    <th className='ps-4'>No.</th>
                    <th className=''>Name</th>
                    <th className=''>Email</th>
                    <th className=''>Country</th>
                    <th className=''>Status</th>
                    <th className=''>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((user, index) => (
                    <tr key={user._id} className={`${styles.table_data}`}>
                      <td className='ps-4'>{index + 1}</td>
                      <td>
                        {user.name}
                      </td>
                      <td>
                        {user.email}
                      </td>
                      <td>
                        {user.country}
                      </td>
                      <td>
                        {user.verified ? (
                          <button className={`${styles.status_published} btn disabled`}>Verified</button>
                        ) : (
                          <button className={`${styles.status_unverified} btn disabled`}>Not Verified</button>
                        )}
                      </td>
                      <td className='ps-3'>
                        <Dropdown>
                          <Dropdown.Toggle variant="secondary" id="dropdown-basic" className={`${styles.dropdown_toggle} rounded-circle p-1`}>
                            <img src={table_actions} alt="search_button" className='' />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className=''>
                            {!user.verified ? (
                              <Dropdown.Item href="#" onClick={() => handleVerifyModalShow(user._id)} className={`${styles.table_action_dropdown_item} ps-4 d-flex`}>
                                <img src={table_action_publish} alt="show" className='pe-2' />Verify User
                              </Dropdown.Item>
                            ) : (<></>)}
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
              Showing 1 to {Object.keys(displayedUsers).length} of {Object.keys(displayedUsers).length} entries
            </div>
          </div>
          <Modal
            show={verifyModalShow}
            onHide={handleVerifyModalClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body className='d-flex flex-column align-items-center p-4'>
              <img src={modal_publish} alt="modal_publish" className='px-2 pb-2' />
              <h1 className={`${styles.modal_heading}`}>Verify User</h1>
              <p className={`${styles.modal_text} mb-0`}>Are you sure you want to verify this user?</p>
              <p className={`${styles.modal_text} `}>Once verified, he/she will be able to login to the system.</p>
            </Modal.Body>
            <Modal.Footer className={`${styles.modal_footer} d-flex flex-nowrap justify-content-center pt-0 pb-4`}>
              <Button variant="secondary" onClick={() => handleVerifyModalClose()} className={`${styles.modal_cancel_button} flex-fill ms-5 me-2`}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => handleConfirmVerify()} className={`${styles.modal_publish_button} flex-fill ms-2 me-5`}>
                Verify
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>

  )
};

export default Users;