
import ViewMyProfile from "../ViewMyProfile";
import ListImg from "../../assets/images/list.png";
import CommitImg from "../../assets/images/commit-icon.png";
import EditImg from "../../assets/images/Edit.png";
import PayImg from "../../assets/images/Pay.png";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const AdminPortal = ({ loginCredentials }) => {
  const [userApi, setUserApi] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedContributor, setSelectedContributor] = useState("");
  const [distribution, setDistribution] = useState({
    to: null,
    amount: null,
  });
  const cid = selectedContributor;
  const amount = document.querySelector("#amount").value;

  const sendAmount = async (event) => {
    console.log(amount, cid);
    event.preventDefault();

    const sendAmountApi = await fetch(
      `http://localhost:3300/send/tokens/${selectedContributor}/${distribution.amount}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    const sendAmountRes = await sendAmountApi.json();

    if (sendAmountRes.status === 200) {
      alert("Token sending successful");
    } else {
      alert("Token sending unsuccessful");
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const getUserApiRes = await fetch(
          `http://localhost:3300/get/allUsersExceptAdmins/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const userApiRes = await getUserApiRes.json();
        if (userApiRes.status === 200) {
          setUserApi(userApiRes.user);
        } else {
          console.error("Error fetching users:", userApiRes.errorMsg);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  const handleContributorChange = (event) => {
    setSelectedContributor(event.target.value);
  };

  const handleAmountChange = (event) => {
    setDistribution({
      ...distribution,
      amount: event.target.value,
    });
  };

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
          <NavLink to="/view-leaderboard" className="it-1">
            <img src={PayImg} className="item-icon" alt="Wallet Icon" />
            <p className="item-header">VIEW LEADERBOARD</p>
          </NavLink>
        </div>
      </div>
      <div>
        <Modal show={show} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>Send Tokens</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Contributor</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleContributorChange}
                  value={selectedContributor}
                >
                  <option value="">Select Contributor</option>
                  {userApi.map((contributor) => (
                    <option
                      key={contributor.user_id}
                      value={contributor.user_id}
                    >
                      {`${contributor.user_id} - ${contributor.name}`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  id="amount"
                  onChange={handleAmountChange}
                  value={distribution.amount}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={sendAmount} variant="primary">
              Distribute
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminPortal;
