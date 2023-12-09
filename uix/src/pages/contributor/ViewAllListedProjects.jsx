import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import "../../assets/ViewProjects.css";
import { NavLink } from "react-router-dom";
import Web3 from "web3";
import TokenABI from "../admin/CodetributeToken.json";

const ViewAllListedProjects = ({ loginCredentials }) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    commit_id: "",
    contributor_id: "",
    commit_path: "",
    project_id: "",
  });
  const [publisherData, setPublisherData] = useState({
    publisher_id : "",
    tokens_required : 0
  })

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const commitToProject = async (event) => {
    event.preventDefault();

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
          const codeTokensContract = new window.web3.eth.Contract(tokenAbi, tokenAddress);
  
          const userAddress = wallet.accountAddress;
          const tokenBalance = await codeTokensContract.methods
            .balanceOf(userAddress)
            .call();
          
            if(tokenBalance >= publisherData.tokens_required) {
              const getPublisherWalletFromDatabase = await fetch(
                `http://localhost:3300/get/wallet/${publisherData.publisher_id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
        
              const publisherWallet = await getPublisherWalletFromDatabase.json();
              if (wallet.status === 200) {
                await codeTokensContract.methods.transfer(publisherWallet.accountAddress, publisherData.tokens_required).send({ from: userAddress });
                alert(`Token transfer successful!`);
                
                try {
                  const res = await fetch(`http://localhost:3300/post/commit/contributor`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      commit_id: formData.commit_id,
                      project_id: formData.project_id,
                      contributor_id: formData.contributor_id,
                      commit_path: formData.commit_path,
                    }),
                  });
            
                  const data = await res.json();
            
                  if (data.status === 400) {
                    alert(`${data.errorMsg}`);
                  }
                  else {
                    alert('Commit done!')
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }
            else {
              alert('Insufficient balance')
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

  const [codeData, setCodeData] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch(`http://localhost:3300/get/projects`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.table(data);
        if (Array.isArray(data)) {
          setCodeData(data);
        } else {
          setCodeData([data]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadProjects();
  }, []);

  return (
    <>
            <center>
        <NavLink to='/contributor-portal' className='btn btn-primary'>
          Go Back
        </NavLink>
        </center>
      {/* Create Contribution Modal */}
      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>List your commit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project ID</Form.Label>
              <Form.Control
                name="project_id"
                type="text"
                value={formData.project_id}
                disabled
                className="flat-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Commit ID</Form.Label>
              <Form.Control
                name="commit_id"
                type="text"
                value={formData.commit_id}
                onChange={handleInputChange}
                placeholder="e.g Commit_1 || ProjectName_Commit1"
                className="flat-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contributor ID</Form.Label>
              <Form.Control
                name="contributor_id"
                type="text"
                value={formData.contributor_id}
                disabled
                className="flat-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Commit Path</Form.Label>
              <Form.Control
                name="commit_path"
                type="text"
                value={formData.commit_path}
                onChange={handleInputChange}
                className="flat-input"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={commitToProject}>
            Publish
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="projects-container">
        <Table striped bordered hover responsive className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Project Description</th>
              <th>Code Path</th>
              <th>Tokens offered</th>
              <th>Tokens required</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {codeData?.map((val, i) => (
              <tr key={i}>
                <td>{val.project_id}</td>
                <td>{val.project_name}</td>
                <td className="path-cell">{val.project_description}</td>
                <td className="path-cell">{val.code_path}</td>
                <td>{val.tokens_offered}</td>
                <td>{val.tokens_required}</td>
                <td>
                  <Button
                    onClick={ () => {
                        setPublisherData({publisher_id: val.publisher_id, tokens_required: val.tokens_required});
                        handleShow()
                        setFormData({
                        ...formData,
                        project_id: val.project_id,
                        commit_id: "",
                        contributor_id: loginCredentials.user_id,
                        commit_path: "",
                      });
                    }}
                    variant="primary"
                    className="flat-btn"
                  >
                    Commit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ViewAllListedProjects;