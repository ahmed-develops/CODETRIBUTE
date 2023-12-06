import React, { useState, useEffect } from "react";
import "../../assets/ViewProjects.css";
import Button from "react-bootstrap/Button";
import UpdateProjectModal from "../../components/UpdateProjectModal";
import { NavLink } from "react-router-dom";

const ViewProjects = ({ loginCredentials }) => {
  const [codeData, setCodeData] = useState([]);
  const [commitCounts, setCommitCounts] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const setCommitCountForProject = (projectId, count) => {
    setCommitCounts((prevCommitCounts) => ({
      ...prevCommitCounts,
      [projectId]: count,
    }));
  };

  const getCommitCountForProject = (projectId) => {
    return commitCounts[projectId];
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
        if (data.status !== 400) {
        if (Array.isArray(data)) {
          setCodeData(data);
        } else {
          setCodeData([data]);
        }
      }
      else {
        return;
      }

        data.forEach(async (val) => {
          const commitCountResponse = await fetch(
            `http://localhost:3300/get/commit/count/${val.project_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const commitCountData = await commitCountResponse.json();

          if (commitCountData) {
            setCommitCountForProject(val.project_id, commitCountData);
          } else {
            setCommitCountForProject(val.project_id, null);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    loadProjects();
  }, [loginCredentials]);

  const handleShowUpdateModal = (selectedProject) => {
    setSelectedProject(selectedProject);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedProject(null);
  };

  return (
    <>
      <center>
        <NavLink to='/publisher-portal' className='btn btn-primary'>
          Go Back
        </NavLink>
      </center>
      <hr/>
      <div className="projects-container">
        {codeData && codeData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Project Name</th>
                <th>Project Description</th>
                <th>Code Path</th>
                <th>Accepted Commit Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {codeData.map((val, i) => (
                <tr key={i}>
                  <td>{val.project_id}</td>
                  <td>{val.project_name}</td>
                  <td className="path-cell">{val.project_description}</td>
                  <td className="path-cell">{val.code_path}</td>
  
                  <td>{getCommitCountForProject(val.project_id) ?? "0"}</td>
  
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleShowUpdateModal(val)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      variant="info"
                      size="sm"
                      onClick={async () => {
                        try {
                          const deleteProjectApi = await fetch(
                            `http://localhost:3300/delete/project/${val.project_id}`,
                            {
                              method: "DELETE",
                              headers: {
                                "Content-type": "application/json",
                              },
                            }
                          );
  
                          const apiRes = await deleteProjectApi.json();
  
                          if (apiRes.status === 200) {
                            alert("Project removed from listing.");
                            window.location.reload();
                          } else {
                            alert(
                              `Could not delete project:\n Reason : ${apiRes.errorMsg}`
                            );
                          }
                        } catch (err) {
                          alert(err.message);
                          console.error(err);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No projects published yet.</p>
        )}
  
        <UpdateProjectModal
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          selectedProject={selectedProject}
        />
      </div>
    </>
  );
  
};

export default ViewProjects;
