import CommitImg from "../../assets/images/commit-icon.png";
import EditProjectImg from "../../assets/images/Edit.png";
import CreateListingImg from "../../assets/images/list.png";
import PayImg from "../../assets/images/Pay.png";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import ViewMyProfile from '../ViewMyProfile';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import TokenABI from "../admin/CodetributeToken.json";
import Web3 from "web3";

const PublisherPortal = ({ loginCredentials }) => {
  const [show, setShow] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    projectId: "",
    projectName: "",
    projectDescription: "",
    projectLink: "",
    tokensRequired: 0,
    tokensOffered: 0
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

    if (
      !formData.projectId ||
      !formData.projectName ||
      !formData.projectLink
    ) {
      alert("Please fill all the fields and then submit your project.");
      return;
    }

    const getWalletFromDatabase = await fetch(
      `http://localhost:3300/get/wallet/${loginCredentials.user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const wallet = await getWalletFromDatabase.json();

    console.log(wallet);
    if (wallet.status === 200) {
      try {
        if (window.ethereum) {
          await window.ethereum.send('eth_requestAccounts');
          window.web3 = new Web3(window.ethereum);
        } else {
          alert('MetaMask not detected! Please install MetaMask to use this feature.');
          return;
        }
        const tokenAddress = "0xe2ca36365E40e81A8185bB8986d662501dF5F6f2";
        const tokenAbi = TokenABI;
        const codeTokensContract = new web3.eth.Contract(tokenAbi, tokenAddress);

        const userAddress = wallet.accountAddress;
        const tokenBalance = await codeTokensContract.methods
          .balanceOf(userAddress)
          .call();
        console.log(formData.tokensOffered);
        console.log(tokenBalance);
          if(parseInt(tokenBalance) >= parseInt(formData.tokensOffered)) {
              await codeTokensContract.methods.transfer('0x242c4eA92Dc29F4af6aE499dFe11FC083053EF5e', formData.tokensOffered).send({ from: userAddress });
              alert(`Tokens transferred to admin for hold!`);
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
                    tokenOffered: formData.tokensOffered,
                    userId: loginCredentials.user_id
                  }),
                });
          
                const data = await res.json();
          
                if (data.status === 200) {
                  alert("Project added to the listing successfully");
                  handleClose();
                } else {
                  alert(data.errorMsg);
                  handleClose();
                }
                setFormData({projectId: "",
                projectName: "",
                projectDescription: "",
                projectLink: "",
                tokensRequired: "",
                tokensOffered: ""
              });
              } catch (err) {
                console.error(err);
              }
          }
          else {
            alert('Your balance is less than what you are offering to the contributor.');
          }
      }
      catch(err) {
        console.error(err);
        alert(`${err.message}`);
      }
    }
    else {
      alert('Please link a wallet to start contributing!');
    }
  };

  return (
    <div className="Realgrid">
    <ViewMyProfile userdata={loginCredentials}/>
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
            <Form.Group className="mb-3">
              <Form.Label>Tokens Offered</Form.Label>
              <Form.Control
                name="tokensOffered"
                type="text"
                value={formData.tokensOffered}
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
        <NavLink to="/publisher/manage-commits" className="it-1">
          <img src={CommitImg} className="item-icon" />
          <p className="item-header">MANAGE COMMITS</p>
        </NavLink>
        <NavLink onClick={handleShow} className=" it-2">
          <img src={CreateListingImg} alt="" className="item-icon" />
          <p className="item-header">OPEN PROJECT LISTING</p>
        </NavLink>
        <NavLink to="/publisher/view-projects" className="it-3">
          <img src={CreateListingImg} alt="" className="item-icon" />
          <p className="item-header">VIEW LISTED PROJECTS</p>
        </NavLink>
        <NavLink to="/publisher/view-commits" className=" it-4">
          <img src={CommitImg} className="item-icon" />
          <p className="item-header">VIEW COMMITS</p>
        </NavLink>
        <NavLink to="/wallet" className=" it-1">
          <img src={PayImg} className="item-icon" />
          <p className="item-header">WALLET</p>
        </NavLink>
        <NavLink to="/view-activity-logs" className="it-1">
          <img src={EditProjectImg} className="item-icon" alt="Wallet Icon" />
          <p className="item-header">VIEW YOUR ACTIVITY</p>
        </NavLink>
        <NavLink to="/view-leaderboard" className="it-1">
          <img src={PayImg} className="item-icon" alt="Wallet Icon" />
          <p className="item-header">VIEW LEADERBOARD</p>
        </NavLink>
      </div>
    </div>
  );
};

export default PublisherPortal;
