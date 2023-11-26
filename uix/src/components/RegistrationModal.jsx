import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const RegistrationModal = ({ show, handleClose, handleAddUser, formData, handleInputChange, handlePrivilegeChange }) => {
  return (
    <Modal show={show} onHide={handleClose} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              name="user_id"
              type="text"
              value={formData.user_id}
              onChange={handleInputChange}
              placeholder="User ID"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="text"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              name="phone_number"
              type="text"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
          </Form.Group>
          {/* <Form.Group className="mb-3">
            <Form.Label>As</Form.Label>
            <Form.Control
              name="privilege"
              as="select"
              onChange={handlePrivilegeChange}
              value={formData.privilege}
            >
              <option value="">Select Privilege</option>
              <option value="Contributor">Contributor</option>
              <option value="Publisher">Publisher</option>
            </Form.Control>
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddUser}>
          Add User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegistrationModal;
