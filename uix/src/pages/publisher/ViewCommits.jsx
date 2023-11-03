import { useEffect, useState } from "react";
import "../../assets/ViewProjects.css";

const ViewCommits = ({ loginCredentials }) => {
  const [commitData, setCodeData] = useState([]);

  useEffect(() => {
    const loadCommits = async () => {
      try {
        const res = await fetch(
          `http://localhost:3300/get/commits/projects/${loginCredentials.user_id}`,
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
      } catch (error) {
        console.error(error);
      }
    };
    loadCommits();
  }, []);

  return (
    <div className="commits-container">
      <table>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Commit Details</th>
            <th>Timestamp</th>
            <th>Contributor</th>
          </tr>
        </thead>
        <tbody>
            { commitData.map((val, i) => (
            <tr key={i}>
              <td>{val.project_id}</td>
              <td className="path-cell">{val.commit_path}</td>
              <td>{val.timestamp}</td>
              <td>{val.contributor_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCommits;