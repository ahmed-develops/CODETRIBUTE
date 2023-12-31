import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";
import TokenABI from "../admin/CodetributeToken.json";
import Web3 from "web3";

const ManageCommits = ({ loginCredentials }) => {
  const [codeData, setCodeData] = useState([]);
  const [commitData, setCommitData] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectCommitId, setRejectCommitId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const handleRejectSubmit = async (project) => {
    console.log(project);
    const commitId = rejectCommitId; 
    const projectId = project.project_id;

    const commit_manage = await fetch(
      `http://localhost:3300/manage/commit/reject/${commitId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    const data = await commit_manage.json();

    if (data.status === 200) {
      removeCommit(projectId, commitId);
      alert("Commit rejected!");
    } else {
      alert("Commit not rejected!");
    }

    setShowRejectModal(false);
  };
  
  const setCommitForProject = (projectId, commitData) => {
    setCommitData((prevCommitData) => ({
      ...prevCommitData,
      [projectId]: commitData,
    }));
  };

  const handleRejectClick = (commitId) => {
    setRejectCommitId(commitId);
    handleRejectSubmit(commitId);
    window.location.reload();
  };

  const handleCloseRejectModal = () => {
    setRejectionReason("");
    setShowRejectModal(false);
  };

  const removeCommit = (projectId, commitId) => {
    setCommitData((prevCommitData) => ({
      ...prevCommitData,
      [projectId]: prevCommitData[projectId]
        ? prevCommitData[projectId].filter(
            (commit) => commit.commit_id !== commitId
          )
        : [], 
    }));
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch(
          `http://localhost:3300/get/projects/publisher/${loginCredentials.user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        const data = await res.json();
        console.log("Projects:", data);
  
        if (data.status !== 400) {
          setCodeData(Array.isArray(data) ? data : [data]);
  
          for (const project of data) {
            try {
              const commitResponse = await fetch(
                `http://localhost:3300/get/commit/project/${project.project_id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-type": "application/json",
                  },
                }
              );
              
              const commitData = await commitResponse.json();
              
              if (commitResponse.status === 200) {
                // Process commitData
                setCommitForProject(project.project_id, commitData);
              } else {
                console.error(`Error fetching commit data for Project ${project.project_id}:`, commitData);
              }
              
            } catch (err) {
              console.error(err);
            }
          }
        } else {
          console.log("Error fetching projects:", data.errorMsg);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProjects();
  }, [loginCredentials]);
  

  return (
    <>
    <center>
        <NavLink to={`/${loginCredentials?.privilege}-portal`} className="btn btn-primary">
          Go Back
        </NavLink>
        </center>
        <hr/>

      <div className="projects-container">
  {codeData && codeData.length > 0 ? (
    <table>
      <thead>
        <tr>
          <th>Project ID</th>
          <th>Project Path</th>
          <th>Pending Commit Details</th>
        </tr>
      </thead>
      <tbody>
        {codeData.map((project, i) => (
          <tr key={i}>
            <td>{project.project_id}</td>
            <td>{project.code_path}</td>
            <td>
              {commitData[project.project_id] &&
                commitData[project.project_id].map((commit) => (
                  <div key={commit.commit_id}>
                    Commit ID: {commit.commit_id}
                    <br />
                    Contributor ID: {commit.contributor_id}
                    <br />
                    Commit Path: {commit.commit_path}
                    <br />
                    <Button
                      variant="primary"
                      onClick={async () => {
                        const commitId = commit.commit_id;
                        const projectId = project.project_id;
                        const commit_manage = await fetch(
                          `http://localhost:3300/manage/commit/accept/${commitId}`,
                          {
                            method: "POST",
                            headers: {
                              "Content-type": "application/json",
                            },
                          }
                        );

                        const data = await commit_manage.json();

                        if (data.status === 200) {
                          
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
                            
                              if(tokenBalance >= project.tokens_offered) {
                                const getPublisherWalletFromDatabase = await fetch(
                                  `http://localhost:3300/get/wallet/${commit.contributor_id}`,
                                  {
                                    method: "GET",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                  }
                                );
                          
                                const contributorWallet = await getPublisherWalletFromDatabase.json();
                                
                                if (contributorWallet.status === 200) {
                                  await codeTokensContract.methods.transfer(contributorWallet.accountAddress, project.tokens_required).send({ from: userAddress });
                                  alert(`Token transfer successful!`);
                                  removeCommit(projectId, commitId);
                                  alert("Commit accepted!");
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
                          // const transferTokensAPI = await fetch(
                          //   `http://localhost:3300/transfer/tokens/${loginCredentials.user_id}/${commit.contributor_id}/${project.tokens_required}`,
                          //   {
                          //     method: "POST",
                          //     headers: {
                          //       "Content-Type": "application/json",
                          //     },
                          //   }
                          // );

                          // const APIResponse = await transferTokensAPI.json();

                          // if (APIResponse.status === 200) {
                          //   alert(
                          //     `Sent CTKN${APIResponse._amount} to ${APIResponse._to}`
                          //   );

                          //   const recordTx = await fetch(
                          //     `http://localhost:3300/recordTx/${loginCredentials.user_id}/${APIResponse._to}/${APIResponse._amount}`,
                          //     {
                          //       method: "POST",
                          //       headers: {
                          //         "Content-Type": "application/json",
                          //       },
                          //     }
                          //   );

                          //   const data = await recordTx.json();

                          //   if (data.status === 200) {
                          //     alert("Tx recorded");
                          //   } else {
                          //     alert("Tx cannot be recorded");
                          //   }
                          // } else {
                          //   alert(
                          //     "There was some issue granting tokens to the contributor."
                          //   );
                          // }
                        } else {
                          alert(
                            `Commit not accepted!\n Reason: ${data.errorMsg}`
                          );
                        }
                      }}
                    >
                      Accept
                    </Button>{" "}
                    &nbsp;
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleRejectClick(commit.commit_id);
                      }}
                    >
                      Reject
                    </Button>
                    <br />
                  </div>
                ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No projects published yet. Therefore, no commits possible.</p>
  )}
</div>

    </>
  );
};

export default ManageCommits;