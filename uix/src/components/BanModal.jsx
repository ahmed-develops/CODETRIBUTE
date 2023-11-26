// BanModal.js

import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const BanModal = ({ show, handleClose, handleBan, user }) => {
  if (!user) {
    // Handle case where user is undefined
    return null;
  }

  const { name, status } = user;
  const actionLabel = status === "Active" ? "Ban" : "Unban";

  // Function declarations
  const banUser = async (selectedProfile) => {
    console.log(selectedProfile.user_id);
    const banApi = await fetch(
      `http://localhost:3300/banUser/${selectedProfile.user_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const banApiResponse = await banApi.json();

    if (banApiResponse === 400) {
      alert(`${banApiResponse.errorMsg}`);
    } else {
      alert(`${banApiResponse.msg}`);
    }

    handleClose(); // Close the modal after ban
    window.location.reload(); // Reload the page after ban
  };

  const unbanUser = async (selectedProfile) => {
    const unbanApi = await fetch(
      `http://localhost:3300/unbanUser/${selectedProfile.user_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const unbanApiResponse = await unbanApi.json();

    if (unbanApiResponse === 400) {
      alert(`${unbanApiResponse.errorMsg}`);
    } else {
      alert(`${unbanApiResponse.msg}`);
    }

    handleClose(); // Close the modal after unban
    window.location.reload(); // Reload the page after unban
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{actionLabel} User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to {actionLabel.toLowerCase()}{" "}
          <strong>{name}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={
            actionLabel === "Ban" ? () => banUser(user) : () => unbanUser(user)
          }
        >
          {actionLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BanModal;
