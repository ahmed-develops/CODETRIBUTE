import ListImg from "../../assets/images/list.png";
import CommitImg from "../../assets/images/commit-icon.png";
import EditImg from "../../assets/images/Edit.png";
import PayImg from "../../assets/images/Pay.png";
import { NavLink } from "react-router-dom";
import ViewMyProfile from "../ViewMyProfile";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ManageUserProfile from "./ManageUserProfile";
import DistributeTokens from "./DistributeTokens";

const AdminPortal = ({ loginCredentials }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedPrivilege, setSelectedPrivilege] = useState("");
  const [distribution, setDistribution] = useState({
    to: null,
    amount: null
  });
  const test_data = [
    {name : 'Ahmed'},
    {name :'Ali'},
    {name :'Furqan'}
  ];

  const handlePrivilegeChange = (event) => {
    setSelectedPrivilege(event.target.value);
  };

  if (!loginCredentials) {
    window.location = "/";
    return null;
  }

  return (
    <div>
      <div className="Realgrid">
        <ViewMyProfile userdata={loginCredentials} />
        <div className="grid-box">
          <NavLink to="/admin/manage-user-profile" className="it-1">
            <img src={EditImg} className="item-icon" alt="List" />
            <p className="item-header">MANAGE USER PROFILE</p>
          </NavLink>
          <NavLink to="/admin/view-system-logs" className="it-2">
            <img src={CommitImg} className="item-icon" alt="Logs" />
            <p className="item-header">VIEW LOGS</p>
          </NavLink>
          <NavLink to="/wallet" className="it-3">
            <img src={PayImg} className="item-icon" alt="Wallet" />
            <p className="item-header">WALLET</p>
          </NavLink>
          <NavLink onClick={handleShow} className="it-4">
            <img src={EditImg} className="item-icon" alt="Logs" />
            <p className="item-header">DISTRIBUTE TOKENS</p>
          </NavLink>
        </div>
      </div>
      <div>
        <Modal
          show={show}
          onHide={handleClose}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Send Tokens</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
              <Form.Label>To [Receiver]</Form.Label>
              <Form.Control
                as="select"
                onChange={handlePrivilegeChange}
                value={selectedPrivilege}
              >
                <option value="">Select Receiver</option>
                {
                  test_data.map((val, i) => (
                    <option key={i}>{val.name}</option>
                  ))
                }
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                id="amount"
                // onChange={handleAmountChange}
                value={distribution.amount}
              >
              </Form.Control>
            </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary">Distribute</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminPortal;
