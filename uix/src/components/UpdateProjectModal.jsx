import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const UpdateProjectModal = ({ show, handleClose, handleUpdateProject, selectedProject }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Project Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group controlId="formProjectID">
            <Form.Label>Project ID</Form.Label>
            <Form.Control
              type="text"
              name="project_id"
              defaultValue={selectedProject ? selectedProject.project_id : ""}
              disabled
            />
          </Form.Group>
          <Form.Group controlId="formProjectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              name="project_name"
              defaultValue={selectedProject ? selectedProject.project_name : ""}
            />
          </Form.Group>
          <Form.Group controlId="formProjectDesc">
            <Form.Label>Project Description</Form.Label>
            <Form.Control
              type="text"
              name="project_description"
              defaultValue={selectedProject ? selectedProject.project_description : ""}
            />
          </Form.Group>
          <Form.Group controlId="formProjectCodePath">
            <Form.Label>Project Code Path</Form.Label>
            <Form.Control
              type="text"
              name="project_code_path"
              defaultValue={selectedProject ? selectedProject.code_path : ""}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleUpdateProject(selectedProject)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateProjectModal;
