import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "../../assets/ViewProjects.css";
import BanModal from "../../components/BanModal";
import RegistrationModal from "../../components/RegistrationModal";
import UpdateModal from "../../components/UpdateModal";

const ManageUserProfile = ({ loginCredentials }) => {
  const [contributors, setContributors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState("");
  const [selectedBanUser, setSelectedBanUser] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const loadContributorsPublishers = async () => {
      try {
        const resContributors = await fetch(
          `http://localhost:3300/get/contributors`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const contributorsData = await resContributors.json();
        setContributors(
          Array.isArray(contributorsData) ? contributorsData : []
        );

        const resPublishers = await fetch(
          `http://localhost:3300/get/publishers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const publishersData = await resPublishers.json();
        setPublishers(Array.isArray(publishersData) ? publishersData : []);
      } catch (error) {
        console.error(error);
      }
    };

    loadContributorsPublishers();
  }, []);

  // Form data for both modals
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    email: "",
    password: "",
    phone_number: "",
    privilege: selectedPrivilege,
  });

  // Function to open Registration Modal
  const handleShowRegistrationModal = () => {
    setShowRegistrationModal(true);
  };

  const handleBanModal = (userId) => {
    setSelectedBanUser(userId);
  };

  const handleShowUpdateModal = (selectedProfile) => {
    setFormData({
      user_id: selectedProfile.user_id,
      name: selectedProfile.name,
      email: selectedProfile.email,
      password: selectedProfile.password,
      phone_number: selectedProfile.phone_number,
      privilege: selectedProfile.privilege,
    });
    setShowUpdateModal(true);
    setIsUpdate(true);
  };

  // Common function to close both modals
  const handleCloseModal = () => {
    setShowRegistrationModal(false);
    setShowUpdateModal(false);
    setIsUpdate(false);
    // Reset form data
    setFormData({
      user_id: "",
      name: "",
      email: "",
      password: "",
      phone_number: "",
      privilege: "",
    });
  };

  // Common function to handle form input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Common function to handle privilege change
  const handlePrivilegeChange = (event) => {
    const { value } = event.target;
    setSelectedPrivilege(value);
    handleInputChange(event);
  };

  // Registration Modal function to add a user
  const handleAddUser = async () => {
    try {
      const apiUrl = `http://localhost:3300/registration/${loginCredentials.user_id}`;
      const method = "POST";

      const res = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === 400) {
        handleClose();
        alert(`${data.errorMsg}`);
      } else {
        alert(`${data.msg}`);
        handleClose();
        setFormData({
          user_id: "",
          name: "",
          email: "",
          password: "",
          phone_number: "",
          privilege: "",
        });
      }
    } catch (err) {
      console.error(err);
    }
    handleCloseModal();
    window.location.reload();
  };

  // Update Modal function to update a user
  const handleUpdateUser = async () => {
    try {
      if (!loginCredentials || !loginCredentials.user_id) {
        console.error("Error: loginCredentials or loginCredentials.user_id is undefined.");
        return;
      }
  
      if (!formData.user_id) {
        console.error("Error: formData.user_id is undefined.");
        return;
      }
  
      const apiUrl = `http://localhost:3300/update/user/${loginCredentials.user_id}/${formData.user_id}`;
      const method = "POST";
  
      const res = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (data.status === 400) {
        handleClose();
        alert(`${data.errorMsg}`);
      } else {
        alert(`${data.msg}`);
        handleClose();
        // Clear the form data
        setFormData({
          user_id: "",
          name: "",
          email: "",
          password: "",
          phone_number: "",
          privilege: "",
        });
        // Reset the update state
        setIsUpdate(false);
      }
    } catch (err) {
      console.error(err);
    }
    handleCloseModal();
    window.location.reload();
  };

  return (
    <div>
      <center>
        <Button variant="primary" onClick={handleShowRegistrationModal} className="add-user-btn">
          Add A User
        </Button>
      </center>

      <hr />
      <fieldset>CONTRIBUTORS</fieldset>
      <hr />

      <Table striped bordered hover responsive className="custom-table">
        <thead>
          <tr>
            <th>Contributor ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((contributor, i) => (
            <tr key={i}>
              <td>{contributor.user_id}</td>
              <td>{contributor.name}</td>
              <td>{contributor.email}</td>
              <td>{contributor.password}</td>
              <td>{contributor.phone_number}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color: contributor.status === "Active" ? "green" : "red",
                }}
              >
                {contributor.status}
              </td>
              <td>
                {contributor.status === "Active" ? (
                  <>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleShowUpdateModal(contributor)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleBanModal(contributor.user_id)}
                    >
                      Ban
                    </Button>
                  </>
                ) : contributor.status === "Suspended" ? (
                  <>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleEditProfile(contributor)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleBanModal(contributor.user_id)}
                    >
                      Unban
                    </Button>
                  </>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <hr />
      <fieldset>PUBLISHERS</fieldset>
      <hr />

      <Table striped bordered hover responsive className="custom-table">
        <thead>
          <tr>
            <th>Publisher ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {publishers.map((publisher, i) => (
            <tr key={i}>
              <td>{publisher.user_id}</td>
              <td>{publisher.name}</td>
              <td>{publisher.email}</td>
              <td>{publisher.password}</td>
              <td>{publisher.phone_number}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color: publisher.status === "Active" ? "green" : "red",
                }}
              >
                {publisher.status}
              </td>
              <td>
                {publisher.status === "Active" ? (
                  <>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleShowUpdateModal(contributor)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleBanModal(publisher.user_id)}
                    >
                      Ban
                    </Button>
                  </>
                ) : publisher.status === "Suspended" ? (
                  <>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleEditProfile(publisher)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleBanModal(publisher.user_id)}
                    >
                      Unban
                    </Button>
                  </>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <BanModal
        show={selectedBanUser !== null}
        handleClose={() => setSelectedBanUser(null)}
        handleBan={() => banUser(selectedBanUser)}
        user={
          contributors.find((contributor) => contributor.user_id === selectedBanUser) ||
          publishers.find((publisher) => publisher.user_id === selectedBanUser)
        }
      />

      {/* Registration Modal */}
      <RegistrationModal
        show={showRegistrationModal}
        handleClose={handleCloseModal}
        handleAddUser={handleAddUser}
        formData={formData}
        handleInputChange={handleInputChange}
        handlePrivilegeChange={handlePrivilegeChange}
      />

      <UpdateModal
        show={showUpdateModal}
        handleClose={handleCloseModal}
        handleUpdateUser={handleUpdateUser}
        formData={formData}
        handleInputChange={handleInputChange}
        handlePrivilegeChange={handlePrivilegeChange}
      />

    </div>
  );
};

export default ManageUserProfile;

