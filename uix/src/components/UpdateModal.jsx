import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

const UpdateModal = ({ show, handleClose, handleUpdateUser, formData, handleInputChange, handlePrivilegeChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
    <Modal show={show} onHide={handleClose} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>Update User</Modal.Title>
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
              readOnly
              disabled
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
            <div className="password-input">
              <Form.Control
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
              />
              <i
                className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer", position: "absolute", right: "10px", top: "10px" }}
              ></i>
            </div>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateUser}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateModal;
