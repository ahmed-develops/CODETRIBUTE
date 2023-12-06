import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const UpdateProjectModal = ({ show, handleClose, selectedProject }) => {
  const [projectName, setProjectName] = useState(
    selectedProject ? selectedProject.project_name : ""
  );
  const [projectDescription, setProjectDescription] = useState(
    selectedProject ? selectedProject.project_description : ""
  );
  const [codePath, setCodePath] = useState(
    selectedProject ? selectedProject.code_path : ""
  );

  const updateProject = async () => {
    console.log(
      selectedProject.project_id,
      projectName,
      projectDescription,
      codePath
    );

    try {
      const updateProjectApi = await fetch(
        `http://localhost:3300/update/project/${selectedProject.project_id}/${projectName}/${projectDescription}/${codePath}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const apiRes = await updateProjectApi.json();

      if (apiRes.status === 200) {
        alert("Project updated");
        window.location.reload();
      } else {
        alert(`Project could not be updated.\n Reason: ${apiRes.errorMsg}`);
      }
    } catch (error) {
      console.error(error.message);
      alert(`Error message: ${error.message}`);
    }
  };

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
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formProjectDesc">
            <Form.Label>Project Description</Form.Label>
            <Form.Control
              type="text"
              name="project_description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formProjectCodePath">
            <Form.Label>Project Code Path</Form.Label>
            <Form.Control
              type="text"
              name="project_code_path"
              value={codePath}
              onChange={(e) => setCodePath(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={updateProject}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateProjectModal;
