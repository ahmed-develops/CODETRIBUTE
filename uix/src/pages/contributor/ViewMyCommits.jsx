import { useState, useEffect } from "react";
import "../../assets/ViewProjects.css";

const ViewMyCommits = ({ loginCredentials }) => {
  const [commitData, setCommitData] = useState([]);

  useEffect(() => {
    const loadCommits = async () => {
      try {
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
          setCommitData(data);
        } else {
          setCommitData([data]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadCommits();
  }, []);

  return (
    <>
      <div className="commit-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Project ID</th>
              <th>Code Path</th>
              <th>Commit Path</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {commitData.map((val, i) => (
              <tr key={i}>
                <td>{val.commit_id}</td>
                <td>{val.project_id}</td>
                <td className="path-cell">{val.code_path}</td>
                <td className="path-cell">{val.commit_path}</td>
                <td>{val.commit_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ViewMyCommits;
