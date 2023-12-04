import ViewMyProfile from "../ViewMyProfile";
import CommitImg from "../../assets/images/commit-icon.png";
import EditImg from "../../assets/images/Edit.png";
import PayImg from "../../assets/images/Pay.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import CTKNAbi from "./CodetributeToken.json";
import { Modal, Form, Button } from 'react-bootstrap';
import Web3 from "web3";

const AdminPortal = ({ loginCredentials }) => {
  const [showDistributeTokensModal, setShowDistributeTokensModal] = useState(false);
  const [recieverWalletId, setReceiverWalletId] = useState(null);

  const handleDistributeTokensClick = () => {
    setShowDistributeTokensModal(true);
  };

  const handleCloseDistributeTokens = () => {
    setShowDistributeTokensModal(false);
  };

  const handleModalClose = () => {
    handleCloseDistributeTokens();
  };

  const [userApi, setUserApi] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const getUserApiRes = await fetch(
          "http://localhost:3300/get/allUsersExceptAdmins/",
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

  const handleReceiverChange = (event) => {
    const selectedReceiverValue = event.target.value;
    setSelectedReceiver(selectedReceiverValue);
    getWalletAddress(selectedReceiverValue);
  };
  
  const getWalletAddress = async (rid) => {
    try {
      const walletApi = await fetch(`http://localhost:3300/get/wallet/${rid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const walletApiRes = await walletApi.json();
  
      if (walletApiRes.status === 200) {
        console.log(walletApiRes.accountAddress);
        setReceiverWalletId(walletApiRes.accountAddress);
      } else {
        alert('This user does not have a wallet linked to our service');
        setReceiverWalletId(null);
      }
    } catch (error) {
      console.error('Error fetching wallet address:', error);
      setReceiverWalletId(null);
    }
  };

  const sendAmount = async () => {
    let amount = document.querySelector("#amount").value;
    const rid = selectedReceiver;
  
    if (/^\d+$/.test(amount)) {
      amount = parseInt(amount, 10);
  
      if (amount > 500) {
        alert('Cannot send more than 500 CTKN at a time');
        return;
      }
    } else {
      alert("Enter a valid integer value in the amount field");
      return;
    }
  
    try {
      if (window.ethereum) {
        await window.ethereum.send('eth_requestAccounts');
        window.web3 = new Web3(window.ethereum);
      } else {
        alert('MetaMask not detected! Please install MetaMask to use this feature.');
        return;
      }
  
      const contractAddress = '0xe2ca36365E40e81A8185bB8986d662501dF5F6f2';
      const codeTokensContract = new window.web3.eth.Contract(CTKNAbi, contractAddress);
  
      const accounts = await window.web3.eth.getAccounts();
      const sender = accounts[0]; 
      const senderBalance = await codeTokensContract.methods.balanceOf(sender).call();
  
      if (senderBalance < amount) {
        alert('Insufficient balance to make the transfer.');
        return;
      }
  
      await codeTokensContract.methods.transfer(recieverWalletId, amount).send({ from: sender });
  
      alert(`Token transfer successful!`);
      handleCloseDistributeTokens();
    } catch (error) {
      console.error('Error during token transfer:', error);
      alert(`Token transfer unsuccessful: Unlinked wallet means no transaction possible.`);
    }
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
          <NavLink
            className="it-4"
            onClick={handleDistributeTokensClick}
          >
            <img src={EditImg} className="item-icon" alt="Logs" />
            <p className="item-header">DISTRIBUTE TOKENS</p>
          </NavLink>

          <Modal show={showDistributeTokensModal} onHide={handleModalClose} animation={true}>
            <Modal.Header closeButton>
              <Modal.Title>Send Tokens</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Receiver</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={handleReceiverChange}
                    value={selectedReceiver}
                  >
                    <option value="">Select receiver</option>
                    {userApi.map((receiver) => (
                      <option key={receiver.user_id} value={receiver.user_id}>
                        {`${receiver.user_id} - ${receiver.name}`}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control id="amount" />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
              <Button onClick={sendAmount} variant="primary">
                Distribute
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default AdminPortal;
