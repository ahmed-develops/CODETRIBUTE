import { useEffect, useState } from "react";
import "../../assets/ViewProjects.css"; // Import a CSS file for styling

const ViewProjects = ({ loginCredentials }) => {
    const [codeData, setCodeData] = useState([]);
    const [commitCounts, setCommitCounts] = useState({});

    const setCommitCountForProject = (projectId, count) => {
      setCommitCounts(prevCommitCounts => ({
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
          if (Array.isArray(data)) {
            setCodeData(data);
          } else {
            setCodeData([data]);
          }
  
          // Fetch commit counts for each project when the projects are loaded
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
    }, []);

  return (
    <div className="projects-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Project Name</th>
            <th>Project Description</th>
            <th>Code Path</th>
            <th>Accepted Commit Count</th>
          </tr>
        </thead>
        <tbody>
          {codeData.map((val, i) => (
            <tr key={i}>
              <td>{val.project_id}</td>
              <td>{val.project_name}</td>
              <td className="path-cell">{val.project_description}</td>
              <td className="path-cell">{val.code_path}</td>
              
              <td>
               {getCommitCountForProject(val.project_id) ?? "0"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewProjects;
