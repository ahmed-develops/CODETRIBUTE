import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const ManageCommits = ({ loginCredentials }) => {
  const [codeData, setCodeData] = useState([]);
  const [commitData, setCommitData] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectCommitId, setRejectCommitId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const handleRejectSubmit = async (project) => {
    const commitId = rejectCommitId;
    const projectId = project.project_id;

    const commit_manage = await fetch(
      `http://localhost:3300/manage/commit/reject/${commitId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ reason: rejectionReason })
      }
    );

    const data = await commit_manage.json();

    if (data.status === 200) {
      removeCommit(projectId, commitId);
      alert("Commit rejected!");
    } else {
      alert("Commit not rejected!");
    }

    // Close the modal when done
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
    setShowRejectModal(true);
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
        console.table(data);
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

            if (commitResponse.status === 200) {
              const commitData = await commitResponse.json();
              setCommitForProject(project.project_id, commitData);
            }
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProjects();
  }, []);

  return (
    <>
      <Modal show={showRejectModal} onHide={handleCloseRejectModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Rejection Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Reason for Rejection:</Form.Label>
              <Form.Control
                type="text"
                name="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRejectModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRejectSubmit}>
            Submit Rejection
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="projects-container">
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
                              removeCommit(projectId, commitId);
                              alert("Commit accepted!");

                              const transferTokensAPI = await fetch(`http://localhost:3300/transfer/tokens/${loginCredentials.user_id}/${commit.contributor_id}/${project.tokens_required}`,
                                {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type' : 'application/json'
                                  }
                                }  
                              );

                              const APIResponse = await transferTokensAPI.json();

                              if (APIResponse.status === 200) {
                                alert(`Sent CTKN${APIResponse._amount} to ${APIResponse._to}`);
                                
                                const recordTx = await fetch(`http://localhost:3300/recordTx/${loginCredentials.user_id}/${APIResponse._to}/${APIResponse._amount}`,
                                {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type' : 'application/json'
                                  }
                                });

                                const data = await recordTx.json();

                                if (data.status === 200) {
                                  alert('Tx recorded');
                                }
                                else {
                                  alert('Tx cannot be recorded');
                                }
                              }
                              else {
                                alert("There was some issue granting tokens to the contributor.");
                              }
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
      </div>
    </>
  );
};

export default ManageCommits;