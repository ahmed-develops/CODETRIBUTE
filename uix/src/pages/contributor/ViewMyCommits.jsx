// import React, { useState, useEffect } from "react";
// import "../../assets/ViewProjects.css";
// import Button from "react-bootstrap/esm/Button";
// import { NavLink } from "react-router-dom";
// const ViewMyCommits = ({ loginCredentials }) => {
//   const [commitData, setCommitData] = useState([]);
//   const [projectData, setProjectData] = useState([]);
//   const [selectedProjectId, setSelectedProjectId] = useState(null);

//   useEffect(() => {
//     const loadCommits = async () => {
//       try {
//         if (!loginCredentials || !loginCredentials.user_id) {
//           console.error('Login credentials are missing');
//           return;
//         }

//         const res = await fetch(
//           `http://localhost:3300/get/commit/contributor/${loginCredentials.user_id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data = await res.json();
//         console.log(data);

//         if (Array.isArray(data)) {
//           const mergedCommitData = data.reduce((merged, commit) => {
//             const existingProject = merged.find((item) => item.project_id === commit.project_id);
//             if (existingProject) {
//               existingProject.commits.push(commit);
//             } else {
//               merged.push({
//                 project_id: commit.project_id,
//                 commits: [commit],
//               });
//             }
//             return merged;
//           }, []);
//           setCommitData(mergedCommitData);
//         }
//         else {
//           let _data = [data];
//           const mergedCommitData = _data.reduce((merged, commit) => {
//             const existingProject = merged.find((item) => item.project_id === commit.project_id);
//             if (existingProject) {
//               existingProject.commits.push(commit);
//             } else {
//               merged.push({
//                 project_id: commit.project_id,
//                 commits: [commit],
//               });
//             }
//             return merged;
//           }, []);
//           setCommitData(mergedCommitData);
//         }      
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     const loadProjects = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3300/get/projects/${loginCredentials.user_id}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data = await res.json();
//         console.log(data);

//         setProjectData(data || []);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     loadProjects();
//     loadCommits();
//   }, [loginCredentials.user_id]);

//   const handleProjectClick = (projectId) => {
//     setSelectedProjectId((prevId) => (prevId === projectId ? null : projectId));
//   };

//   return (
//     <>
//     <center>
//     <NavLink to='/contributor-portal' className='btn btn-primary'>
//       Go Back
//     </NavLink>
//     </center>
//     <div className="commit-container">
      
//       <table>
//         <thead>
//           {/* <tr>
//             <th>ID</th>
//             <th>Project ID</th>
//             <th>Code Path</th>
//             <th>Commit Path</th>
//             <th>Status</th>
//           </tr> */}
//         </thead>
//         <tbody>
//           {commitData.map((project) => (
//             <React.Fragment key={project.project_id}>
//               <tr>
//                 <td colSpan="5">
//                   <Button onClick={() => handleProjectClick(project.project_id)}>
//                     {project.project_id}
//                   </Button>
//                 </td>
//               </tr>
//               <tr className={`selected-project-details-row ${selectedProjectId === project.project_id ? "show" : ""}`}>
//                 <td colSpan="5">
//                   <div className={`selected-project-details ${selectedProjectId === project.project_id ? "show" : ""}`}>
//                     <h2>Commit Details for Project {project.project_id}</h2>
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>ID</th>
//                           <th>Code Path</th>
//                           <th>Commit Path</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {project.commits.map((commit, i) => (
//                           <tr key={i}>
//                             <td>{commit.commit_id}</td>
//                             <td className="path-cell">{commit.code_path}</td>
//                             <td className="path-cell">{commit.commit_path}</td>
//                             <td>{commit.commit_status}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </td>
//               </tr>
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     </>
//   );
// };

// export default ViewMyCommits;

import React, { useState, useEffect } from "react";
import "../../assets/ViewProjects.css";
import Button from "react-bootstrap/esm/Button";
import { NavLink } from "react-router-dom";

const ViewMyCommits = ({ loginCredentials }) => {
  const [commitData, setCommitData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const loadCommits = async () => {
      try {
        if (!loginCredentials || !loginCredentials.user_id) {
          console.error('Login credentials are missing');
          return;
        }

        const res = await fetch(
          `http://localhost:3300/get/commit/contributor/${loginCredentials.user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        console.log(data);

        if (Array.isArray(data)) {
          const mergedCommitData = data.reduce((merged, commit) => {
            const existingProject = merged.find((item) => item.project_id === commit.project_id);
            if (existingProject) {
              existingProject.commits.push(commit);
            } else {
              merged.push({
                project_id: commit.project_id,
                commits: [commit],
              });
            }
            return merged;
          }, []);
          setCommitData(mergedCommitData);
        } else {
          let _data = [data];
          const mergedCommitData = _data.reduce((merged, commit) => {
            const existingProject = merged.find((item) => item.project_id === commit.project_id);
            if (existingProject) {
              existingProject.commits.push(commit);
            } else {
              merged.push({
                project_id: commit.project_id,
                commits: [commit],
              });
            }
            return merged;
          }, []);
          setCommitData(mergedCommitData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const loadProjects = async () => {
      try {
        if (!loginCredentials || !loginCredentials.user_id) {
          console.error('Login credentials are missing');
          return;
        }

        const res = await fetch(
          `http://localhost:3300/get/projects/${loginCredentials.user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        console.log(data);

        setProjectData(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadProjects();
    loadCommits();
  }, [loginCredentials]);

  const handleProjectClick = (projectId) => {
    setSelectedProjectId((prevId) => (prevId === projectId ? null : projectId));
  };

  return (
    <>
    <center>
    <NavLink to='/contributor-portal' className='btn btn-primary'>
      Go Back
    </NavLink>
    </center>
    <div className="commit-container">
      
      <table>
        <tbody>
          {commitData.map((project) => (
            <React.Fragment key={project.project_id}>
              <tr>
                <td colSpan="5">
                  <Button onClick={() => handleProjectClick(project.project_id)}>
                    {project.project_id}
                  </Button>
                </td>
              </tr>
              <tr className={`selected-project-details-row ${selectedProjectId === project.project_id ? "show" : ""}`}>
                <td colSpan="5">
                  <div className={`selected-project-details ${selectedProjectId === project.project_id ? "show" : ""}`}>
                    <h2>Commit Details for Project {project.project_id}</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Code Path</th>
                          <th>Commit Path</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.commits.map((commit, i) => (
                          <tr key={i}>
                            <td>{commit.commit_id}</td>
                            <td className="path-cell">{commit.code_path}</td>
                            <td className="path-cell">{commit.commit_path}</td>
                            <td>{commit.commit_status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default ViewMyCommits;
