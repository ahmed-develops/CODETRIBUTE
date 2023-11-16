import CommitImg from "../../assets/images/commit-icon.png";
import EditProjectImg from "../../assets/images/Edit.png";
import CreateListingImg from "../../assets/images/list.png";

import { NavLink } from "react-router-dom";
import { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const PublisherPortal = ({ loginCredentials }) => {
  // Modal Controllers
  const [show, setShow] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    projectId: "",
    projectName: "",
    projectDescription: "",
    projectLink: "",
    tokensRequired: ""
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const publishProject = async (event) => {
    event.preventDefault();

    console.log(formData);
    if (
      !formData.projectId ||
      !formData.projectName ||
      !formData.projectLink
    ) {
      alert("Please fill all the fields and then submit your project.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3300/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: formData.projectId,
          projectName: formData.projectName,
          projectDescription: formData.projectDescription,
          projectLink: formData.projectLink,
          tokenRequired: formData.tokensRequired,
          userId: loginCredentials.user_id
        }),
      });

      const data = await res.json();

      if (data.status === 200) {
        alert("Project added to the listing successfully");
        handleClose();
        // Navigate to the desired page after success
        // You can use a navigation library or React Router for this.
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Create Listing Modal */}
      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>List your project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID</Form.Label>
              <Form.Control
                name="projectId"
                type="text"
                value={formData.projectId}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="projectName"
                type="text"
                value={formData.projectName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="projectDescription"
                type="text"
                value={formData.projectDescription}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                name="projectLink"
                type="text"
                value={formData.projectLink}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tokens Required</Form.Label>
              <Form.Control
                name="tokensRequired"
                type="text"
                value={formData.tokensRequired}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={publishProject}>
            Publish
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Navigational Units */}
      <div className="grid-box">
        <NavLink to="/publisher/manage-commits" className=" it-1">
          <img src={CommitImg} className="item-icon" />
          <p className="item-header">MANAGE COMMITS</p>
        </NavLink>
        <NavLink onClick={handleShow} className=" it-2">
          <img src={CreateListingImg} alt="" className="item-icon" />
          <p className="item-header">OPEN PROJECT LISTING</p>
        </NavLink>
        <NavLink to="/publisher/view-projects" className=" it-3">
          <img src={CreateListingImg} alt="" className="item-icon" />
          <p className="item-header">VIEW LISTED PROJECTS</p>
        </NavLink>
        <NavLink to="/publisher/view-commits" className=" it-1">
          <img src={CommitImg} className="item-icon" />
          <p className="item-header">VIEW COMMITS</p>
        </NavLink>
        <NavLink to="/wallet" className=" it-1">
          <img src={CommitImg} className="item-icon" />
          <p className="item-header">WALLET</p>
        </NavLink>
      </div>
    </>
  );
};

export default PublisherPortal;
